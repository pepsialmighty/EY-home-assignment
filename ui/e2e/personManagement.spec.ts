import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  // Clean up all people before each test (cascade deletes relationships)
  const res = await request.get("http://localhost:5000/api/people");
  const { data: people } = await res.json();
  for (const person of people) {
    await request.delete(`http://localhost:5000/api/people/${person.id}`);
  }
});

test("create a person and verify they appear in the list", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "People" }).click();

  await page.getByTestId("btn-add-person").click();
  await page.getByTestId("input-name").fill("Alice");
  await page.getByTestId("input-dob").fill("1990-06-15");
  await page.getByTestId("btn-submit").click();

  await expect(page.getByTestId("people-list")).toContainText("Alice");
});

test("edit a person and verify updated name in list", async ({
  page,
  request,
}) => {
  await request.post("http://localhost:5000/api/people", {
    data: { name: "Bob", dateOfBirth: "1985-03-20" },
  });

  await page.goto("/");
  await page.getByRole("button", { name: "People" }).click();

  const list = page.getByTestId("people-list");
  await expect(list).toContainText("Bob");

  // Find the edit button for Bob
  const row = list.locator("li").filter({ hasText: "Bob" });
  const editBtn = row.locator('[data-testid^="btn-edit-"]');
  await editBtn.click();

  await page.getByTestId("input-name").fill("Robert");
  await page.getByTestId("btn-submit").click();

  await expect(list).toContainText("Robert");
  await expect(list).not.toContainText("Bob");
});

test("delete a person and verify they are removed from the list", async ({
  page,
  request,
}) => {
  await request.post("http://localhost:5000/api/people", {
    data: { name: "Charlie", dateOfBirth: "1975-11-01" },
  });

  await request.post("http://localhost:5000/api/people", {
    data: { name: "Bob", dateOfBirth: "1995-11-01" },
  });

  await page.goto("/");
  await page.getByRole("button", { name: "People" }).click();
  await expect(page.getByTestId("people-list")).toContainText("Charlie");

  const row = page
    .getByTestId("people-list")
    .locator("li")
    .filter({ hasText: "Charlie" });
  await row.locator('[data-testid^="btn-delete-"]').click();
  await row.locator('[data-testid^="btn-delete-confirm-"]').click();

  await expect(page.getByTestId("people-list")).not.toContainText("Charlie");
});

test("future DOB is rejected with field error", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "People" }).click();
  await page.getByTestId("btn-add-person").click();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const iso = tomorrow.toISOString().split("T")[0];

  await page.getByTestId("input-name").fill("Future Person");
  await page.getByTestId("input-dob").fill(iso);
  await page.getByTestId("btn-submit").click();

  // Server rejects future DOB — api-error should appear
  await expect(page.getByTestId("api-error")).toBeVisible();
});
