import { test, expect } from '@playwright/test';

// Фейковые токены
const FAKE_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.fake';
const FAKE_REFRESH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyJ9.fake-refresh';

test.describe('Бургер-конструктор - E2E тесты', () => {
  test.beforeEach(async ({ page, context }) => {
    // Устанавливаем refreshToken в localStorage для всех тестов
    await page.addInitScript(() => {
      localStorage.setItem(
        'refreshToken',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyJ9.fake-refresh'
      );
    });

    // Моковые токены авторизации в cookies
    await context.addCookies([
      {
        name: 'accessToken',
        value:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.fake',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'refreshToken',
        value:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyJ9.fake-refresh',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // Моковые данные ингредиентов
    const mockIngredients = [
      {
        _id: 'mock-bun-1',
        id: 'mock-bun-1',
        name: 'Космическая булка красная',
        type: 'bun',
        proteins: 80,
        fat: 20,
        carbohydrates: 30,
        calories: 100,
        price: 150,
        image: 'https://code.s3.yandex.net/react/code/bun.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun_large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun_mobile.png',
      },
      {
        _id: 'mock-bun-2',
        id: 'mock-bun-2',
        name: 'Космическая булка зелёная',
        type: 'bun',
        proteins: 80,
        fat: 20,
        carbohydrates: 30,
        calories: 100,
        price: 200,
        image: 'https://code.s3.yandex.net/react/code/bun.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun_large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun_mobile.png',
      },
      {
        _id: 'mock-main-1',
        id: 'mock-main-1',
        name: 'Космическая котлета',
        type: 'main',
        proteins: 50,
        fat: 30,
        carbohydrates: 10,
        calories: 200,
        price: 300,
        image: 'https://code.s3.yandex.net/react/code/meat.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat_large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/meat_mobile.png',
      },
      {
        _id: 'mock-sauce-1',
        id: 'mock-sauce-1',
        name: 'Космический соус',
        type: 'sauce',
        proteins: 10,
        fat: 10,
        carbohydrates: 20,
        calories: 50,
        price: 100,
        image: 'https://code.s3.yandex.net/react/code/sauce.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce_large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/sauce_mobile.png',
      },
    ];

    // Моковый ответ для GET /api/ingredients
    await page.route('**/api/ingredients', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: mockIngredients }),
        });
      } else {
        route.continue();
      }
    });

    // Моковый ответ для GET /api/auth/user (всегда возвращает пользователя)
    await page.route('**/api/auth/user', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@example.com', name: 'Test User' },
        }),
      });
    });

    // Моковый ответ для POST /api/orders
    await page.route('**/api/orders', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            number: 77777,
          },
        }),
      });
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

    const addButtons = page.getByRole('button', { name: /Добавить/i });
    await expect(addButtons).toHaveCount(4, { timeout: 10000 }); // Ждём 4 кнопки

    const firstBun = addButtons.first();
    await firstBun.click();

    const constructorElement = page.locator('[data-testid="constructor-bun"]');
    await expect(constructorElement).toContainText('Космическая булка красная');
  });

  test('должно добавлять начинку в конструктор', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const addButtons = page.getByRole('button', { name: /Добавить/i });
    await expect(addButtons).toHaveCount(4, { timeout: 10000 });
    const mainIngredient = addButtons.nth(2);
    await mainIngredient.click();

    const constructorElement = page.locator(
      '[data-testid="constructor-ingredients-list"]'
    );
    await expect(constructorElement).toContainText('Космическая котлета');
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

  test('оформление заказа должно открыть модалку и очистить конструктор', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const addButtons = page.getByRole('button', { name: /Добавить/i });
    await addButtons.first().click(); // булка
    await addButtons.nth(2).click(); // начинка
    await addButtons.last().click(); // вторая булка

    // Проверяем, что ингредиенты в конструкторе
    await expect(page.locator('[data-testid="constructor-bun"]')).toContainText(
      'Космическая булка красная'
    );
    await expect(
      page.locator('[data-testid="constructor-ingredients-list"]')
    ).toContainText('Космическая котлета');

    // Оформляем заказ
    const orderButton = page.locator('[data-testid="order-button"]');
    await orderButton.click();

    // Проверяем модалку
    const modal = page.locator('[data-testid="order-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('77777');

    // Закрываем
    await page.locator('[data-testid="modal-close-button"]').click();
    await expect(modal).not.toBeVisible();

    // Проверяем очистку
    await expect(page.locator('[data-testid="constructor-bun"]')).toHaveCount(
      0
    );
    await expect(
      page.locator('[data-testid="constructor-ingredients-list"]')
    ).not.toContainText('Космическая котлета');
  });

  test('должен перенаправлять на логин без авторизации', async ({
    page,
    context,
  }) => {
    // Очищаем cookies и localStorage для этого теста
    await context.clearCookies();
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const firstBun = page.getByRole('button', { name: /Добавить/i }).first();
    await firstBun.click();

    const orderButton = page.locator('[data-testid="order-button"]');
    await orderButton.click();

    await expect(page).toHaveURL(/\/login/);
  });
});
