const { test, expect } = require('@playwright/test');

test.describe('GitHub OAuth Integration', () => {
  test('should redirect to GitHub OAuth when clicking sign in button', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://code-focus-nnnnicholas.vercel.app', {
      waitUntil: 'networkidle'
    });
    
    // Find and click the GitHub sign in button
    // Try multiple possible selectors
    const signInButton = page.locator('button:has-text("Sign in with GitHub"), a:has-text("Sign in with GitHub")').first();
    
    // Verify button exists
    await expect(signInButton).toBeVisible({ timeout: 10000 });
    
    // Click the sign in button
    await signInButton.click();
    
    // Wait for redirect to GitHub
    await page.waitForURL(/github\.com/, {
      timeout: 10000
    });
    
    // Verify we're on GitHub
    const url = page.url();
    expect(url).toContain('github.com');
    
    // Check if it's either the OAuth authorize page or login page
    const isOAuthPage = url.includes('github.com/login/oauth/authorize');
    const isLoginPage = url.includes('github.com/login');
    
    expect(isOAuthPage || isLoginPage).toBeTruthy();
    
    // If it's the login page, verify it has the OAuth parameters
    if (isLoginPage) {
      expect(url).toContain('client_id=');
      expect(url).toContain('return_to=%2Flogin%2Foauth%2Fauthorize');
    }
    
    // Verify the OAuth parameters are present
    expect(url).toContain('client_id=Ov23li4TtKu7i2rEEGsB');
    expect(url).toContain('redirect_uri=https%3A%2F%2Fcode-focus-nnnnicholas.vercel.app%2Fapi%2Fauth%2Fcallback%2Fgithub');
    expect(url).toContain('scope=');
    expect(url).toContain('state=');
  });
  
  test('should have proper OAuth scopes configured', async ({ page }) => {
    await page.goto('https://code-focus-nnnnicholas.vercel.app', {
      waitUntil: 'networkidle'
    });
    
    const signInButton = page.locator('button:has-text("Sign in with GitHub"), a:has-text("Sign in with GitHub")').first();
    await signInButton.click();
    
    await page.waitForURL(/github\.com/, {
      timeout: 10000
    });
    
    const url = page.url();
    
    // Verify the OAuth scopes include necessary permissions
    // The scopes should be URL encoded in the URL
    expect(url).toMatch(/scope=.*read.*user/i);
    expect(url).toMatch(/scope=.*user.*email/i);
    expect(url).toMatch(/scope=.*repo/i);
  });
});