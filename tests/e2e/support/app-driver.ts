import { expect, type Page } from '@playwright/test';

export class AppDriver {
  constructor(private readonly page: Page) {}

  async goToSignIn() {
    await this.page.goto('/signin');
  }

  async goToHome() {
    await this.page.goto('/');
  }

  async expectOnSignInPage() {
    await expect(this.page).toHaveURL(/\/signin$/);
  }

  async signIn(email: string, password: string) {
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
  }

  async expectSignInForm() {
    await expect(this.page.locator('input[type="email"]')).toBeVisible();
    await expect(this.page.locator('input[type="password"]')).toBeVisible();
    await expect(this.page.getByRole('button', { name: /sign in/i })).toBeVisible();
  }

  async expectOnHomePage() {
    await expect(this.page).toHaveURL('/');
    await expect(this.page.getByText('Welcome — capture coming soon')).toBeVisible();
  }

  async expectGenericSignInError() {
    await expect(this.page.getByText('Email or password is incorrect')).toBeVisible();
    await expect(this.page.getByText(/invalid email/i)).toHaveCount(0);
    await expect(this.page.getByText(/wrong password/i)).toHaveCount(0);
    await expect(this.page.getByText(/user not found/i)).toHaveCount(0);
  }
}
