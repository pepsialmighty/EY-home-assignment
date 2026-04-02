import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  const res = await request.get('http://localhost:5000/api/people');
  const { data: people } = await res.json();
  for (const person of people) {
    await request.delete(`http://localhost:5000/api/people/${person.id}`);
  }
});

async function createPerson(request: Parameters<typeof test>[1] extends { request: infer R } ? R : never, name: string, dob: string) {
  const res = await request.post('http://localhost:5000/api/people', {
    data: { name, dateOfBirth: dob },
  });
  const { data } = await res.json();
  return data as { id: number; name: string };
}

test('happy path — assign a parent and verify parent shown', async ({ page, request }) => {
  const parent = await createPerson(request, 'Parent Person', '1950-01-01');
  const child = await createPerson(request, 'Child Person', '1980-01-01');

  await page.goto('/');

  // Use testid directly to avoid strict mode issues when a person's name appears in another row's dropdown
  const childRow = page.getByTestId(`person-row-${child.id}`);
  await childRow.locator(`[data-testid="select-parent-${child.id}"]`).selectOption({ label: `Parent Person (1950-01-01)` });
  await childRow.locator(`[data-testid="btn-add-parent-${child.id}"]`).click();

  await expect(childRow).toContainText('Parent Person');
  await expect(childRow.locator(`[data-testid="btn-remove-parent-${parent.id}"]`)).toBeVisible();
});

test('age gap error — parent less than 15 years older is rejected', async ({ page, request }) => {
  const parent = await createPerson(request, 'Near Parent', '1979-01-01');
  const child = await createPerson(request, 'Near Child', '1980-01-01');

  await page.goto('/');

  const childRow = page.getByTestId('people-list').locator('li').filter({ hasText: 'Near Child' });
  await childRow.locator(`[data-testid="select-parent-${child.id}"]`).selectOption({ label: `Near Parent (1979-01-01)` });
  await childRow.locator(`[data-testid="btn-add-parent-${child.id}"]`).click();

  await expect(childRow.locator(`[data-testid="parent-error-${child.id}"]`)).toContainText('15 years');
});

test('parent limit error — third parent is rejected', async ({ page, request }) => {
  const p1 = await createPerson(request, 'Parent One', '1950-01-01');
  const p2 = await createPerson(request, 'Parent Two', '1951-01-01');
  const p3 = await createPerson(request, 'Parent Three', '1952-01-01');
  const child = await createPerson(request, 'Many Child', '1980-01-01');

  // Assign first two parents via API
  await request.post('http://localhost:5000/api/relationships', {
    data: { parentId: p1.id, childId: child.id },
  });
  await request.post('http://localhost:5000/api/relationships', {
    data: { parentId: p2.id, childId: child.id },
  });

  await page.goto('/');

  // The select should no longer be visible (2 parents = max), but we force via API then check UI
  // Instead, use a 3rd parent via UI — the select appears if < 2, so we need to check API rejection
  // Since child already has 2 parents, ParentManager hides the add form. Verify via API.
  const res = await request.post('http://localhost:5000/api/relationships', {
    data: { parentId: p3.id, childId: child.id },
  });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.error.message).toContain('2 parents');
});

test('cycle error — assigning a descendant as parent is rejected', async ({ page, request }) => {
  // A (1950) → B (1970) → C (1990); then try C as parent of A
  const a = await createPerson(request, 'Ancestor A', '1950-01-01');
  const b = await createPerson(request, 'Middle B', '1970-01-01');
  const c = await createPerson(request, 'Descend C', '1990-01-01');

  await request.post('http://localhost:5000/api/relationships', { data: { parentId: a.id, childId: b.id } });
  await request.post('http://localhost:5000/api/relationships', { data: { parentId: b.id, childId: c.id } });

  await page.goto('/');

  const aRow = page.getByTestId('people-list').locator('li').filter({ hasText: 'Ancestor A' });
  await aRow.locator(`[data-testid="select-parent-${a.id}"]`).selectOption({ label: `Descend C (1990-01-01)` });
  await aRow.locator(`[data-testid="btn-add-parent-${a.id}"]`).click();

  await expect(aRow.locator(`[data-testid="parent-error-${a.id}"]`)).toContainText('cycle');
});
