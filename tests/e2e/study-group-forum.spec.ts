import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, email: 'e2e@example.com', displayName: 'E2E User' }),
    });
  });
});

test('opens the populated forum mockup from My Study Groups', async ({ page }) => {
  await page.goto('/study-groups');
  await expect(page.getByRole('button', { name: 'Open CST438 Study Buddies' })).toBeVisible();
  await page.getByRole('button', { name: 'Open CST438 Study Buddies' }).click();

  await expect(page).toHaveURL(/\/study-group\/mock$/);
  await expect(page.getByText('CST438 Study Buddies', { exact: true })).toBeVisible();
  await expect(page.getByText('Welcome to the group!', { exact: false })).toBeVisible();
  await expect(page.getByLabel('New forum message')).toBeVisible();
});

test('displays group information and members in the forum popup', async ({ page }) => {
  await page.goto('/study-group/mock');
  await page.getByRole('button', { name: 'View study group information' }).click();

  const popup = page.getByRole('dialog', { name: 'Group Information' });
  await expect(popup).toBeVisible();
  await expect(popup.getByText('Group Information', { exact: true })).toBeVisible();
  await expect(popup.getByText('CST438', { exact: true })).toBeVisible();
  await expect(popup.getByText('Alex Johnson', { exact: true })).toBeVisible();
  await expect(popup.getByText('Jamie Lee', { exact: true })).toBeVisible();
  await expect(popup.getByText('Taylor Smith', { exact: true })).toBeVisible();
});

test('posts a message in the forum mockup', async ({ page }) => {
  await page.goto('/study-group/mock');
  await page.getByLabel('New forum message').fill('I can bring practice questions too.');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.getByText('I can bring practice questions too.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('New forum message')).toHaveValue('');
});

test('returns to My Study Groups from the forum page', async ({ page }) => {
  await page.goto('/study-group/mock');
  await page.getByRole('button', { name: 'Back to My Study Groups' }).click();
  await expect(page).toHaveURL(/\/study-groups$/);
});
