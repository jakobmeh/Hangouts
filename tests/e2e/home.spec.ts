import { expect, test } from "@playwright/test";

test("home page shows guest CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Join Meetup" })).toBeVisible();
});