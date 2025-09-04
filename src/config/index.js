// 闲鱼自动化工具 - 配置文件

// 加载环境变量
require('dotenv').config();

/**
 * 获取环境变量的辅助函数
 * @param {string} key - 环境变量名
 * @param {*} defaultValue - 默认值
 * @returns {*} 环境变量值或默认值
 */
function getEnv(key, defaultValue = undefined) {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue === undefined) {
            console.warn(`⚠️ 环境变量 ${key} 未设置，请检查 .env 文件`);
        }
        return defaultValue;
    }
    
    // 处理布尔值
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // 处理数字
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
        return parseFloat(value);
    }
    
    return value;
}

/**
 * Cookie 字符串配置
 * 从环境变量读取，如果未设置则显示警告
 */
const COOKIE_STRING = getEnv('COOKIE_STRING');

/**
 * 浏览器配置
 * 从环境变量读取配置，提供合理的默认值
 */
const BROWSER_CONFIG = {
    // 网站配置
    WEBSITE: {
        URL: getEnv('WEBSITE_URL', 'https://www.goofish.com'),
        DOMAIN: getEnv('WEBSITE_DOMAIN', '.goofish.com'),
        TIMEOUT: getEnv('WEBSITE_TIMEOUT', 20000)
    },
    
    // 浏览器启动配置
    LAUNCH_OPTIONS: {
        headless: getEnv('BROWSER_HEADLESS', false),
        slowMo: getEnv('BROWSER_SLOW_MO', 500),
        args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
    },
    
    // 浏览器上下文配置
    CONTEXT_OPTIONS: {
        userAgent: getEnv('USER_AGENT', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
        viewport: { 
            width: getEnv('VIEWPORT_WIDTH', 1280), 
            height: getEnv('VIEWPORT_HEIGHT', 720) 
        },
        extraHTTPHeaders: {
            'Accept-Language': getEnv('ACCEPT_LANGUAGE', 'zh-CN,zh;q=0.9,en;q=0.8')
        }
    }
};

/**
 * 操作配置
 * 从环境变量读取超时配置，提供合理的默认值
 */
const ACTION_CONFIG = {
    // 等待时间配置（毫秒）
    TIMEOUTS: {
        PAGE_LOAD: getEnv('TIMEOUT_PAGE_LOAD', 3000),           // 页面加载等待
        AFTER_CLICK: getEnv('TIMEOUT_AFTER_CLICK', 3000),       // 点击后等待
        SCROLL_TO_VIEW: getEnv('TIMEOUT_SCROLL_TO_VIEW', 500),   // 滚动到视图等待
        OBSERVE_RESULT: getEnv('TIMEOUT_OBSERVE_RESULT', 10000) // 观察结果等待
    }
};

/**
 * 调试配置
 * 从环境变量读取调试相关配置
 */
const DEBUG_CONFIG = {
    LOG_LEVEL: getEnv('LOG_LEVEL', 'info'),
    VERBOSE_LOGGING: getEnv('VERBOSE_LOGGING', true)
};

module.exports = {
    COOKIE_STRING,
    BROWSER_CONFIG,
    ACTION_CONFIG,
    DEBUG_CONFIG,
    getEnv  // 导出辅助函数供其他模块使用
};
