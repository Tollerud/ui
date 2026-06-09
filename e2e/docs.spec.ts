import { expect, test } from '@playwright/test'
import packageJson from '../package.json' with { type: 'json' }

test.describe('docs site', () => {
  test('overview page loads with hero copy', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.ds-shell')).toBeVisible()
    await expect(page).toHaveTitle(/Tollerud UI/)
    await expect(page.getByText('Dark. Monochrome.')).toBeVisible()
  })

  test('components gallery route renders button section', async ({ page }) => {
    await page.goto('/components')
    await expect(page.getByRole('heading', { name: 'Components' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Deploy' }).first()).toBeVisible()
  })

  test('changelog page loads entries', async ({ page }) => {
    await page.goto('/changelog')
    await expect(page.getByRole('heading', { name: 'Changelog' })).toBeVisible()
    await expect(page.getByText(packageJson.version, { exact: false }).first()).toBeVisible({ timeout: 15_000 })
  })
})
