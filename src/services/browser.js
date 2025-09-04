// 浏览器核心操作模块

const { chromium } = require('playwright');
const { BROWSER_CONFIG, ACTION_CONFIG, COOKIE_STRING } = require('../config');
const { setCookiesToContext, validateCookie } = require('../utils/cookie');
const { clickMessageButton } = require('../actions/message');

/**
 * 访问闲鱼网站并执行操作
 * @param {Object} options - 选项配置
 * @param {boolean} options.clickMessage - 是否点击消息按钮，默认true
 * @returns {Promise<boolean>} 执行是否成功
 */
async function visitXianyu(options = { clickMessage: true }) {
    console.log('🚀 启动浏览器...');
    
    // 验证Cookie
    if (!validateCookie(COOKIE_STRING)) {
        console.error('❌ Cookie验证失败，请检查配置文件中的COOKIE_STRING');
        return false;
    }
    
    const browser = await chromium.launch(BROWSER_CONFIG.LAUNCH_OPTIONS);
    
    try {
        // 创建浏览器上下文
        const context = await createBrowserContext(browser);
        if (!context) {
            return false;
        }
        
        // 设置Cookie
        const cookieSetSuccess = await setCookiesToContext(context, COOKIE_STRING, BROWSER_CONFIG.WEBSITE.DOMAIN);
        if (!cookieSetSuccess) {
            console.warn('⚠️ Cookie设置失败，但继续执行...');
        }
        
        // 访问网站
        const page = await visitWebsite(context);
        if (!page) {
            return false;
        }
        
        // 执行操作
        let operationSuccess = true;
        if (options.clickMessage) {
            operationSuccess = await executeMessageButtonClick(page);
        } else {
            console.log('🎉 成功访问闲鱼网站并设置登录状态！');
            console.log(`🔗 当前页面: ${page.url()}`);
        }
        
        // 等待观察结果
        console.log(`⏰ 等待${ACTION_CONFIG.TIMEOUTS.OBSERVE_RESULT / 1000}秒观察结果...`);
        await page.waitForTimeout(ACTION_CONFIG.TIMEOUTS.OBSERVE_RESULT);
        
        return operationSuccess;
        
    } catch (error) {
        console.error(`❌ 执行失败: ${error.message}`);
        return false;
    } finally {
        await browser.close();
        console.log('🔒 浏览器已关闭');
    }
}

/**
 * 创建浏览器上下文
 * @param {Object} browser - Playwright浏览器实例
 * @returns {Promise<Object|null>} 浏览器上下文对象
 */
async function createBrowserContext(browser) {
    try {
        const context = await browser.newContext(BROWSER_CONFIG.CONTEXT_OPTIONS);
        console.log('✅ 浏览器上下文创建成功');
        return context;
    } catch (error) {
        console.error(`❌ 创建浏览器上下文失败: ${error.message}`);
        return null;
    }
}

/**
 * 访问闲鱼网站
 * @param {Object} context - 浏览器上下文
 * @returns {Promise<Object|null>} 页面对象
 */
async function visitWebsite(context) {
    try {
        const page = await context.newPage();
        
        // 访问闲鱼网站
        console.log('🌐 访问闲鱼网站...');
        await page.goto(BROWSER_CONFIG.WEBSITE.URL, {
            waitUntil: 'domcontentloaded',
            timeout: BROWSER_CONFIG.WEBSITE.TIMEOUT
        });
        
        console.log('✅ 页面加载完成');
        await page.waitForTimeout(ACTION_CONFIG.TIMEOUTS.PAGE_LOAD);
        
        return page;
    } catch (error) {
        console.error(`❌ 访问网站失败: ${error.message}`);
        return null;
    }
}

/**
 * 执行消息按钮点击操作
 * @param {Object} page - 页面对象
 * @returns {Promise<boolean>} 操作是否成功
 */
async function executeMessageButtonClick(page) {
    try {
        const success = await clickMessageButton(page);
        
        if (success) {
            console.log('🎉 操作成功完成！成功访问消息页面');
        } else {
            console.log('⚠️ 消息按钮点击失败，但网站访问成功');
        }
        
        return success;
    } catch (error) {
        console.error(`❌ 消息按钮点击操作失败: ${error.message}`);
        return false;
    }
}

/**
 * 简单访问闲鱼网站（不点击消息按钮）
 * @returns {Promise<boolean>} 访问是否成功
 */
async function visitXianyuSimple() {
    return await visitXianyu({ clickMessage: false });
}

/**
 * 访问闲鱼网站并点击消息按钮（完整功能）
 * @returns {Promise<boolean>} 操作是否成功
 */
async function visitXianyuWithMessage() {
    return await visitXianyu({ clickMessage: true });
}

module.exports = {
    visitXianyu,
    visitXianyuSimple,
    visitXianyuWithMessage,
    createBrowserContext,
    visitWebsite,
    executeMessageButtonClick
};
