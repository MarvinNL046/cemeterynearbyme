const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = './scraped-data';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleCookieConsent(page) {
    try {
        await page.waitForSelector('button', { timeout: 3000 });
        const consentButton = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const button = buttons.find(btn => 
                btn.textContent.includes('Toestemming geven') || 
                btn.textContent.includes('Akkoord') ||
                btn.textContent.includes('Accepteren')
            );
            if (button) {
                button.click();
                return true;
            }
            return false;
        });
        if (consentButton) {
            await delay(1000);
            console.log('Cookie consent handled');
        }
    } catch (e) {
        // No cookie consent needed
    }
}

async function scrapeCemeteryDetails(browser, url) {
    const page = await browser.newPage();
    try {
        console.log(`      Scraping cemetery details from: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await handleCookieConsent(page);
        
        const details = await page.evaluate(() => {
            const data = {
                naam: document.querySelector('h1')?.textContent.trim() || '',
                gemeente: '',
                provincie: '',
                adres: '',
                postcode: '',
                plaats: '',
                type: '',
                jaar_oprichting: '',
                openingstijden: '',
                telefoon: '',
                email: '',
                website: '',
                faciliteiten: [],
                kosten_info: '',
                gps_coordinaten: '',
                reviews: []
            };
            
            // Extract gemeente
            const gemeenteEl = document.querySelector('h1 + div, .gemeente-naam');
            if (gemeenteEl && gemeenteEl.textContent.includes('Gemeente')) {
                data.gemeente = gemeenteEl.textContent.replace('Gemeente', '').trim();
            }
            
            // Find all sections
            const sections = document.querySelectorAll('h2');
            sections.forEach(header => {
                const headerText = header.textContent.trim();
                const parent = header.parentElement;
                
                if (headerText === 'Adres en contact') {
                    const paragraphs = parent.querySelectorAll('p');
                    paragraphs.forEach((p, index) => {
                        const text = p.textContent.trim();
                        if (index === 0 && text) {
                            data.adres = text;
                        } else if (text.match(/\d{4}\s*[A-Z]{2}/)) {
                            const match = text.match(/(\d{4}\s*[A-Z]{2})\s+(.*)/);
                            if (match) {
                                data.postcode = match[1];
                                const plaatsMatch = match[2].match(/([^(]+)/);
                                data.plaats = plaatsMatch ? plaatsMatch[1].trim() : match[2];
                            }
                        } else if (text && !text.includes('(') && !data.provincie) {
                            data.provincie = text;
                        }
                    });
                }
                
                if (headerText === 'Algemene informatie') {
                    const paragraphs = parent.querySelectorAll('p');
                    paragraphs.forEach(p => {
                        const text = p.textContent;
                        if (text.includes('Type:')) {
                            data.type = text.replace('Type:', '').trim();
                        } else if (text.includes('Jaar van oprichting:')) {
                            data.jaar_oprichting = text.replace('Jaar van oprichting:', '').trim();
                        }
                    });
                }
                
                if (headerText === 'Openingstijden') {
                    const content = parent.textContent.replace('Openingstijden', '').trim();
                    data.openingstijden = content;
                }
                
                if (headerText === 'Faciliteiten') {
                    const items = parent.querySelectorAll('li, p');
                    items.forEach(item => {
                        const text = item.textContent.trim();
                        if (text && text !== 'Faciliteiten') {
                            data.faciliteiten.push(text);
                        }
                    });
                }
                
                if (headerText === 'Kosten informatie') {
                    const content = parent.textContent.replace('Kosten informatie', '').trim();
                    data.kosten_info = content;
                }
            });
            
            // Extract contact info from anywhere on page
            const bodyText = document.body.textContent;
            
            const phoneMatch = bodyText.match(/(?:Telefoon|Tel\.?):?\s*([\d\s\-\+]+)/i);
            if (phoneMatch) data.telefoon = phoneMatch[1].trim();
            
            const emailMatch = bodyText.match(/(?:E-mail|Email):?\s*([^\s@]+@[^\s@]+\.[^\s@]+)/i);
            if (emailMatch) {
                const email = emailMatch[1];
                // Exclude emails from begraafplaatsinformatie.nl
                if (!email.includes('@begraafplaatsinformatie.nl')) {
                    data.email = email;
                }
            }
            
            const websiteMatch = bodyText.match(/(?:Website|Web):?\s*(https?:\/\/[^\s]+)/i);
            if (websiteMatch) {
                const website = websiteMatch[1];
                // Exclude websites from begraafplaatsinformatie.nl
                if (!website.includes('begraafplaatsinformatie.nl')) {
                    data.website = website;
                }
            }
            
            // Extract GPS coordinates if available
            const mapEl = document.querySelector('.mapboxgl-map, #map, .map');
            if (mapEl) {
                const mapData = mapEl.getAttribute('data-lat') || mapEl.getAttribute('data-lng');
                if (mapData) {
                    data.gps_coordinaten = `${mapEl.getAttribute('data-lat')}, ${mapEl.getAttribute('data-lng')}`;
                }
            }
            
            // Extract reviews
            const reviewContainers = document.querySelectorAll('div:has(> div > img[alt])');
            const seenReviews = new Set();
            
            reviewContainers.forEach(container => {
                const img = container.querySelector('img[alt]');
                if (img && img.alt && !img.alt.includes('Logo') && !seenReviews.has(img.alt)) {
                    const name = img.alt;
                    let stars = 0;
                    let reviewText = '';
                    
                    // Look for stars
                    const parent = container.parentElement;
                    const starElements = parent.querySelectorAll('div');
                    starElements.forEach(el => {
                        if (el.textContent.includes('★')) {
                            stars = (el.textContent.match(/★/g) || []).length;
                        }
                    });
                    
                    // Look for review text
                    let nextEl = container.parentElement;
                    while (nextEl && nextEl.nextElementSibling) {
                        nextEl = nextEl.nextElementSibling;
                        const text = nextEl.textContent.trim();
                        if (text && !text.includes('★') && !text.includes('geleden') && text.length > 20) {
                            reviewText = text;
                            break;
                        }
                    }
                    
                    if (name && reviewText && stars > 0) {
                        data.reviews.push({
                            naam: name,
                            stars: stars,
                            tekst: reviewText
                        });
                        seenReviews.add(name);
                    }
                }
            });
            
            return data;
        });
        
        return details;
    } catch (error) {
        console.error(`      Error scraping cemetery details: ${error.message}`);
        return null;
    } finally {
        await page.close();
    }
}

async function scrapeLocation(browser, locationUrl, gemeente, provincie) {
    const page = await browser.newPage();
    try {
        // Check if URL already contains domain
        const fullUrl = locationUrl.startsWith('http') 
            ? locationUrl 
            : `https://www.begraafplaatsinformatie.nl${locationUrl}`;
        console.log(`    Scraping location: ${fullUrl}`);
        await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await handleCookieConsent(page);
        
        // Extract all cemetery links from this location
        const cemeteries = await page.evaluate(() => {
            const links = [];
            const processed = new Set();
            
            // Look for cemetery detail links - they have the pattern /plaats/begraafplaats-naam
            document.querySelectorAll('a[href]').forEach(a => {
                const href = a.getAttribute('href');
                
                // Check if this looks like a cemetery detail page
                if (href && !processed.has(href)) {
                    // Pattern: /gemeente/cemetery-name or /plaats/cemetery-name
                    const pathParts = href.split('/');
                    
                    // Skip navigation links and non-cemetery pages
                    const skipPatterns = [
                        '/gemeente/', '/begraafplaatsen/', '/provincie/', 
                        '/veelgestelde-vragen', '/over-ons', '/contact', 
                        '/privacy', '/kaart', '/uitvaartverzekering',
                        'noord-brabant', 'noord-holland', 'zuid-holland',
                        'limburg', 'utrecht', 'groningen', 'friesland',
                        'drenthe', 'flevoland', 'zeeland', 'overijssel',
                        'gelderland'
                    ];
                    
                    const isSkipLink = skipPatterns.some(pattern => href.includes(pattern));
                    
                    // Must have -in- pattern and be a detail page
                    if (pathParts.length >= 3 && 
                        !isSkipLink &&
                        href.includes('-in-') && 
                        pathParts[pathParts.length - 1].includes('-')) {
                        
                        // Try to get cemetery name from link text or parent element
                        let naam = a.textContent.trim();
                        
                        // If link text is generic (like "Bekijk details"), look for name in parent
                        if (naam === 'Bekijk details' || naam === '') {
                            const parent = a.closest('.col-md-6, .col-lg-4, div[class*="col"], .cemetery-item');
                            if (parent) {
                                const nameEl = parent.querySelector('h3, h4, .cemetery-name');
                                if (nameEl) naam = nameEl.textContent.trim();
                            }
                        }
                        
                        // Get type from parent element
                        let type = '';
                        const parent = a.closest('.col-md-6, .col-lg-4, div[class*="col"], .cemetery-item');
                        if (parent) {
                            const typeEl = parent.querySelector('.badge, .cemetery-type, .type');
                            if (typeEl) type = typeEl.textContent.trim();
                        }
                        
                        if (naam || href.includes('-in-')) {
                            links.push({
                                naam: naam || 'Onbekend',
                                type: type,
                                url: href.startsWith('http') ? href : `https://www.begraafplaatsinformatie.nl${href}`
                            });
                            processed.add(href);
                        }
                    }
                }
            });
            
            return links;
        });
        
        console.log(`      Found ${cemeteries.length} cemeteries in this location`);
        
        // Scrape details for each cemetery
        const detailedCemeteries = [];
        for (const cemetery of cemeteries) {
            const details = await scrapeCemeteryDetails(browser, cemetery.url);
            if (details) {
                details.url = cemetery.url;
                details.gemeente = gemeente;
                details.provincie = provincie;
                detailedCemeteries.push(details);
            }
            await delay(1500); // Respectful delay
        }
        
        return detailedCemeteries;
    } catch (error) {
        console.error(`    Error scraping location: ${error.message}`);
        return [];
    } finally {
        await page.close();
    }
}

async function scrapeGemeente(browser, gemeenteUrl, provincie) {
    const page = await browser.newPage();
    try {
        // Check if URL already contains domain
        const fullUrl = gemeenteUrl.startsWith('http') 
            ? gemeenteUrl 
            : `https://www.begraafplaatsinformatie.nl${gemeenteUrl}`;
        console.log(`  Scraping gemeente: ${fullUrl}`);
        await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await handleCookieConsent(page);
        
        // Get gemeente name
        const gemeenteName = await page.evaluate(() => {
            const h1 = document.querySelector('h1');
            if (h1) {
                return h1.textContent.replace('Begraafplaatsen in ', '').trim();
            }
            return '';
        });
        
        console.log(`    Gemeente: ${gemeenteName}`);
        
        // Check if this page has locations/places
        const locations = await page.evaluate(() => {
            const locs = [];
            const sections = document.querySelectorAll('h2, h3');
            
            sections.forEach(header => {
                const text = header.textContent.trim();
                if (text === 'Plaatsnamen in ' + document.querySelector('h1')?.textContent.replace('Begraafplaatsen in ', '').trim()) {
                    // Found locations section
                    const parent = header.parentElement;
                    const links = parent.querySelectorAll('a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.includes('/begraafplaatsen/')) {
                            locs.push({
                                naam: link.textContent.trim(),
                                url: href
                            });
                        }
                    });
                }
            });
            
            return locs;
        });
        
        let allCemeteries = [];
        
        // ALWAYS scrape cemeteries from gemeente page itself
        console.log(`    Checking for cemeteries directly on gemeente page...`);
        const gemeenteCemeteries = await page.evaluate(() => {
                const links = [];
                const processed = new Set();
                
                // Look for cemetery detail links
                document.querySelectorAll('a[href]').forEach(a => {
                    const href = a.getAttribute('href');
                    
                    if (href && !processed.has(href)) {
                        const pathParts = href.split('/');
                        
                        // Skip navigation links and non-cemetery pages
                        const skipPatterns = [
                            '/gemeente/', '/begraafplaatsen/', '/provincie/', 
                            '/veelgestelde-vragen', '/over-ons', '/contact', 
                            '/privacy', '/kaart', '/uitvaartverzekering',
                            'noord-brabant', 'noord-holland', 'zuid-holland',
                            'limburg', 'utrecht', 'groningen', 'friesland',
                            'drenthe', 'flevoland', 'zeeland', 'overijssel',
                            'gelderland'
                        ];
                        
                        const isSkipLink = skipPatterns.some(pattern => href.includes(pattern));
                        
                        // Must have -in- pattern and be a detail page
                        if (pathParts.length >= 3 && 
                            !isSkipLink &&
                            href.includes('-in-') && 
                            pathParts[pathParts.length - 1].includes('-')) {
                            
                            let naam = a.textContent.trim();
                            
                            if (naam === 'Bekijk details' || naam === '') {
                                const parent = a.closest('.col-md-6, .col-lg-4, div[class*="col"], .cemetery-item');
                                if (parent) {
                                    const nameEl = parent.querySelector('h3, h4, .cemetery-name');
                                    if (nameEl) naam = nameEl.textContent.trim();
                                }
                            }
                            
                            let type = '';
                            const parent = a.closest('.col-md-6, .col-lg-4, div[class*="col"], .cemetery-item');
                            if (parent) {
                                const typeEl = parent.querySelector('.badge, .cemetery-type, .type');
                                if (typeEl) type = typeEl.textContent.trim();
                            }
                            
                            if (naam || href.includes('-in-')) {
                                links.push({
                                    naam: naam || 'Onbekend',
                                    type: type,
                                    url: href.startsWith('http') ? href : `https://www.begraafplaatsinformatie.nl${href}`
                                });
                                processed.add(href);
                            }
                        }
                    }
                });
                return links;
            });
            
            console.log(`      Found ${gemeenteCemeteries.length} cemeteries directly on gemeente page`);
            
            // Scrape details for each cemetery found on gemeente page
            for (const cemetery of gemeenteCemeteries) {
                const details = await scrapeCemeteryDetails(browser, cemetery.url);
                if (details) {
                    details.url = cemetery.url;
                    details.gemeente = gemeenteName;
                    details.provincie = provincie;
                    allCemeteries.push(details);
                }
                await delay(1500);
            }
        
        // ALSO check if there are locations/places and scrape those too
        if (locations.length > 0) {
            console.log(`    Found ${locations.length} locations in ${gemeenteName}`);
            
            for (const location of locations) {
                const locationCemeteries = await scrapeLocation(browser, location.url, gemeenteName, provincie);
                allCemeteries.push(...locationCemeteries);
                await delay(2000); // Respectful delay between locations
            }
        }
        
        return {
            gemeente: gemeenteName,
            totaal: allCemeteries.length,
            begraafplaatsen: allCemeteries
        };
        
    } catch (error) {
        console.error(`  Error scraping gemeente: ${error.message}`);
        return { gemeente: '', totaal: 0, begraafplaatsen: [] };
    } finally {
        await page.close();
    }
}

