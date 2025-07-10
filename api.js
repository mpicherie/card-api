const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/Destined-Rivals-Booster-Bundle?language=2');
    const title = await page.title();
    await browser.close();
    res.send(`Page title: ${title}`);
  } catch (e) {
    console.error(e);
    res.status(500).send('Scraping failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
