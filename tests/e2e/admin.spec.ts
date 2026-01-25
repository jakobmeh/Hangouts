import { expect, test } from "@playwright/test";

test("admin page blocks non-admin users", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByText("You must be an admin to view this page.")).toBeVisible();
});