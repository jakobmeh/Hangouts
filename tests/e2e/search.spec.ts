import { expect, test } from "@playwright/test";

test("search page shows results header", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Search for events or groups").fill("Event");
  await page.getByPlaceholder("Location").fill("Ljubljana");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/\/search\?event=Event&city=Ljubljana/);
  await expect(page.getByRole("heading", { name: /Find events in/ })).toBeVisible();
});