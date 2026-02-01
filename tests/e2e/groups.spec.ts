import { expect, test } from "@playwright/test";

test("groups page lists groups and navigates to detail", async ({ page }) => {
  await page.goto("/groups");
  await expect(page.getByRole("heading", { name: "Discover Groups" })).toBeVisible();

  const firstGroup = page
    .locator('a[href^="/groups/"]:not([href="/groups/new"])')
    .first();

  // Če ni skupin, preskoči test
  const groupCount = await firstGroup.count();
  if (groupCount === 0) {
    test.skip();
    return;
  }

  await expect(firstGroup).toBeVisible();
  await firstGroup.click();

  await expect(page).toHaveURL(/\/groups\/[0-9]+/);
  await expect(page.getByRole("heading", { name: /Members/ })).toBeVisible();
});

test("groups detail page shows events section", async ({ page }) => {
  await page.goto("/groups");
  const firstGroup = page
    .locator('a[href^="/groups/"]:not([href="/groups/new"])')
    .first();

  // Če ni skupin, preskoči test
  const groupCount = await firstGroup.count();
  if (groupCount === 0) {
    test.skip();
    return;
  }

  await expect(firstGroup).toBeVisible();
  await firstGroup.click();

  // Preveri, da se events sekcija pravilno renderira
  await expect(page.getByRole("heading", { name: /Events/ })).toBeVisible();

  // Preveri, da se število dogodkov prikaže
  const eventsHeading = page.getByRole("heading", { name: /Events \(\d+\)/ });
  await expect(eventsHeading).toBeVisible();
});
