const express = require('express');
const app = express();
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

app.get('/', async (req, res) => {
    let browser = null;

    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.goto('https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/Destined-Rivals-Booster-Bundle?language=2', {
            waitUntil: 'networkidle0',
        });

        const price = await page.evaluate(() => {
            const priceElement = document.querySelector('.price-container .price'); // adapte le sélecteur
            return priceElement ? priceElement.innerText : 'Prix introuvable';
        });

        res.json({ success: true, price });
    } catch (err) {
        console.error('Scraping failed:', err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
