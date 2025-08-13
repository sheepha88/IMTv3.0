import { test, expect } from '@playwright/test';

test.describe('QC Version Manager - View List 탭', () => {
  test.beforeEach(async ({ page }) => {
    // 앱 실행 주소로 이동 (예: http://localhost:3000)
    await page.goto('http://localhost:3000');
  });

  test('TC-001: 기본 데이터가 올바르게 표시되는지 확인', async ({ page }) => {
    await expect(page.getByText('ABC1001')).toBeVisible();
    await expect(page.getByText('Baseline')).toBeVisible();
    await expect(page.getByText('v1')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });

  test('TC-002: Participant 필터 기능', async ({ page }) => {
    await page.getByTitle('Filter participants').click();
    await page.getByLabel('ABC1001').check();
    await expect(page.getByText('ABC1001')).toBeVisible();
    await expect(page.getByText('ABC2001')).not.toBeVisible();
  });

  test('TC-003: Visit 필터 기능', async ({ page }) => {
    await page.getByTitle('Filter visits').click();
    await page.getByLabel('Baseline').check();
    await expect(page.getByText('Baseline')).toBeVisible();
    await expect(page.getByText('Visit 1')).not.toBeVisible();
  });

  test('TC-004: QC Version 필터 기능', async ({ page }) => {
    await page.getByTitle('Filter QC versions').click();
    await page.getByLabel('v1').check();
    await expect(page.getByText('v1')).toBeVisible();
    await expect(page.getByText('v2')).not.toBeVisible();
  });

  test('TC-005: 다중 필터 조합(AND 조건)', async ({ page }) => {
    await page.getByTitle('Filter participants').click();
    await page.getByLabel('ABC1001').check();
    await page.getByTitle('Filter visits').click();
    await page.getByLabel('Baseline').check();
    await page.getByTitle('Filter QC versions').click();
    await page.getByLabel('v1').check();
    await expect(page.getByText('ABC1001')).toBeVisible();
    await expect(page.getByText('Baseline')).toBeVisible();
    await expect(page.getByText('v1')).toBeVisible();
    await expect(page.getByText('ABC2001')).not.toBeVisible();
    await expect(page.getByText('v2')).not.toBeVisible();
  });

  test('TC-006: 필터 초기화(Clear All)', async ({ page }) => {
    await page.getByTitle('Filter participants').click();
    await page.getByLabel('ABC1001').check();
    await page.getByRole('button', { name: 'Clear All' }).click();
    await expect(page.getByText('ABC1001')).toBeVisible();
    await expect(page.getByText('ABC2001')).toBeVisible();
    await expect(page.getByText('ABC3001')).toBeVisible();
  });
});