import { expect, test } from "@playwright/test";

test("groups page lists groups and navigates to detail", async ({ page }) => {
  await page.goto("/groups");
  await expect(page.getByRole("heading", { name: "Discover Groups" })).toBeVisible();

  const firstGroup = page
    .locator('a[href^="/groups/"]:not([href="/groups/new"])')
    .first();
  await expect(firstGroup).toBeVisible();
  await firstGroup.click();

  await expect(page).toHaveURL(/\/groups\/[0-9]+/);
  await expect(page.getByRole("heading", { name: /Members/ })).toBeVisible();
});
