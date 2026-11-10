const { test, expect } = require('@playwright/test');

test('user can log in, register, log out, and log in again', async ({ page }) => {
  const newUser = {
    name: 'Playwright Test User',
    email: `playwright-${Date.now()}@techmart.com`,
    password: 'test123',
  };

  await test.step('log in with the demo account and log out', async () => {
    await page.goto('/login.html');
    await expect(page.getByRole('heading', { name: 'Login to TechMart' })).toBeVisible();

    await page.getByLabel('Email Address').fill('demo@techmart.com');
    await page.getByLabel('Password').fill('demo123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });

  await test.step('show an error for invalid credentials', async () => {
    await page.goto('/login.html');
    await page.getByLabel('Email Address').fill('wrong@techmart.com');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('#errorMessage')).toHaveText('Invalid credentials');
  });

  await test.step('create a new account', async () => {
    await page.getByRole('link', { name: 'Sign up here' }).click();
    await expect(page).toHaveURL('/register.html');

    await page.getByLabel('Full Name').fill(newUser.name);
    await page.getByLabel('Email Address').fill(newUser.email);
    await page.getByLabel('Password', { exact: true }).fill(newUser.password);
    await page.getByLabel('Confirm Password').fill(newUser.password);
    await page.getByRole('button', { name: 'Create Account' }).click();

    await expect(page.getByText('Account created! Redirecting...')).toBeVisible();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Hi, Playwright Test User')).toBeVisible();
  });

  await test.step('log out and log in with the new account', async () => {
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByLabel('Email Address').fill(newUser.email);
    await page.getByLabel('Password').fill(newUser.password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText('Hi, Playwright Test User')).toBeVisible();
  });
});