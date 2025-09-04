// 浏览器核心操作模块

const { chromium } = require('playwright');
const { BROWSER_CONFIG, ACTION_CONFIG, COOKIE_STRING } = require('../config');
const { setCookiesToContext, validateCookie } = require('../utils/cookie');
const { clickMessageButton } = require('../actions/clickMessageButton');

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
        const context = await browser.newContext(BROWSER_CONFIG.CONTEXT_OPTIONS);
        console.log('✅ 浏览器上下文创建成功');
        
        // 设置Cookie
        const cookieSetSuccess = await setCookiesToContext(context, COOKIE_STRING, BROWSER_CONFIG.WEBSITE.DOMAIN);
        if (!cookieSetSuccess) {
            console.warn('⚠️ Cookie设置失败，但继续执行...');
        }
        
        // 访问网站
        const page = await context.newPage();
        console.log('🌐 访问闲鱼网站...');
        await page.goto(BROWSER_CONFIG.WEBSITE.URL, {
            waitUntil: 'domcontentloaded',
            timeout: BROWSER_CONFIG.WEBSITE.TIMEOUT
        });
        console.log('✅ 页面加载完成');
        await page.waitForTimeout(ACTION_CONFIG.TIMEOUTS.PAGE_LOAD);
        
        // 执行操作
        let operationSuccess = true;
        if (options.clickMessage) {
            operationSuccess = await clickMessageButton(page);
        } else {
            console.log('🎉 成功访问闲鱼网站并设置登录状态！');
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



module.exports = {
    visitXianyu
};