async function scrapeProvincie(browser, provincieSlug) {
    const page = await browser.newPage();
    const provincieUrl = `https://www.begraafplaatsinformatie.nl/${provincieSlug}`;
    
    try {
        console.log(`Scraping provincie: ${provincieSlug}`);
        await page.goto(provincieUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await handleCookieConsent(page);
        
        // Get all gemeente links
        const gemeenteLinks = await page.evaluate(() => {
            const links = [];
            const linkElements = document.querySelectorAll('a[href*="/gemeente/"]');
            const processed = new Set();
            
            linkElements.forEach(el => {
                const href = el.getAttribute('href');
                if (href && href.includes('/gemeente/') && !processed.has(href)) {
                    links.push(href);
                    processed.add(href);
                }
            });
            
            return links;
        });
        
        console.log(`Found ${gemeenteLinks.length} gemeentes in ${provincieSlug}`);
        
        const provincieData = {
            provincie: provincieSlug.charAt(0).toUpperCase() + provincieSlug.slice(1),
            totaal_gemeentes: gemeenteLinks.length,
            scraped_at: new Date().toISOString(),
            gemeentes: []
        };
        
        // Scrape each gemeente
        for (const gemeenteUrl of gemeenteLinks) {
            const gemeenteData = await scrapeGemeente(browser, gemeenteUrl, provincieData.provincie);
            provincieData.gemeentes.push(gemeenteData);
            
            // Save progress
            fs.writeFileSync(
                path.join(outputDir, `${provincieSlug}-progress.json`),
                JSON.stringify(provincieData, null, 2)
            );
            
            await delay(3000); // Respectful delay between gemeentes
        }
        
        // Calculate totals
        provincieData.totaal_begraafplaatsen = provincieData.gemeentes.reduce(
            (sum, gemeente) => sum + gemeente.totaal, 0
        );
        
        // Save final result
        fs.writeFileSync(
            path.join(outputDir, `${provincieSlug}-complete.json`),
            JSON.stringify(provincieData, null, 2)
        );
        
        console.log(`Completed ${provincieSlug}: ${provincieData.totaal_begraafplaatsen} cemeteries found`);
        
        return provincieData;
        
    } catch (error) {
        console.error(`Error scraping provincie ${provincieSlug}: ${error.message}`);
        return null;
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
        // Define which provinces to scrape
        const provinces = [
            'limburg',
            // Uncomment to scrape all provinces:
            // 'drenthe',
            // 'flevoland', 
            // 'friesland',
            // 'gelderland',
            // 'groningen',
            // 'noord-brabant',
            // 'noord-holland',
            // 'overijssel',
            // 'utrecht',
            // 'zeeland',
            // 'zuid-holland'
        ];
        
        console.log(`Starting to scrape ${provinces.length} province(s)...`);
        console.log('This will follow the hierarchy: Provincie → Gemeente → Plaats → Begraafplaats\n');
        
        const allData = {
            scraped_at: new Date().toISOString(),
            totaal_provincies: provinces.length,
            provincies: []
        };
        
        for (const provincie of provinces) {
            const provincieData = await scrapeProvincie(browser, provincie);
            if (provincieData) {
                allData.provincies.push(provincieData);
                
                // Create summary for this province
                const summary = {
                    provincie: provincieData.provincie,
                    totaal_gemeentes: provincieData.totaal_gemeentes,
                    totaal_begraafplaatsen: provincieData.totaal_begraafplaatsen,
                    per_gemeente: {}
                };
                
                provincieData.gemeentes.forEach(gemeente => {
                    summary.per_gemeente[gemeente.gemeente] = gemeente.totaal;
                });
                
                fs.writeFileSync(
                    path.join(outputDir, `${provincie}-summary.json`),
                    JSON.stringify(summary, null, 2)
                );
            }
            
            await delay(5000); // Delay between provinces
        }
        
        // Calculate grand totals
        allData.totaal_begraafplaatsen = allData.provincies.reduce(
            (sum, prov) => sum + (prov.totaal_begraafplaatsen || 0), 0
        );
        
        // Save complete dataset
        fs.writeFileSync(
            path.join(outputDir, 'nederland-complete.json'),
            JSON.stringify(allData, null, 2)
        );
        
        console.log('\n=== Scraping Complete ===');
        console.log(`Total provinces: ${allData.totaal_provincies}`);
        console.log(`Total cemeteries: ${allData.totaal_begraafplaatsen}`);
        console.log(`Data saved in: ${outputDir}/`);
        
    } catch (error) {
        console.error('Error in main:', error);
    } finally {
        await browser.close();
    }
}

// Run the scraper
main().catch(console.error);