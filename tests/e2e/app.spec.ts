import { expect, test } from "@playwright/test";

test("landing page routes protected app traffic to login", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("The premium-feeling workout tracker")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open app" })).toHaveAttribute("href", "/app");

  await page.goto("/app");
  await expect(page).toHaveURL(/\/auth\/login$/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(
    page.getByText("Log in to reopen your active workout, browse splits, and keep your progression data structured instead of buried in notes."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});
