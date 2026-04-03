import { test, expect, type APIRequestContext } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  const res = await request.get('http://localhost:5000/api/people');
  const { data: people } = await res.json();
  for (const person of people) {
    await request.delete(`http://localhost:5000/api/people/${person.id}`);
  }
});

async function createPerson(request: APIRequestContext, name: string, dob: string) {
  const res = await request.post('http://localhost:5000/api/people', {
    data: { name, dateOfBirth: dob },
  });
  const { data } = await res.json();
  return data as { id: number; name: string };
}

test('happy path — assign a relationship and verify child shown on home', async ({ page, request }) => {
  await createPerson(request, 'Parent Person', '1950-01-01');
  await createPerson(request, 'Child Person', '1980-01-01');

  await page.goto('/add-relationship');

  await page.getByTestId('select-parent').selectOption({ label: 'Parent Person' });
  await page.getByTestId('select-child').selectOption({ label: 'Child Person' });
  await page.getByTestId('btn-submit').click();

  // On success, navigates back to home (Tree tab is active by default — switch to People).
  await expect(page).toHaveURL('/');
  await page.getByRole('button', { name: 'People' }).click();
  // Wait for any background refetches triggered by the tab switch to settle before asserting.
  await page.waitForLoadState('networkidle');
  await expect(page.getByTestId('people-list')).toContainText('Child Person');
});

test('age gap error — parent less than 15 years older is rejected', async ({ page, request }) => {
  await createPerson(request, 'Near Parent', '1979-01-01');
  await createPerson(request, 'Near Child', '1980-01-01');

  await page.goto('/add-relationship');

  await page.getByTestId('select-parent').selectOption({ label: 'Near Parent' });
  await page.getByTestId('select-child').selectOption({ label: 'Near Child' });
  await page.getByTestId('btn-submit').click();

  await expect(page.getByTestId('api-error')).toContainText('15 years');
});

test('child with 2 parents is not shown in child dropdown', async ({ page, request }) => {
  const p1 = await createPerson(request, 'Parent One', '1950-01-01');
  const p2 = await createPerson(request, 'Parent Two', '1951-01-01');
  const child = await createPerson(request, 'Full Child', '1980-01-01');

  // Assign two parents via API
  await request.post('http://localhost:5000/api/relationships', {
    data: { parentId: p1.id, childId: child.id },
  });
  await request.post('http://localhost:5000/api/relationships', {
    data: { parentId: p2.id, childId: child.id },
  });

  await page.goto('/add-relationship');

  // Full Child should not appear in the child dropdown
  const childSelect = page.getByTestId('select-child');
  await expect(childSelect).not.toContainText('Full Child');
});

test('cycle error — assigning a descendant as parent is rejected', async ({ page, request }) => {
  const a = await createPerson(request, 'Ancestor A', '1950-01-01');
  const b = await createPerson(request, 'Middle B', '1970-01-01');
  const c = await createPerson(request, 'Descend C', '1990-01-01');

  await request.post('http://localhost:5000/api/relationships', { data: { parentId: a.id, childId: b.id } });
  await request.post('http://localhost:5000/api/relationships', { data: { parentId: b.id, childId: c.id } });

  await page.goto('/add-relationship');

  await page.getByTestId('select-parent').selectOption({ label: 'Descend C' });
  await page.getByTestId('select-child').selectOption({ label: 'Ancestor A' });
  await page.getByTestId('btn-submit').click();

  await expect(page.getByTestId('api-error')).toContainText('cycle');
});
