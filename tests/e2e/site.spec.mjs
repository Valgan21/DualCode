import { test, expect } from '@playwright/test';

const routes = [
  ['/en/', '/es/'],
  ['/en/product', '/es/producto'],
  ['/en/technology', '/es/tecnologia'],
  ['/en/privacy', '/es/privacidad'],
  ['/en/transparency', '/es/transparencia'],
  ['/en/roadmap', '/es/hoja-de-ruta'],
  ['/en/community', '/es/comunidad'],
  ['/en/team', '/es/equipo'],
  ['/en/enterprise', '/es/empresas'],
  ['/en/download', '/es/descarga'],
  ['/en/preview', '/es/demostracion'],
  ['/en/faq', '/es/preguntas-frecuentes'],
  ['/en/contact', '/es/contacto'],
].flat();

test.describe('public routes', () => {
  for (const route of routes) {
    test(`${route} renders without page errors`, async ({ page }) => {
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('a[href="#"]')).toHaveCount(0);
      expect(pageErrors, pageErrors.join('\n')).toEqual([]);
    });
  }
});

test('language switch keeps the equivalent FAQ page', async ({ page }) => {
  await page.goto('/en/faq');
  await page.locator('.header-actions a[lang="es"]').click();
  await expect(page).toHaveURL(/\/es\/preguntas-frecuentes$/);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.getByRole('button', { name: 'Close menu' }).click();
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('FAQ uses native disclosure interaction', async ({ page }) => {
  await page.goto('/en/faq');
  const first = page.locator('.faq-list details').first();
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
});

test.describe('preview interactions', () => {
  test('agent tabs switch the inspector card', async ({ page }) => {
    await page.goto('/en/preview');
    const tabs = page.locator('.agent-switch .agent-tab');
    await expect(tabs).toHaveCount(2);
    await expect(tabs.nth(0)).toHaveAttribute('aria-pressed', 'true');
    const before = await page.locator('.preview-agent-card strong').innerText();
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.preview-agent-card strong')).not.toHaveText(before);
  });

  test('task buttons update code and summary', async ({ page }) => {
    await page.goto('/en/preview');
    const tasks = page.locator('.preview-task');
    await expect(tasks).toHaveCount(3);
    const code = page.locator('pre.preview-code');
    const title = page.locator('.preview-task-summary h3');
    const firstCode = await code.innerText();
    const firstTitle = await title.innerText();
    await tasks.nth(1).click();
    await expect(tasks.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(tasks.nth(0)).toHaveAttribute('aria-pressed', 'false');
    await expect(code).not.toHaveText(firstCode);
    await expect(title).not.toHaveText(firstTitle);
  });

  test('memory toggle exposes aria-expanded and the details list', async ({ page }) => {
    await page.goto('/en/preview');
    const toggle = page.locator('.memory-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#preview-memory-details')).toHaveCount(0);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#preview-memory-details li').first()).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#preview-memory-details')).toHaveCount(0);
  });

  test('Spanish preview keeps working', async ({ page }) => {
    await page.goto('/es/demostracion');
    await page.locator('.preview-task').nth(2).click();
    await expect(page.locator('.preview-task').nth(2)).toHaveAttribute('aria-pressed', 'true');
  });
});

const DISCORD = 'https://discord.gg/3AsRMPvQT3';

test.describe('Discord CTA', () => {
  for (const route of ['/en/', '/es/', '/en/community']) {
    test(`${route} links to the official invite safely`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route);
      const links = page.locator(`a.btn-discord[href="${DISCORD}"]`);
      expect(await links.count()).toBeGreaterThanOrEqual(2);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute('rel', /noopener/);
        await expect(link).toHaveAttribute('target', '_blank');
      }
      await expect(page.locator(`.header-actions a.header-discord[href="${DISCORD}"]`)).toBeVisible();
      await expect(page.locator(`.site-footer a.btn-discord[href="${DISCORD}"]`).first()).toBeVisible();
    });
  }

  test('home hero shows the Discord button above the fold on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/');
    await expect(page.locator(`.hero a.btn-discord[href="${DISCORD}"]`)).toBeInViewport();
  });
});

test.describe('live dashboard', () => {
  test('reduced motion renders the finished session and disables playback controls', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/en/');
    const dash = page.locator('.dash');
    await expect(dash.locator('.diff-file')).toHaveCount(2);
    await expect(dash.locator('.term-line:not(.term-idle)')).toHaveCount(14);
    await expect(dash.locator('.dash-btn').first()).toBeDisabled();
    await expect(dash.locator('.dash-approve')).toHaveCount(0);
    await expect(dash).toContainText('Concept Preview');
  });

  test('plays, asks for approval and continues after the user approves', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/en/');
    const dash = page.locator('.dash');
    await dash.scrollIntoViewIfNeeded();
    const approve = dash.locator('.dash-approve');
    await expect(approve).toBeVisible({ timeout: 30_000 });
    await expect(dash.locator('.state-rows')).toContainText('Awaiting you');
    await approve.click();
    await expect(approve).toHaveCount(0);
    await expect(dash.locator('.state-rows')).toContainText('Granted');
  });

  test('pause freezes the session and replay restarts it', async ({ page }) => {
    await page.goto('/en/');
    const dash = page.locator('.dash');
    await dash.scrollIntoViewIfNeeded();
    await expect(dash.locator('.term-line:not(.term-idle)').first()).toBeVisible({ timeout: 5000 });
    const [pause, replay] = await dash.locator('.dash-btn').all();
    await pause.click();
    await expect(pause).toHaveAttribute('aria-pressed', 'true');
    const frozen = await dash.locator('.term-line:not(.term-idle)').count();
    await page.waitForTimeout(2500);
    expect(await dash.locator('.term-line:not(.term-idle)').count()).toBe(frozen);
    await replay.click();
    await expect(pause).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('404', () => {
  for (const path of ['/en/does-not-exist', '/es/no-existe']) {
    test(`${path} shows the not-found page`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main .kicker')).toContainText('404');
      await expect(page.locator('main a.btn-primary')).toHaveAttribute('href', /^\/(en|es)\/?$/);
    });
  }
});

test.describe('no horizontal overflow', () => {
  for (const width of [390, 768, 1440]) {
    for (const route of routes) {
      test(`${route} @${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await page.locator('h1').waitFor();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }
});

test.describe('desktop header layout', () => {
  for (const route of ['/en/', '/es/']) {
    for (const width of [760, 1100, 1279, 1280, 1366, 1440, 1520, 1920]) {
      test(`${route} header does not overlap or spill @${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(route);
        await page.locator('h1').waitFor();
        const result = await page.evaluate(() => {
          const row = document.querySelector('.header-row');
          const rowRect = row.getBoundingClientRect();
          const kids = [...row.children]
            .filter((el) => getComputedStyle(el).display !== 'none')
            .map((el) => el.getBoundingClientRect());
          const overlap = kids.some((k, i) => i > 0 && k.left < kids[i - 1].right - 0.5);
          const spill = kids[kids.length - 1].right > rowRect.right + 0.5;
          return { overlap, spill, height: document.querySelector('.site-header').getBoundingClientRect().height };
        });
        expect(result.overlap).toBe(false);
        expect(result.spill).toBe(false);
        expect(result.height).toBeLessThanOrEqual(66);
      });
    }
  }
});
