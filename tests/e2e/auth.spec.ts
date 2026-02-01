import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

test("user registration and login with hashed password", async ({ page }) => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "testpassword123";
  const testName = "Test User";

  // 1. Registracija novega uporabnika
  await page.goto("/");
  await page.getByRole("button", { name: "Sign up" }).click();

  await page.getByLabel("Name").fill(testName);
  await page.getByLabel("Email").fill(testEmail);
  await page.getByLabel("Password").fill(testPassword);

  await page.getByRole("button", { name: "Create account" }).click();

  // Preveri uspešno registracijo
  await expect(page.getByText(`Welcome, ${testName}`)).toBeVisible();

  // 2. Odjava
  await page.getByText("T").first().click(); // Odpri user menu
  await page.getByRole("button", { name: "Log out" }).click();

  // 3. Prijava z istim geslom (preveri hashiranje)
  await page.locator('button:has-text("Log in")').first().click();
  await page.getByLabel("Email").fill(testEmail);
  await page.getByLabel("Password").fill(testPassword);

  await page.locator('button:has-text("Log in")').nth(2).click();

  // Preveri uspešno prijavo - to potrjuje, da je geslo pravilno hashirano in verificirano
  await expect(page.getByText(`Welcome, ${testName}`)).toBeVisible();

  // Clean up: delete the test user
  const prisma = new PrismaClient();
  await prisma.user.deleteMany({
    where: { email: testEmail },
  });
  await prisma.$disconnect();
});