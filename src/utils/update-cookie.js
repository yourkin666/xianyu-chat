#!/usr/bin/env node

// 简化的Cookie更新脚本

const fs = require('fs');
const path = require('path');

function updateCookie(newCookie) {
    if (!newCookie) {
        console.log('❌ 请提供Cookie字符串');
        console.log('用法: node update-cookie.js "你的Cookie字符串"');
        process.exit(1);
    }

    const envPath = path.join(__dirname, '.env');
    
    // 备份.env文件
    if (fs.existsSync(envPath)) {
        fs.copyFileSync(envPath, path.join(__dirname, '.env.backup'));
        console.log('📁 已备份.env文件');
    }

    // 读取并更新.env文件
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const cookieLine = `COOKIE_STRING=${newCookie.trim()}`;
    
    if (envContent.includes('COOKIE_STRING=')) {
        envContent = envContent.replace(/COOKIE_STRING=.*$/m, cookieLine);
    } else {
        envContent += `\n${cookieLine}\n`;
    }

    // 写入文件
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Cookie更新成功！');
}

// 获取命令行参数中的Cookie
const newCookie = process.argv[2];
updateCookie(newCookie);
