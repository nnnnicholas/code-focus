#!/usr/bin/env node

const { chromium } = require('playwright');

async function takeAuthenticatedScreenshot() {
  const browser = await chromium.launch({
    headless: true // Set to false to see what's happening
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Method 1: Login programmatically
  console.log('Navigating to login page...');
  await page.goto('http://localhost:3000');
  
  // Click the GitHub login button
  await page.click('button:has-text("Sign in with GitHub")');
  
  // Wait for GitHub login page and fill credentials
  // Note: This would require your GitHub credentials
  // await page.fill('input[name="login"]', 'your-username');
  // await page.fill('input[name="password"]', 'your-password');
  // await page.click('input[type="submit"]');
  
  // For now, let's use a different approach...
  console.log('For authenticated screenshots, use one of these methods:');
  console.log('1. Save browser state after manual login');
  console.log('2. Copy cookies from your browser');
  console.log('3. Use API authentication directly');
  
  await browser.close();
}

// Method 2: Save authenticated state for reuse
async function saveAuthState() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Please login manually in the browser window...');
  await page.goto('http://localhost:3000');
  
  // Wait for user to login manually
  await page.waitForURL('**/dashboard', { timeout: 60000 });
  
  // Save the authenticated state
  await context.storageState({ path: 'auth-state.json' });
  console.log('Auth state saved to auth-state.json');
  
  await browser.close();
}

// Method 3: Use saved auth state
async function screenshotWithAuth() {
  const browser = await chromium.launch();
  
  // Load the saved auth state
  const context = await browser.newContext({
    storageState: 'auth-state.json'
  });
  
  const page = await context.newPage();
  await page.goto('http://localhost:3000/dashboard');
  
  // Wait for content to load
  await page.waitForSelector('h1:has-text("Code Focus")', { timeout: 5000 });
  
  await page.screenshot({ path: 'dashboard-authenticated.png', fullPage: true });
  console.log('Screenshot saved to dashboard-authenticated.png');
  
  await browser.close();
}

// Check command line args
const command = process.argv[2];

switch (command) {
  case 'save-auth':
    saveAuthState().catch(console.error);
    break;
  case 'screenshot':
    screenshotWithAuth().catch(console.error);
    break;
  default:
    console.log('Usage:');
    console.log('  node screenshot.js save-auth    # Login and save auth state');
    console.log('  node screenshot.js screenshot   # Take screenshot using saved auth');
}