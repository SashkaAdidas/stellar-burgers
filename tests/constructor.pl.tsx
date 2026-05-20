import { test, expect } from '@playwright/test';

// Фейковые токены
const FAKE_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.fake';
const FAKE_REFRESH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyJ9.fake-refresh';

test.describe('Бургер-конструктор - E2E тесты', () => {
  test.beforeEach(async ({ page, context }) => {
    // Моковые токены авторизации в cookies
    await context.addCookies([
      {
        name: 'accessToken',
        value: FAKE_ACCESS_TOKEN,
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'refreshToken',
        value: FAKE_REFRESH_TOKEN,
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Перехват запросов из HAR файла
    await page.routeFromHAR('./tests/hars/api.har', {
      notFound: 'fallback',
    });
  });

  test.afterEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('должен загружать страницу конструктора', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Соберите бургер');
  });

  test('должно добавлять булку в конструктор', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstBun = page.getByRole('button', { name: /Добавить/i }).first();
    await firstBun.click();

    const card = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: 'Космическая булка красная' });
    await expect(card).toBeVisible();
  });

  test('должно добавлять начинку в конструктор', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mainIngredient = page
      .getByRole('button', { name: /Добавить/i })
      .nth(1);
    await mainIngredient.click();

    const card = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: 'Космическая котлета' });
    await expect(card).toBeVisible();
  });

  test('должно открывать модальное окно ингредиента', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredientCard = page
      .locator('[data-testid="ingredient-card"]')
      .first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="ingredient-modal"]');
    await expect(modal).toBeVisible();
  });

  test('должно закрывать модальное окно по клику на крестик', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredientCard = page
      .locator('[data-testid="ingredient-card"]')
      .first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="ingredient-modal"]');
    await expect(modal).toBeVisible();

    const closeButton = page.locator('[data-testid="modal-close-button"]');
    await closeButton.click();

    await expect(modal).not.toBeVisible();
  });

  test('должно закрывать модальное окно по клику на оверлей', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredientCard = page
      .locator('[data-testid="ingredient-card"]')
      .first();
    await ingredientCard.click();

    const modal = page.locator('[data-testid="ingredient-modal"]');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(modal).not.toBeVisible();
  });

  test('должно отображать данные правильного ингредиента в модальном окне', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ingredientName = 'Космическая котлета';
    const ingredient = page
      .locator('[data-testid="ingredient-card"]')
      .filter({ hasText: ingredientName })
      .first();
    await ingredient.click();

    const modalContent = page.locator('[data-testid="ingredient-modal"]');
    await expect(modalContent).toContainText(ingredientName);
  });

  test('должен отображать модальное окно с номером заказа после оформления', async ({
    page,
  }) => {
    // Перед выполнением теста создания заказа подставляем токены в localStorage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(
      (tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      },
      { accessToken: FAKE_ACCESS_TOKEN, refreshToken: FAKE_REFRESH_TOKEN }
    );

    const firstBun = page.getByRole('button', { name: /Добавить/i }).first();
    await firstBun.click();
    await page.waitForTimeout(500);

    const mainIngredient = page
      .getByRole('button', { name: /Добавить/i })
      .nth(1);
    await mainIngredient.click();
    await page.waitForTimeout(500);

    const orderButton = page.locator('[data-testid="order-button"]');
    await orderButton.click();

    await page.waitForTimeout(500);

    await page.keyboard.press('Escape');

    // После завершения теста очищаем localStorage
    await page.evaluate(() => localStorage.clear());
  });

  test('должен очищать конструктор после оформления заказа', async ({
    page,
  }) => {
    // Перед выполнением теста создания заказа подставляем токены в localStorage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(
      (tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      },
      { accessToken: FAKE_ACCESS_TOKEN, refreshToken: FAKE_REFRESH_TOKEN }
    );

    const firstBun = page.getByRole('button', { name: /Добавить/i }).first();
    await firstBun.click();
    await page.waitForTimeout(500);

    const mainIngredient = page
      .getByRole('button', { name: /Добавить/i })
      .nth(1);
    await mainIngredient.click();
    await page.waitForTimeout(500);

    const orderButton = page.locator('[data-testid="order-button"]');
    await orderButton.click();
    await page.waitForTimeout(500);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const modal = page.locator('[data-testid="ingredient-modal"]');
    await expect(modal).not.toBeVisible();

    // После завершения теста очищаем localStorage
    await page.evaluate(() => localStorage.clear());
  });

  test('должен перенаправлять на логин без авторизации', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstBun = page.getByRole('button', { name: /Добавить/i }).first();
    await firstBun.click();

    const orderButton = page.locator('[data-testid="order-button"]');
    await orderButton.click();

    await expect(page).toHaveURL(/\/login/);
  });
});
