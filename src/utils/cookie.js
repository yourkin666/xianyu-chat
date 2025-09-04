// Cookie 处理工具模块

/**
 * 将Cookie字符串解析为Playwright格式
 * @param {string} cookieString - Cookie字符串
 * @param {string} domain - 域名，默认为 '.goofish.com'
 * @returns {Array} 解析后的Cookie数组
 */
function parseCookies(cookieString, domain = '.goofish.com') {
    console.log('🍪 正在解析Cookie字符串...');
    
    if (!cookieString || typeof cookieString !== 'string') {
        console.error('❌ Cookie字符串无效');
        return [];
    }
    
    const cookies = cookieString.split(';').map(cookie => {
        const [name, ...valueParts] = cookie.trim().split('=');
        const value = valueParts.join('=');
        
        return {
            name: name,
            value: value,
            domain: domain,
            path: '/',
            httpOnly: false,
            secure: true,
            sameSite: 'Lax'
        };
    }).filter(cookie => cookie.name && cookie.value);
    
    console.log(`✅ 成功解析 ${cookies.length} 个Cookie`);
    return cookies;
}

/**
 * 为浏览器上下文设置Cookie
 * @param {Object} context - Playwright浏览器上下文
 * @param {string} cookieString - Cookie字符串
 * @param {string} domain - 域名
 * @returns {Promise<boolean>} 设置是否成功
 */
async function setCookiesToContext(context, cookieString, domain = '.goofish.com') {
    try {
        console.log('🍪 设置登录状态...');
        
        const cookies = parseCookies(cookieString, domain);
        
        if (cookies.length === 0) {
            console.error('❌ 没有有效的Cookie可设置');
            return false;
        }
        
        await context.addCookies(cookies);
        console.log('✅ Cookie设置成功');
        return true;
    } catch (error) {
        console.error(`❌ Cookie设置失败: ${error.message}`);
        return false;
    }
}

/**
 * 验证Cookie是否有效（检查关键字段）
 * @param {string} cookieString - Cookie字符串
 * @returns {boolean} Cookie是否有效
 */
function validateCookie(cookieString) {
    if (!cookieString || typeof cookieString !== 'string') {
        return false;
    }
    
    // 检查关键的Cookie字段
    const requiredFields = ['_tb_token_', 'unb', 'cna'];
    const hasRequiredFields = requiredFields.some(field => cookieString.includes(field));
    
    if (!hasRequiredFields) {
        console.warn('⚠️ Cookie可能不完整，缺少关键字段');
        return false;
    }
    
    return true;
}

module.exports = {
    parseCookies,
    setCookiesToContext,
    validateCookie
};
