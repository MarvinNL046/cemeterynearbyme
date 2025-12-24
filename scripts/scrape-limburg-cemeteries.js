const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeCemetery(browser, url) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Handle cookie consent if present
        try {
            await page.click('button:has-text("Toestemming geven")', { timeout: 2000 });
        } catch (e) {
            // Cookie consent might not be present
        }
        
        // Extract cemetery information
        const cemeteryData = await page.evaluate(() => {
            const data = {
                naam: '',
                adres: '',
                postcode: '',
                plaats: '',
                telefoon: '',
                email: '',
                website: '',
                openingstijden: '',
                type: '',
                bijzonderheden: []
            };
            
            // Extract name
            const nameEl = document.querySelector('h1');
            if (nameEl) data.naam = nameEl.textContent.trim();
            
            // Extract details from the information sections
            const infoSections = document.querySelectorAll('.info-section, .details-section, .contact-section');
            infoSections.forEach(section => {
                const text = section.textContent;
                
                // Address
                if (text.includes('Adres:')) {
                    const adresMatch = text.match(/Adres:\s*([^,\n]+)/);
                    if (adresMatch) data.adres = adresMatch[1].trim();
                }
                
                // Postcode and Plaats
                const postcodeMatch = text.match(/(\d{4}\s*[A-Z]{2})\s+([^\n]+)/);
                if (postcodeMatch) {
                    data.postcode = postcodeMatch[1];
                    data.plaats = postcodeMatch[2].trim();
                }
                
                // Phone
                const phoneMatch = text.match(/Telefoon:\s*([\d\s-]+)/);
                if (phoneMatch) data.telefoon = phoneMatch[1].trim();
                
                // Email
                const emailMatch = text.match(/E-mail:\s*([^\s@]+@[^\s@]+\.[^\s@]+)/);
                if (emailMatch) data.email = emailMatch[1];
                
                // Website
                const websiteMatch = text.match(/Website:\s*(https?:\/\/[^\s]+)/);
                if (websiteMatch) data.website = websiteMatch[1];
                
                // Opening hours
                if (text.includes('Openingstijden:')) {
                    const openingMatch = text.match(/Openingstijden:\s*([^\.]+)/);
                    if (openingMatch) data.openingstijden = openingMatch[1].trim();
                }
                
                // Type
                if (text.includes('Type:')) {
                    const typeMatch = text.match(/Type:\s*([^\n]+)/);
                    if (typeMatch) data.type = typeMatch[1].trim();
                }
            });
            
            // Extract special features
            const features = document.querySelectorAll('.feature-item, .bijzonderheid');
            features.forEach(feature => {
                const text = feature.textContent.trim();
                if (text) data.bijzonderheden.push(text);
            });
            
            return data;
        });
        
        return cemeteryData;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    } finally {
        await page.close();
    }
}

async function scrapeMunicipality(browser, municipalityUrl) {
    const page = await browser.newPage();
    const fullUrl = `https://www.begraafplaatsinformatie.nl${municipalityUrl}`;
    
    try {
        console.log(`Scraping municipality: ${fullUrl}`);
        await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Handle cookie consent if present
        try {
            await page.click('button:has-text("Toestemming geven")', { timeout: 2000 });
        } catch (e) {
            // Cookie consent might not be present
        }
        
        // Extract cemetery links - looking for "Bekijk details" links
        const cemeteryLinks = await page.evaluate(() => {
            const links = [];
            // Look for all "Bekijk details" links which point to cemetery detail pages
            const linkElements = document.querySelectorAll('a');
            linkElements.forEach(el => {
                const href = el.getAttribute('href');
                const text = el.textContent.trim();
                
                // Check if this is a "Bekijk details" link or contains cemetery-specific URL pattern
                if (href && text === 'Bekijk details' && 
                    (href.includes('/maastricht/') || 
                     href.includes('/beek/') || 
                     href.includes('/beesel/') ||
                     href.includes('/brunssum/') ||
                     href.includes('/gemeente/') === false)) {
                    
                    // Get the cemetery name from the parent card
                    const card = el.closest('.col-md-6, .col-lg-4, div[class*="col"], .cemetery-card');
                    if (card) {
                        const nameEl = card.querySelector('h3');
                        if (nameEl) {
                            links.push({
                                url: href.startsWith('http') ? href : `https://www.begraafplaatsinformatie.nl${href}`,
                                naam: nameEl.textContent.trim()
                            });
                        }
                    }
                }
            });
            return links;
        });
        
        console.log(`Found ${cemeteryLinks.length} cemeteries in ${municipalityUrl}`);
        
        // Extract municipality info
        const municipalityInfo = await page.evaluate(() => {
            const gemeente = document.querySelector('h1')?.textContent.trim() || '';
            return gemeente.replace('Begraafplaatsen in ', '');
        });
        
        // Scrape each cemetery
        const cemeteries = [];
        for (const link of cemeteryLinks) {
            console.log(`  Scraping cemetery: ${link.naam}`);
            const cemeteryData = await scrapeCemetery(browser, link.url);
            if (cemeteryData) {
                cemeteryData.gemeente = municipalityInfo;
                cemeteryData.provincie = 'Limburg';
                cemeteryData.url = link.url;
                cemeteries.push(cemeteryData);
            }
            // Add delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return cemeteries;
    } catch (error) {
        console.error(`Error scraping municipality ${fullUrl}:`, error.message);
        return [];
    } finally {
        await page.close();
    }
}

async function main() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        // Read municipality URLs
        const municipalityUrls = fs.readFileSync('limburg-municipalities.txt', 'utf8')
            .split('\n')
            .filter(url => url.trim());
        
        console.log(`Starting to scrape ${municipalityUrls.length} municipalities...`);
        
        const allCemeteries = [];
        
        // Process each municipality
        for (const municipalityUrl of municipalityUrls) {
            const cemeteries = await scrapeMunicipality(browser, municipalityUrl);
            allCemeteries.push(...cemeteries);
            
            // Save progress
            fs.writeFileSync(
                'limburg-cemeteries-progress.json', 
                JSON.stringify(allCemeteries, null, 2)
            );
            
            // Add delay between municipalities
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Save final result
        fs.writeFileSync(
            'limburg-cemeteries.json', 
            JSON.stringify(allCemeteries, null, 2)
        );
        
        console.log(`\nScraping completed! Total cemeteries found: ${allCemeteries.length}`);
        
        // Generate summary
        const summary = {
            totaal_begraafplaatsen: allCemeteries.length,
            per_gemeente: {}
        };
        
        allCemeteries.forEach(cemetery => {
            if (!summary.per_gemeente[cemetery.gemeente]) {
                summary.per_gemeente[cemetery.gemeente] = 0;
            }
            summary.per_gemeente[cemetery.gemeente]++;
        });
        
        fs.writeFileSync(
            'limburg-cemeteries-summary.json',
            JSON.stringify(summary, null, 2)
        );
        
        console.log('\nSummary:', summary);
        
    } catch (error) {
        console.error('Error in main:', error);
    } finally {
        await browser.close();
    }
}

// Run the scraper
main().catch(console.error);