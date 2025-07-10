const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/api/price", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    await page.waitForSelector("dd.col-6.col-xl-7", { timeout: 15000 });

    const price = await page.evaluate(() => {
      const fromLabel = Array.from(document.querySelectorAll("dt")).find(el =>
        el.textContent.includes("From")
      );
      if (fromLabel) {
        const priceEl = fromLabel.nextElementSibling;
        if (priceEl) return priceEl.textContent.trim();
      }

      const trendLabel = Array.from(document.querySelectorAll("dt")).find(el =>
        el.textContent.includes("Price Trend")
      );
      if (trendLabel) {
        const priceEl = trendLabel.nextElementSibling.querySelector("span");
        if (priceEl) return priceEl.textContent.trim();
      }

      return null;
    });

    await browser.close();

    if (price) {
      res.json({ price: price });
    } else {
      res.status(404).json({ error: "Prix non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
