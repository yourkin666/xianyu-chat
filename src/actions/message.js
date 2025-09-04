// 消息按钮点击操作模块

const { ACTION_CONFIG } = require('../config');

/**
 * 点击消息按钮：基于HTML结构进行精确点击
 * @param {Object} page - Playwright页面对象
 * @returns {Promise<boolean>} 点击是否成功
 */
async function clickMessageButton(page) {
    console.log('📱 正在点击消息按钮...');
    console.log('🎯 目标: <a class="sidebar-item-wrap--EGyyd81t" data-spm-anchor-id="a21ybx.home.sidebar.2">');
    console.log('💡 策略: 三重验证机制 - 文本内容 + IM链接 + SPM属性');
    console.log('🛡️ 防误点: 必须满足至少2个验证条件才会点击');
    
    // 消息按钮的选择器（按精确度优先级排序，确保点击正确按钮）
    const selectors = getMessageButtonSelectors();
    
    for (let i = 0; i < selectors.length; i++) {
        const selector = selectors[i];
        try {
            console.log(`🔍 尝试选择器 ${i + 1}/${selectors.length}: ${selector}`);
            const element = await page.locator(selector).first();
            
            if (await element.count() > 0) {
                const isVisible = await element.isVisible();
                console.log(`📍 元素状态: 存在=${await element.count()}, 可见=${isVisible}`);
                
                if (isVisible) {
                    // 🔍 额外验证：检查元素内容确保是消息按钮
                    const isCorrectElement = await validateMessageButton(element);
                    
                    if (isCorrectElement) {
                        console.log(`✅ 找到并验证消息按钮，使用选择器: ${selector}`);
                        
                        // 执行点击操作
                        const clickSuccess = await performClick(page, element);
                        if (clickSuccess) {
                            return true;
                        }
                    }
                }
            }
        } catch (error) {
            console.log(`❌ 选择器 ${selector} 失败: ${error.message}`);
            continue;
        }
    }
    
    console.log('❌ 所有选择器都无法找到或点击消息按钮');
    return false;
}

/**
 * 获取消息按钮的选择器列表（优化后，保留最有效的选择器）
 * @returns {Array<string>} 选择器数组
 */
function getMessageButtonSelectors() {
    return [
        // 🎯 最精确选择器 - 同时匹配多个关键属性
        'a.sidebar-item-wrap--EGyyd81t[data-spm-anchor-id="a21ybx.home.sidebar.2"][href*="/im"]',
        
        // 🔍 精确匹配 - 基于数据属性和链接
        'a[data-spm-anchor-id="a21ybx.home.sidebar.2"][href*="/im"]',
        
        // 📝 文本验证组合 - 确保包含"消息"文字
        'a:has-text("消息")[href*="/im"]',
        
        // 🛡️ 安全备用 - SPM属性匹配
        'a[data-spm-anchor-id="a21ybx.home.sidebar.2"]',
        
        // 🔧 兼容性备用 - 类名和文本组合
        'a:has-text("消息")[class*="sidebar-item-wrap"]'
    ];
}

/**
 * 验证元素是否为正确的消息按钮
 * @param {Object} element - Playwright元素对象
 * @returns {Promise<boolean>} 是否为正确的消息按钮
 */
async function validateMessageButton(element) {
    try {
        // 验证1: 检查是否包含"消息"文字
        const textContent = await element.textContent();
        const hasMessageText = textContent && textContent.includes('消息');
        
        // 验证2: 检查href是否指向IM页面
        const href = await element.getAttribute('href');
        const hasImHref = href && href.includes('/im');
        
        // 验证3: 检查data-spm-anchor-id是否正确
        const spmId = await element.getAttribute('data-spm-anchor-id');
        const hasCorrectSpm = spmId && spmId.includes('home.sidebar.2');
        
        console.log(`🔎 元素验证: 包含"消息"=${hasMessageText}, IM链接=${hasImHref}, 正确SPM=${hasCorrectSpm}`);
        
        // 至少需要满足两个条件才认为是正确的按钮
        const validConditions = [hasMessageText, hasImHref, hasCorrectSpm].filter(Boolean).length;
        const isCorrectElement = validConditions >= 2;
        
        if (!isCorrectElement) {
            console.log('⚠️ 元素验证失败，可能不是消息按钮，跳过...');
            return false;
        }
        
        return true;
    } catch (validationError) {
        console.log(`⚠️ 元素验证出错: ${validationError.message}，继续尝试点击...`);
        return true; // 验证出错时默认继续尝试
    }
}

/**
 * 执行点击操作
 * @param {Object} page - Playwright页面对象
 * @param {Object} element - 要点击的元素
 * @returns {Promise<boolean>} 点击是否成功
 */
async function performClick(page, element) {
    try {
        // 滚动到元素位置（确保可点击）
        await element.scrollIntoViewIfNeeded();
        await page.waitForTimeout(ACTION_CONFIG.TIMEOUTS.SCROLL_TO_VIEW);
        
        // 点击元素
        await element.click();
        console.log('🖱️  成功点击消息按钮！');
        
        // 等待页面跳转
        await page.waitForTimeout(ACTION_CONFIG.TIMEOUTS.AFTER_CLICK);
        
        // 检查是否成功跳转到IM页面
        if (page.url().includes('/im')) {
            console.log('🎉 成功跳转到消息页面！');
            return true;
        } else {
            console.log('⚠️ 点击成功但未跳转到消息页面，继续尝试其他方法...');
            return false;
        }
    } catch (error) {
        console.log(`❌ 点击操作失败: ${error.message}`);
        return false;
    }
}

module.exports = {
    clickMessageButton,
    getMessageButtonSelectors,
    validateMessageButton,
    performClick
};
