import { test, expect } from '@playwright/test';

test.describe('Kanban Board App', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    await page.goto('/');
  });

  test('should render the board with initial columns and cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Project Alpha Board' })).toBeVisible();
    
    // Check for standard columns
    await expect(page.getByRole('heading', { name: 'To Do', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In Progress', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Review', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Testing', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Done', exact: true })).toBeVisible();

    // Check for initial card
    await expect(page.locator('text=Setup UI framework')).toBeVisible();
  });

  test('should allow adding a new card', async ({ page }) => {
    // Find the first column's add button
    const firstCol = page.locator('.kanban-column').first();
    await firstCol.locator('button.add-card-btn').click();

    // Fill in the form
    await firstCol.locator('input.add-card-input').fill('Playwright Test Card');
    await firstCol.locator('textarea.add-card-textarea').fill('This card was added via E2E test');
    
    // Submit
    await firstCol.locator('button.btn-primary').click();

    // Check if added
    await expect(page.locator('text=Playwright Test Card')).toBeVisible();
    await expect(page.locator('text=This card was added via E2E test')).toBeVisible();
  });

  test('should allow renaming a column', async ({ page }) => {
    const firstColTitle = page.locator('.kanban-column').first().locator('.column-title');
    
    // Click to edit
    await firstColTitle.click();

    // Type new title
    const input = page.locator('.kanban-column').first().locator('input.rename-input');
    await input.fill('Backlog');
    await input.press('Enter');

    // Verify it updated
    await expect(page.locator('.kanban-column').first().locator('h3')).toHaveText('Backlog');
  });

  test('should allow deleting a card', async ({ page }) => {
    const card = page.locator('.kanban-card').filter({ hasText: 'Setup UI framework' });
    
    // Click delete
    const deleteBtn = card.getByRole('button', { name: 'Delete card', exact: true });
    await deleteBtn.click({ force: true });

    // Verify card is gone
    await expect(page.locator('text=Setup UI framework')).not.toBeVisible();
  });
});
