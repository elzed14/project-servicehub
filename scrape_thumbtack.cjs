const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Set a user agent to mimic a real browser
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  await page.goto('https://www.thumbtack.com/');

  // Wait for the page to load completely
  await page.waitForSelector('body', { timeout: 10000 });

  // Handle CAPTCHA if present
  const captchaSelector = '#challenge-container';
  if (await page.$(captchaSelector)) {
    console.log('CAPTCHA detected. Please solve it manually.');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  }

  // Log the page content to inspect it manually
  const pageContent = await page.content();
  console.log('Page Content:', pageContent);

  // Extract information about Thumbtack features
  const features = await page.evaluate(() => {
    const featureElements = document.querySelectorAll('.feature');
    return Array.from(featureElements).map(element => ({
      title: element.querySelector('.feature-title')?.innerText || 'No title',
      description: element.querySelector('.feature-description')?.innerText || 'No description',
    }));
  });

  console.log('Thumbtack Features:', features);

  await browser.close();
})();
