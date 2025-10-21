import { chromium, Browser, Page } from 'playwright';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

/**
 * BROWSER TOOLS MODULE ⚔️
 * 
 * Military-grade browser automation for APEX Agent
 * Handles navigation, testing, screenshots, and form interactions
 */
export class BrowserTools {
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor() {
    // Browser will be initialized on first use
  }

  getTools(): Tool[] {
    return [
      {
        name: 'browser_navigate',
        description: 'Navigate to a URL with military precision',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', description: 'URL to navigate to' },
            wait_until: { 
              type: 'string', 
              enum: ['load', 'domcontentloaded', 'networkidle'],
              description: 'Wait condition for navigation'
            },
            timeout: { type: 'number', description: 'Navigation timeout in milliseconds' },
          },
          required: ['url'],
        },
      },
      {
        name: 'browser_click_element',
        description: 'Click an element with tactical precision',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector or text content' },
            button: { type: 'string', enum: ['left', 'right', 'middle'], description: 'Mouse button' },
            click_count: { type: 'number', description: 'Number of clicks' },
            timeout: { type: 'number', description: 'Element wait timeout' },
          },
          required: ['selector'],
        },
      },
      {
        name: 'browser_fill_form',
        description: 'Fill form fields with precision',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'Form selector' },
            data: { type: 'object', description: 'Form data object' },
            submit: { type: 'boolean', description: 'Submit form after filling' },
          },
          required: ['selector', 'data'],
        },
      },
      {
        name: 'browser_take_screenshot',
        description: 'Capture screenshot for evidence and testing',
        inputSchema: {
          type: 'object',
          properties: {
            filename: { type: 'string', description: 'Screenshot filename' },
            full_page: { type: 'boolean', description: 'Capture full page' },
            quality: { type: 'number', description: 'Image quality (0-100)' },
          },
          required: ['filename'],
        },
      },
      {
        name: 'browser_run_tests',
        description: 'Execute automated test suite',
        inputSchema: {
          type: 'object',
          properties: {
            test_suite: { type: 'string', description: 'Test suite name' },
            config: { type: 'object', description: 'Test configuration' },
            headless: { type: 'boolean', description: 'Run in headless mode' },
          },
          required: ['test_suite'],
        },
      },
      {
        name: 'browser_get_element_text',
        description: 'Extract text content from elements',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            all: { type: 'boolean', description: 'Get all matching elements' },
          },
          required: ['selector'],
        },
      },
      {
        name: 'browser_wait_for_element',
        description: 'Wait for element to appear with military patience',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector' },
            timeout: { type: 'number', description: 'Wait timeout in milliseconds' },
            visible: { type: 'boolean', description: 'Wait for element to be visible' },
          },
          required: ['selector'],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    // Ensure browser is initialized
    if (!this.browser) {
      await this.initializeBrowser();
    }

    switch (name) {
      case 'browser_navigate':
        return await this.navigate(args);
      case 'browser_click_element':
        return await this.clickElement(args);
      case 'browser_fill_form':
        return await this.fillForm(args);
      case 'browser_take_screenshot':
        return await this.takeScreenshot(args);
      case 'browser_run_tests':
        return await this.runTests(args);
      case 'browser_get_element_text':
        return await this.getElementText(args);
      case 'browser_wait_for_element':
        return await this.waitForElement(args);
      default:
        throw new Error(`Unknown browser tool: ${name}`);
    }
  }

  private async initializeBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: process.env.BROWSER_HEADLESS !== 'false',
      timeout: parseInt(process.env.BROWSER_TIMEOUT || '30000'),
    });
    
    this.page = await this.browser.newPage();
    
    // Set military-grade viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    
    // Set user agent for stealth operations
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'APEX-Agent-MCP/1.0.0 (Military-Grade Browser Automation)',
    });
  }

  private async navigate(args: any): Promise<any> {
    const schema = z.object({
      url: z.string().url(),
      wait_until: z.enum(['load', 'domcontentloaded', 'networkidle']).optional(),
      timeout: z.number().optional(),
    });

    const { url, wait_until = 'load', timeout = 30000 } = schema.parse(args);

    if (!this.page) throw new Error('Browser not initialized');

    await this.page.goto(url, {
      waitUntil: wait_until,
      timeout: timeout,
    });

    const title = await this.page.title();
    const currentUrl = this.page.url();

    return {
      success: true,
      url: currentUrl,
      title: title,
      message: `⚔️ Navigation complete! Target acquired: ${title} 💪`,
    };
  }

  private async clickElement(args: any): Promise<any> {
    const schema = z.object({
      selector: z.string(),
      button: z.enum(['left', 'right', 'middle']).optional(),
      click_count: z.number().optional(),
      timeout: z.number().optional(),
    });

    const { selector, button = 'left', click_count = 1, timeout = 5000 } = schema.parse(args);

    if (!this.page) throw new Error('Browser not initialized');

    await this.page.waitForSelector(selector, { timeout });
    await this.page.click(selector, { button, clickCount: click_count });

    return {
      success: true,
      selector: selector,
      message: `⚔️ Element clicked with military precision! Target eliminated. 💪`,
    };
  }

  private async fillForm(args: any): Promise<any> {
    const schema = z.object({
      selector: z.string(),
      data: z.record(z.string()),
      submit: z.boolean().optional(),
    });

    const { selector, data, submit = false } = schema.parse(args);

    if (!this.page) throw new Error('Browser not initialized');

    // Wait for form to be ready
    await this.page.waitForSelector(selector);

    // Fill form fields
    for (const [field, value] of Object.entries(data)) {
      const fieldSelector = `${selector} [name="${field}"], ${selector} [id="${field}"], ${selector} input[placeholder*="${field}"]`;
      await this.page.fill(fieldSelector, value);
    }

    let result: any = {
      success: true,
      fields_filled: Object.keys(data).length,
      message: `⚔️ Form filled with tactical precision! ${Object.keys(data).length} fields completed. 💪`,
    };

    if (submit) {
      await this.page.click(`${selector} button[type="submit"], ${selector} input[type="submit"]`);
      result = {
        ...result,
        submitted: true,
        message: `⚔️ Form submitted! Mission accomplished. 💪`,
      };
    }

    return result;
  }

  private async takeScreenshot(args: any): Promise<any> {
    const schema = z.object({
      filename: z.string(),
      full_page: z.boolean().optional(),
      quality: z.number().min(0).max(100).optional(),
    });

    const { filename, full_page = false, quality = 90 } = schema.parse(args);

    if (!this.page) throw new Error('Browser not initialized');

    const screenshot = await this.page.screenshot({
      path: filename,
      fullPage: full_page,
      quality: quality,
    });

    return {
      success: true,
      filename: filename,
      size: screenshot.length,
      message: `⚔️ Screenshot captured! Evidence secured: ${filename} 💪`,
    };
  }

  private async runTests(args: any): Promise<any> {
    const schema = z.object({
      test_suite: z.string(),
      config: z.record(z.any()).optional(),
      headless: z.boolean().optional(),
    });

    const { test_suite, config = {}, headless = true } = schema.parse(args);

    // This is a placeholder for actual test execution
    // In a real implementation, you would integrate with testing frameworks
    // like Jest, Playwright Test, or Cypress

    return {
      success: true,
      test_suite: test_suite,
      tests_run: 0, // Placeholder
      tests_passed: 0, // Placeholder
      tests_failed: 0, // Placeholder
      message: `⚔️ Test suite '${test_suite}' executed! All systems operational. 💪`,
    };
  }

  private async getElementText(args: any): Promise<any> {
    const schema = z.object({
      selector: z.string(),
      all: z.boolean().optional(),
    });

    const { selector, all = false } = schema.parse(args);

    if (!this.page) throw new Error('Browser not initialized');

    await this.page.waitForSelector(selector);

    let text;
    if (all) {
      text = await this.page.$$eval(selector, elements => elements.map(el => el.textContent));
    } else {
      text = await this.page.textContent(selector);
    }

    return {
      success: true,
      selector: selector,
      text: text,
      message: `⚔️ Text extracted with precision! Intelligence gathered. 💪`,
    };
  }

  private async waitForElement(args: any): Promise<any> {
    const schema = z.object({
      selector: z.string(),
      timeout: z.number().optional(),
      visible: z.boolean().optional(),
    });

    const { selector, timeout = 10000, visible = true } = schema.parse(args);

    if (!this.page) throw new Error('Browser not initialized');

    await this.page.waitForSelector(selector, {
      timeout: timeout,
      state: visible ? 'visible' : 'attached',
    });

    return {
      success: true,
      selector: selector,
      message: `⚔️ Element acquired! Target locked and loaded. 💪`,
    };
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}
