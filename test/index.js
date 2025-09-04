// 闲鱼自动化工具 - 测试模块

const path = require('path');

// 引入主应用模块
const XianyuApp = require('../src/app');
const { visitXianyu } = require('../src/services/browser');

/**
 * 测试Cookie登录功能（仅访问网站，不点击消息按钮）
 */
async function testCookieLogin() {
    console.log('🧪 开始Cookie登录测试...');
    
    try {
        const success = await visitXianyu({ clickMessage: false });
        if (success) {
            console.log('✅ Cookie登录测试成功！');
        } else {
            console.log('❌ Cookie登录测试失败！');
        }
        return success;
    } catch (error) {
        console.error(`❌ Cookie登录测试出错: ${error.message}`);
        return false;
    }
}

/**
 * 测试点击消息按钮功能
 */
async function testClickMessageButton() {
    console.log('🧪 开始消息按钮点击测试...');
    
    try {
        const app = new XianyuApp();
        const success = await app.runFull(); // 使用完整功能测试
        if (success) {
            console.log('✅ 消息按钮点击测试成功！');
        } else {
            console.log('❌ 消息按钮点击测试失败！');
        }
        return success;
    } catch (error) {
        console.error(`❌ 消息按钮点击测试出错: ${error.message}`);
        return false;
    }
}

/**
 * 测试验证码处理功能
 */
async function testCaptchaHandling() {
    console.log('🧪 开始验证码处理测试...');
    console.log('ℹ️ 注意: 验证码处理需要人工交互，此测试将运行完整流程');
    
    try {
        const app = new XianyuApp();
        const success = await app.runFull(); // 运行完整流程，遇到验证码时需要人工处理
        if (success) {
            console.log('✅ 验证码处理测试完成！');
        } else {
            console.log('⚠️ 验证码处理测试完成，但可能遇到问题');
        }
        return success;
    } catch (error) {
        console.error(`❌ 验证码处理测试出错: ${error.message}`);
        return false;
    }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
    console.log('🧪 开始运行所有测试...\n');
    
    const tests = [
        { name: 'Cookie登录测试', func: testCookieLogin },
        { name: '消息按钮点击测试', func: testClickMessageButton },
        { name: '验证码处理测试', func: testCaptchaHandling }
    ];
    
    const results = [];
    
    for (const test of tests) {
        console.log(`\n📋 运行 ${test.name}...`);
        try {
            const result = await test.func();
            results.push({ name: test.name, success: result });
            console.log(`${result ? '✅' : '❌'} ${test.name} ${result ? '成功' : '失败'}\n`);
        } catch (error) {
            results.push({ name: test.name, success: false, error: error.message });
            console.log(`❌ ${test.name} 出现错误: ${error.message}\n`);
        }
    }
    
    // 显示测试总结
    console.log('🎯 测试总结:');
    console.log('═'.repeat(50));
    results.forEach(result => {
        const status = result.success ? '✅ 成功' : '❌ 失败';
        console.log(`  ${status} - ${result.name}`);
        if (result.error) {
            console.log(`    错误: ${result.error}`);
        }
    });
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n📊 结果: ${successCount}/${results.length} 测试通过`);
    
    return successCount === results.length;
}

module.exports = {
    testCookieLogin,
    testClickMessageButton,
    testCaptchaHandling,
    runAllTests
};

// 如果直接运行此文件，执行所有测试
if (require.main === module) {
    runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ 测试运行失败:', error);
        process.exit(1);
    });
}
