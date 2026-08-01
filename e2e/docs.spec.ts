import { expect, test } from '@playwright/test'
import packageJson from '../package.json' with { type: 'json' }

test.describe('docs site', () => {
  test('overview page loads with hero copy', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.ds-shell')).toBeVisible()
    await expect(page).toHaveTitle(/Tollerud UI/)
    await expect(page.getByText('Dark. Monochrome.')).toBeVisible()
  })

  test('getting started page loads install section', async ({ page }) => {
    await page.goto('/getting-started/')
    await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Install' })).toBeVisible()
    await expect(page.getByText('npm install @tollerud/ui').first()).toBeVisible()
  })

  test('components gallery route renders button section', async ({ page }) => {
    await page.goto('/components/')
    await expect(page.getByRole('heading', { name: 'Components', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Deploy' }).first()).toBeVisible()
  })

  test('deep link /components/button/ scrolls to button section', async ({ page }) => {
    await page.goto('/components/button/')
    await expect(page.getByRole('heading', { name: 'Components', exact: true })).toBeVisible()
    const buttonSection = page.locator('#button')
    await expect(buttonSection).toBeVisible()
    await expect(buttonSection.getByRole('button', { name: 'Deploy' }).first()).toBeVisible()
  })

  test('legacy route redirects to charts', async ({ page }) => {
    await page.goto('/datablocks/')
    await expect(page).toHaveURL(/\/charts\/?$/)
    await expect(page.locator('h1.ds-pagetitle', { hasText: 'Charts' })).toBeVisible()
  })

  test('resources guides page loads', async ({ page }) => {
    await page.goto('/resources/')
    await expect(page.getByRole('heading', { name: 'Guides' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Migration' })).toBeVisible()
  })

  test('changelog page loads entries', async ({ page }) => {
    await page.goto('/changelog/')
    await expect(page.getByRole('heading', { name: 'Changelog' })).toBeVisible()
    await expect(page.getByText(packageJson.version, { exact: false }).first()).toBeVisible({ timeout: 15_000 })
  })

  test('command palette opens with Meta+K', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Meta+k')
    await expect(page.getByPlaceholder('Search pages, sections, components…')).toBeVisible()
  })

  test('forms page loads input demos', async ({ page }) => {
    await page.goto('/forms/')
    await expect(page.getByRole('heading', { name: 'Forms', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Text input' })).toBeVisible()
    await expect(page.getByPlaceholder('e.g. emma.tollerud.no').first()).toBeVisible()
  })

  test('light mode gallery uses light card surfaces', async ({ page }) => {
    await page.goto('/components/card/')
    await page.getByRole('button', { name: 'Switch to light' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    const cardBg = await page.locator('#card .ds-demo__stage').first().evaluate((el) => {
      const surface = el.querySelector('[class*="bg-tollerud-surface"], [class*="bg-tollerud-noir"]')
      return surface ? getComputedStyle(surface).backgroundColor : ''
    })

    expect(cardBg).toMatch(/rgb\(25[0-5], 25[0-5], 25[0-5]\)|rgb\(24[0-9], 24[0-9], 24[0-9]\)|rgb\(25[0-5], 25[0-5], 24[0-9]\)/)
  })

  test('theme toggle switches data-theme on html', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.getByRole('button', { name: 'Switch to light' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await page.getByRole('button', { name: 'Switch to dark' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  // Regression coverage for the Sidebar primitive's mobile off-canvas panel
  // (built on Sheet's framer-motion forceMount/AnimatePresence recipe) — a
  // real browser is needed here since the exit-animation-then-unmount timing
  // isn't reliably observable through jsdom.
  test('mobile sidebar sheet closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible({ timeout: 3000 })
  })

  test('mobile sidebar sheet closes on X click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).not.toBeVisible({ timeout: 3000 })
  })

  // Regression: Sidebar's desktop rail uses an absolute height so it can
  // stick without being stretched by its flex row (see PageShell.test.tsx).
  // Embedded in a bounded demo box, that height must respect the box's
  // --sidebar-height override rather than filling the viewport.
  test('Sidebar demo on the screens page is bounded by its demo box, not the viewport', async ({ page }) => {
    await page.goto('/screens/sidebar/')
    const heading = page.getByRole('heading', { name: 'Sidebar', exact: true })
    await expect(heading).toBeVisible()
    const demoAside = page.locator('#sidebar aside')
    await expect(demoAside).toBeVisible()
    const box = await demoAside.boundingBox()
    const viewport = page.viewportSize()
    expect(box.height).toBeLessThan(viewport.height)
  })

  test('Sidebar demo collapses to an icon-only rail via SidebarTrigger', async ({ page }) => {
    await page.goto('/screens/sidebar/')
    const demoAside = page.locator('#sidebar aside')
    await expect(demoAside).toHaveAttribute('data-state', 'expanded')
    const expandedBox = await demoAside.boundingBox()

    await page.locator('#sidebar').getByRole('button', { name: 'Toggle sidebar' }).click()
    await expect(demoAside).toHaveAttribute('data-state', 'collapsed')
    const collapsedBox = await demoAside.boundingBox()
    expect(collapsedBox.width).toBeLessThan(expandedBox.width)
  })
})
