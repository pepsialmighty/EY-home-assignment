import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  const res = await request.get('http://localhost:5000/api/people');
  const { data: people } = await res.json();
  for (const person of people) {
    await request.delete(`http://localhost:5000/api/people/${person.id}`);
  }
});

test('empty state shown when no people exist', async ({ page }) => {
  await page.goto('/tree');
  await expect(page.getByTestId('empty-tree')).toBeVisible();
});

test('tree renders nodes and edges after creating people and a relationship', async ({ page, request }) => {
  const parentRes = await request.post('http://localhost:5000/api/people', {
    data: { name: 'Tree Parent', dateOfBirth: '1950-01-01' },
  });
  const { data: parent } = await parentRes.json();

  const childRes = await request.post('http://localhost:5000/api/people', {
    data: { name: 'Tree Child', dateOfBirth: '1980-01-01' },
  });
  const { data: child } = await childRes.json();

  await request.post('http://localhost:5000/api/relationships', {
    data: { parentId: parent.id, childId: child.id },
  });

  await page.goto('/tree');

  await expect(page.getByTestId('tree-view')).toBeVisible();
  // React Flow renders nodes inside its canvas
  await expect(page.locator('.react-flow__node')).toHaveCount(2);
  await expect(page.locator('.react-flow__edge')).toHaveCount(1);
});
