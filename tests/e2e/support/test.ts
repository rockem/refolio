import { test as base } from "@playwright/test";
import { AppDriver } from "./app-driver";

export const test = base.extend<{ app: AppDriver }>({
  app: async ({ page }, use) => {
    await use(new AppDriver(page));
  },
});

export { expect } from "@playwright/test";
