const { chromium } = require('playwright');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false, // Set to false to see the browser
    slowMo: 1000 // Slow down actions to see what's happening
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('1. Navigating to https://code-focus-nnnnicholas.vercel.app');
    await page.goto('https://code-focus-nnnnicholas.vercel.app', {
      waitUntil: 'networkidle'
    });
    
    // Wait for the page to load and find the sign in button
    console.log('2. Looking for "Sign in with GitHub" button...');
    
    // Try multiple possible selectors for the GitHub sign in button
    const signInButton = await page.locator('button:has-text("Sign in with GitHub"), a:has-text("Sign in with GitHub"), [data-testid="github-signin"], button:has(svg), a:has(svg)').first();
    
    // Check if button exists
    const buttonExists = await signInButton.count() > 0;
    
    if (!buttonExists) {
      console.log('Could not find sign in button. Taking a screenshot...');
      await page.screenshot({ path: 'homepage-debug.png' });
      console.log('Screenshot saved as homepage-debug.png');
      
      // Let's also log all visible text to help debug
      const allText = await page.locator('body').textContent();
      console.log('Page text content:', allText);
      
      throw new Error('Sign in button not found');
    }
    
    console.log('3. Clicking the sign in button...');
    await signInButton.click();
    
    // Wait for navigation to GitHub
    console.log('4. Waiting for redirect to GitHub...');
    await page.waitForURL(/github\.com/, {
      timeout: 10000
    });
    
    // Get the final URL
    const finalUrl = page.url();
    console.log('5. Successfully redirected to GitHub OAuth!');
    console.log('   Final URL:', finalUrl);
    
    // Verify it's the OAuth authorization page
    if (finalUrl.includes('github.com/login/oauth/authorize')) {
      console.log('✅ OAuth flow is working correctly!');
      console.log('   The page redirected to GitHub\'s OAuth authorization endpoint.');
    } else if (finalUrl.includes('github.com/login')) {
      console.log('✅ Redirected to GitHub login page (OAuth flow initiated)');
      console.log('   You may need to log in to GitHub first.');
    } else {
      console.log('⚠️  Redirected to GitHub but not to the expected OAuth page');
    }
    
    // Take a screenshot of the GitHub page
    await page.screenshot({ path: 'github-oauth-page.png' });
    console.log('Screenshot saved as github-oauth-page.png');
    
  } catch (error) {
    console.error('Error during test:', error.message);
    
    // Take a screenshot on error
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('Error screenshot saved as error-screenshot.png');
    
  } finally {
    // Close browser
    await browser.close();
    console.log('\nTest completed.');
  }
})();