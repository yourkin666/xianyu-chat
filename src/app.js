// 闲鱼自动化工具 - 应用主逻辑

const { visitXianyuWithMessage } = require('./services/browser');

/**
 * 应用主类
 */
class XianyuApp {
    constructor() {
        this.name = '闲鱼自动化工具';
        this.version = '2.1.0';
    }

    /**
     * 显示应用信息
     */
    showBanner() {
        console.log(`🎯 ${this.name} v${this.version}`);
        console.log('═'.repeat(30));
        console.log('📦 全新模块化架构');
        console.log('🔐 环境变量配置');
        console.log('');
    }

    /**
     * 运行完整功能（访问网站 + 点击消息按钮）
     * @returns {Promise<boolean>} 执行结果
     */
    async runFull() {
        this.showBanner();
        
        try {
            console.log('🚀 启动完整功能模式...');
            const success = await visitXianyuWithMessage();
            
            if (success) {
                console.log('');
                console.log('🎊 任务执行完成！');
            } else {
                console.log('');
                console.log('⚠️ 任务执行遇到问题，请检查日志');
            }
            
            return success;
        } catch (error) {
            console.error(`❌ 应用执行失败: ${error.message}`);
            return false;
        }
    }


    /**
     * 获取应用信息
     * @returns {Object} 应用信息对象
     */
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            description: '基于Playwright的闲鱼自动化工具',
            features: [
                '自动登录闲鱼网站',
                '智能点击消息按钮',
                '环境变量配置',
                '模块化架构',
                '三重验证机制'
            ]
        };
    }
}

module.exports = XianyuApp;
