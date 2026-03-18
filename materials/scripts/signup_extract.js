/**
<<<<<<< HEAD
 * 注册信息提取脚本
 * Registration information extraction script
 * 
 * 用于处理 GitHub Issue 中的注册信息，创建用户注册文件并更新 README 表格
=======
 * Registration information extraction script
 * 
 * Used to process registration information from GitHub Issues, create user registration files and update README table
>>>>>>> temple/main
 */

const RegistrationProcessor = require('./processors/registration-processor');

<<<<<<< HEAD
// 从环境变量获取参数
const issueBody = process.env.ISSUE_BODY || `Name[姓名]:test

Brief personal introduction including skills and experience (One sentence)[简短介绍个人技能与经验]
Description[个人介绍]:description

Telegram | WeChat | Discord | Email | X(Twitter) | GitHub
ContactMethod[联系方式]:contactMethod

e.g., @username, email@example.com
Contact[联系账号]:contact22`;

const githubUser = process.env.ISSUE_USER || 'githubUser';

// 调试输出
console.log('处理用户:', githubUser);
console.log('Issue 内容:\n', issueBody);

try {
    // 处理注册
    RegistrationProcessor.processRegistration(issueBody, githubUser);
} catch (error) {
    console.error('注册处理失败:', error.message);
=======
// Get parameters from environment variables
const issueBody = process.env.ISSUE_BODY;

const githubUser = process.env.ISSUE_USER;

// Debug output
console.log('Processing user:', githubUser);
console.log('Issue content:\n', issueBody);

try {
    // Process registration
    RegistrationProcessor.processRegistration(issueBody, githubUser);

    // Set script_success to true when processing completes successfully
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=true\n`);
    }

    console.log('✅ Registration processing completed successfully');
} catch (error) {
    // Set script_success to false when processing fails
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=false\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `error_message<<EOF\n❌ **Processing Failed**\n\nRegistration processing failed: ${error.message}\nEOF\n`);
    }

    console.error('ERROR_MESSAGE:', `❌ **Processing Failed**\n\nRegistration processing failed: ${error.message}`);
    console.error('Registration processing failed:', error.message);
>>>>>>> temple/main
    process.exit(1);
}