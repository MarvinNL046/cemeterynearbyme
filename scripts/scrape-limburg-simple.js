const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAllCemeteries() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        console.log('Navigating to Limburg page...');
        
        // Go to the main Limburg page
        await page.goto('https://www.begraafplaatsinformatie.nl/limburg', { 
            waitUntil: 'networkidle2', 
            timeout: 60000 
        });
        
        // Wait a bit for content to load
        await page.waitForTimeout(3000);
        
        // Handle cookie consent if present
        try {
            const consentButton = await page.$('button:contains("Toestemming geven"), button:contains("Akkoord")');
            if (consentButton) {
                await consentButton.click();
                await page.waitForTimeout(1000);
            }
        } catch (e) {
            console.log('No cookie consent found or already accepted');
        }
        
        // Extract all cemetery links from the page
        console.log('Extracting cemetery links...');
        const cemeteryData = await page.evaluate(() => {
            const cemeteries = [];
            
            // Find all links that look like cemetery detail pages
            const links = document.querySelectorAll('a');
            const processedUrls = new Set();
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                const text = link.textContent.trim();
                
                // Check if this is a cemetery detail link
                if (href && !processedUrls.has(href)) {
                    // Look for links that contain municipality names followed by cemetery names
                    if ((href.includes('/gemeente/') && href.split('/').length > 3) ||
                        (href.includes('/') && !href.includes('/gemeente/') && !href.includes('/provincie/') && 
                         !href.includes('/over-ons') && !href.includes('/contact') && 
                         !href.includes('/privacy') && !href.includes('/kaart') &&
                         href.split('/').length >= 3)) {
                        
                        // Try to find cemetery name and municipality
                        let cemeteryName = text;
                        let municipality = '';
                        
                        // Extract municipality from URL
                        const urlParts = href.split('/');
                        if (urlParts.length >= 3) {
                            municipality = urlParts[urlParts.length - 2];
                            
                            // Skip if this is actually a gemeente overview page
                            if (href.endsWith('/gemeente/' + municipality)) {
                                return;
                            }
                        }
                        
                        // Look for parent elements that might contain cemetery info
                        const parent = link.closest('.col-md-4, .col-lg-3, .cemetery-item, div[class*="col"]');
                        if (parent) {
                            const h3 = parent.querySelector('h3, h4');
                            if (h3) cemeteryName = h3.textContent.trim();
                            
                            const badge = parent.querySelector('.badge, .type');
                            const type = badge ? badge.textContent.trim() : '';
                            
                            processedUrls.add(href);
                            cemeteries.push({
                                naam: cemeteryName,
                                gemeente: municipality,
                                type: type,
                                url: href.startsWith('http') ? href : 'https://www.begraafplaatsinformatie.nl' + href
                            });
                        }
                    }
                }
            });
            
            return cemeteries;
        });
        
        console.log(`Found ${cemeteryData.length} cemetery links`);
        
        // Save the data
        const outputData = {
            provincie: 'Limburg',
            totaal: cemeteryData.length,
            scraped_at: new Date().toISOString(),
            begraafplaatsen: cemeteryData
        };
        
        fs.writeFileSync(
            'limburg-all-cemeteries.json',
            JSON.stringify(outputData, null, 2)
        );
        
        console.log('Data saved to limburg-all-cemeteries.json');
        
        // Create summary
        const summary = {
            totaal_begraafplaatsen: cemeteryData.length,
            per_gemeente: {}
        };
        
        cemeteryData.forEach(cemetery => {
            if (!summary.per_gemeente[cemetery.gemeente]) {
                summary.per_gemeente[cemetery.gemeente] = 0;
            }
            summary.per_gemeente[cemetery.gemeente]++;
        });
        
        console.log('\nSummary:');
        console.log(`Total cemeteries: ${summary.totaal_begraafplaatsen}`);
        console.log('Per gemeente:', summary.per_gemeente);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

// Run the scraper
scrapeAllCemeteries().catch(console.error);