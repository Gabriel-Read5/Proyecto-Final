import { test, expect } from '@playwright/test'

test('la página principal carga correctamente', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  await expect(page.getByRole('heading', { name: 'Pokédex Web Interactiva' })).toBeVisible({ timeout: 15000 })
})

test('la búsqueda filtra pokémon', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  const inputBusqueda = page.getByLabel('Buscar Pokémon por nombre')
  await expect(inputBusqueda).toBeVisible({ timeout: 15000 })

  await inputBusqueda.fill('pikachu')

  await expect(page.getByText(/pikachu/i).first()).toBeVisible({ timeout: 15000 })
})

test('se puede abrir la página de favoritos', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await page.getByRole('link', { name: 'Favoritos' }).click()

  await expect(page.getByRole('heading', { name: 'Pokémon Favoritos' })).toBeVisible({ timeout: 15000 })
})

test('se puede abrir la página del comparador', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await page.getByRole('link', { name: 'Comparador' }).click()

  await expect(page.getByRole('heading', { name: 'Comparador de Pokémon' })).toBeVisible({ timeout: 15000 })
})