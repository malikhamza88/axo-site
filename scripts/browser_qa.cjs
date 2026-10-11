// Optional developer QA. Requires Playwright; the published site has no dependencies.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
let browser;

(async () => {
  browser = await chromium.launch({
    executablePath: process.env.AXO_BROWSER_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const origin = process.env.AXO_PREVIEW_URL || 'http://127.0.0.1:8080/';
  const errors = [];
  for (const width of [320, 375, 767, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on('pageerror', e => errors.push(e.message));
    for (const path of ['', 'privacy/', 'terms/', 'support/']) {
      const response = await page.goto(origin + path);
      assert.equal(response.status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow: ' + width + ' ' + path);
      for (const image of await page.locator('img:visible').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(i => new Promise((resolve, reject) => {
          if (i.complete) return i.naturalWidth > 0 ? resolve() : reject(new Error('Broken image: ' + i.src));
          i.addEventListener('load', resolve, { once: true });
          i.addEventListener('error', () => reject(new Error('Broken image: ' + i.src)), { once: true });
        }));
      }
      if (!path) {
        assert.equal(await page.locator('.tiny-win').count(), 0);
        assert.equal(await page.locator('.demo-tag').innerText(), 'Demo');
        await page.locator('#say-hi').click();
        assert.match(await page.locator('#axo-speech').innerText(), /Hi, I'm Axo/);
        await page.locator('#lighting-toggle').click();
        assert.equal(await page.locator('#lighting-toggle').getAttribute('aria-pressed'), 'true');
        assert.match(await page.locator('#habitat-background').getAttribute('src'), /night/);
        await page.locator('[data-demo="focus"]').click();
        await page.locator('[data-minutes="25"]').click();
        assert.equal(await page.locator('#demo-time').innerText(), '25:00');
        await page.locator('[data-demo="grow"]').click();
        assert(await page.locator('[data-panel="grow"]').isVisible());
        await page.locator('[data-demo="steps"]').click();
        await page.locator('[data-demo-check]').first().check();
        assert.match(await page.locator('#demo-feedback').innerText(), /1 small action done/);
        if ([375, 1440].includes(width)) {
          await page.goto(origin);
          await page.evaluate(() => document.fonts.ready);
          await page.screenshot({ path: '/private/tmp/axo-site-' + width + '.png', fullPage: true, animations: 'disabled' });
          await page.screenshot({ path: '/private/tmp/axo-site-hero-' + width + '.png', animations: 'disabled' });
        }
      }
    }
    console.log('PASS: pages and demo interactions at ' + width + 'px');
    await page.close();
  }
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  const legal = await noJS.newPage();
  for (const path of ['privacy/', 'terms/']) {
    await legal.goto(origin + path);
    assert(await legal.locator('#contact, #changes').first().isVisible());
    assert(await legal.getByRole('link', { name: 'appcraft.dev1@gmail.com', exact: true }).count() > 0);
  }
  console.log('PASS: legal content and contact readable without JavaScript');
  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(origin);
  assert.equal(await reduced.locator('#say-hi').evaluate(e => getComputedStyle(e).animationName), 'none');
  console.log('PASS: reduced-motion preference');
  await reduced.goto(origin + 'privacy/');
  await reduced.screenshot({ path: '/private/tmp/axo-site-privacy.png', animations: 'disabled' });
  assert.deepEqual(errors, []);
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { if (browser) await browser.close(); });
