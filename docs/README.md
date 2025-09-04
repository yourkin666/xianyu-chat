# 闲鱼自动化工具 v2.1.0

> 🎯 基于Playwright的闲鱼网站自动化工具，采用现代化模块架构设计

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-brightgreen.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Latest-blue.svg)](https://playwright.dev/)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ 特性

- 🔐 **环境变量配置** - 安全的配置管理
- 🏗️ **模块化架构** - 清晰的代码组织
- 🎯 **智能定位** - 三重验证机制防误点击
- 🛡️ **错误处理** - 优雅的异常处理
- 📱 **用户友好** - 详细的操作日志

## 📁 项目结构

```
xianyu-automation/
├── src/                    # 📦 源码目录
│   ├── config/            # ⚙️ 配置模块
│   │   └── index.js       #     环境变量配置
│   ├── utils/             # 🛠️ 工具函数
│   │   └── cookie.js      #     Cookie处理工具
│   ├── services/          # 🌐 业务服务
│   │   └── browser.js     #     浏览器核心操作
│   ├── actions/           # 🎯 操作模块  
│   │   └── clickMessageButton.js     #     消息按钮点击
│   └── app.js             # 🚀 应用主逻辑
├── docs/                  # 📚 文档目录
│   └── README.md          #     项目文档
├── backup/                # 📁 备份文件
│   └── xianyu-original.js #     原版代码备份
├── assets/                # 🎨 静态资源
│   └── screenshots/       #     运行截图
├── index.js               # 🎪 项目入口
├── .env.example           # 🔐 配置模板
├── .gitignore             # 🚫 Git忽略规则
└── package.json           # 📋 项目配置
```

## 🚀 快速开始

### 1️⃣ 安装依赖

```bash
npm install
```

### 2️⃣ 配置环境

```bash
# 复制配置模板
cp .env.example .env

# 编辑配置文件，设置你的Cookie
vim .env
```

### 3️⃣ 运行工具

```bash
# 完整功能（访问网站 + 点击消息按钮）
node index.js

# 简单模式（只访问网站）
node index.js --simple
```

## ⚙️ 配置说明

### 环境变量配置

| 配置项 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `COOKIE_STRING` | 闲鱼登录Cookie | 无 | ✅ |
| `WEBSITE_URL` | 闲鱼网站地址 | https://www.goofish.com | ❌ |
| `BROWSER_HEADLESS` | 无头模式 | false | ❌ |
| `BROWSER_SLOW_MO` | 操作延迟(ms) | 500 | ❌ |
| `VIEWPORT_WIDTH` | 浏览器宽度 | 1280 | ❌ |
| `VIEWPORT_HEIGHT` | 浏览器高度 | 720 | ❌ |
| `TIMEOUT_PAGE_LOAD` | 页面加载等待 | 3000 | ❌ |
| `TIMEOUT_AFTER_CLICK` | 点击后等待 | 3000 | ❌ |
| `LOG_LEVEL` | 日志级别 | info | ❌ |

### 获取Cookie方法

1. 打开Chrome浏览器访问 [闲鱼](https://www.goofish.com)
2. 登录你的账号
3. 按 `F12` 打开开发者工具
4. 切换到 `Network` 选项卡
5. 刷新页面，点击第一个请求
6. 在请求头中找到并复制 `Cookie` 值
7. 粘贴到 `.env` 文件的 `COOKIE_STRING` 中

## 🏗️ 架构设计

### 分层架构

```
┌─────────────────────────┐
│      index.js           │ ← 项目入口
│    (应用控制层)          │
└─────────────────────────┘
            │
┌─────────────────────────┐
│      src/app.js         │ ← 应用逻辑
│    (业务逻辑层)          │
└─────────────────────────┘
            │
┌─────────────────────────┐
│   src/services/         │ ← 服务层
│   src/actions/          │
│   src/utils/            │
└─────────────────────────┘
            │
┌─────────────────────────┐
│    src/config/          │ ← 配置层
└─────────────────────────┘
```

### 模块职责

- **🎪 index.js** - 项目入口，命令行处理
- **🚀 app.js** - 应用主逻辑，业务编排
- **🌐 services/** - 核心业务服务
- **🎯 actions/** - 具体操作实现
- **🛠️ utils/** - 通用工具函数
- **⚙️ config/** - 配置管理

## 💡 使用示例

### 基本使用

```javascript
const xianyu = require('./index');

// 方式1: 使用主函数
await xianyu.main();

// 方式2: 使用应用实例
const info = xianyu.getInfo();
console.log(info);
```

### 高级用法

```javascript
// 直接使用子模块
const { browser } = require('./index');
await browser.visitXianyu();

// 使用工具函数
const { cookie } = require('./index');
const cookies = cookie.parseCookies(cookieString);
```

### 自定义配置

```javascript
// 访问应用实例
const { app } = require('./index');
console.log(app.getInfo());

// 运行特定模式
await app.runSimple();
```

## 🛠️ 开发指南

### 添加新功能

1. 在相应的模块目录下创建文件
2. 实现功能逻辑
3. 在 `src/app.js` 中集成
4. 在 `index.js` 中导出

### 目录规范

- `src/config/` - 配置相关模块
- `src/utils/` - 纯函数工具
- `src/services/` - 有状态的服务
- `src/actions/` - 具体的操作行为

### 命名约定

- 文件名：小写字母 + 连字符
- 函数名：驼峰命名
- 类名：帕斯卡命名
- 常量：全大写 + 下划线

## 🔒 安全说明

- `.env` 文件包含敏感信息，已添加到 `.gitignore`
- Cookie有时效性，建议定期更新
- 在可信环境中运行，注意网络安全

## 📝 更新日志

### v2.1.0
- 🏗️ 重新设计项目结构
- 📦 模块化架构升级
- 🔐 环境变量配置
- 📚 完善的文档体系

### v2.0.0
- 📦 模块化重构
- 🍪 Cookie处理优化
- 🎯 智能点击机制

### v1.0.0
- 🚀 项目初始版本
- 📱 基本的消息按钮点击功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

<div align="center">
  <p>🎯 让闲鱼操作更简单</p>
  <p>Made with ❤️ by Developer</p>
</div>