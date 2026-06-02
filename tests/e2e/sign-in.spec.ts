import { test } from "./support/test";

const { E2E_USER_EMAIL, E2E_USER_PASSWORD } = process.env;

test.beforeAll(() => {
  if (!E2E_USER_EMAIL || !E2E_USER_PASSWORD) {
    throw new Error(
      "E2E_USER_EMAIL and E2E_USER_PASSWORD must be set. " +
        "Add them to .env.test.local (gitignored) with a real Supabase-seeded user.",
    );
  }
});

test("valid credentials sign in and redirect to the home page", async ({
  app,
}) => {
  await app.goToSignIn();
  await app.signIn(E2E_USER_EMAIL!, E2E_USER_PASSWORD!);
  await app.expectOnHomePage();
});

test("invalid credentials show a generic inline error", async ({ app }) => {
  await app.goToSignIn();
  await app.signIn("nobody@example.com", "definitely-wrong");
  await app.expectGenericSignInError();
});

test("signed-out visitor at / is redirected to /signin", async ({ app }) => {
  await app.goToHome();
  await app.expectOnSignInPage();
});
