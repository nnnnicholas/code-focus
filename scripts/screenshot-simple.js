#!/usr/bin/env node

const { chromium } = require('playwright');

async function takeScreenshotWithCookies() {
  // First, let's create a simple way to pass your session cookie
  const sessionCookie = process.env.SESSION_COOKIE;
  
  if (!sessionCookie) {
    console.log('To use this script:');
    console.log('1. Open your browser developer tools (F12)');
    console.log('2. Go to Application > Cookies > http://localhost:3000');
    console.log('3. Find the "next-auth.session-token" cookie');
    console.log('4. Copy its value');
    console.log('5. Run: SESSION_COOKIE="<cookie-value>" node scripts/screenshot-simple.js');
    return;
  }
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  // Add the session cookie
  await context.addCookies([{
    name: 'next-auth.session-token',
    value: sessionCookie,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax'
  }]);
  
  const page = await context.newPage();
  await page.goto('http://localhost:3000/dashboard');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({ 
    path: `dashboard-${new Date().toISOString().split('T')[0]}.png`,
    fullPage: true 
  });
  
  console.log('Screenshot saved!');
  await browser.close();
}

takeScreenshotWithCookies().catch(console.error);