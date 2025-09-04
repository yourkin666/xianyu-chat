// 闲鱼自动化工具 - 项目入口文件

const XianyuApp = require('./src/app');

/**
 * 创建应用实例
 */
const app = new XianyuApp();

/**
 * 主函数 - 默认执行完整功能（访问网站 + 点击消息按钮）
 */
async function main() {
    return await app.runFull();
}

/**
 * 简单模式 - 只访问网站，不点击消息按钮
 */
async function simpleMode() {
    return await app.runSimple();
}

// 运行脚本
if (require.main === module) {
    // 检查命令行参数
    const args = process.argv.slice(2);
    const isSimpleMode = args.includes('--simple') || args.includes('-s');
    
    if (isSimpleMode) {
        simpleMode().catch(console.error);
    } else {
        main().catch(console.error);
    }
}

// 导出核心功能
module.exports = {
    // 主要功能
    main,
    simpleMode,
    
    // 应用实例
    app,
    
    // 向后兼容的功能别名
    visitXianyu: main,
    visitXianyuSimple: simpleMode,
    visitXianyuWithMessage: main,
    
    // 导出子模块（高级用法）
    browser: require('./src/services/browser'),
    message: require('./src/actions/message'),
    cookie: require('./src/utils/cookie'),
    config: require('./src/config'),
    
    // 应用信息
    getInfo: () => app.getInfo()
};
