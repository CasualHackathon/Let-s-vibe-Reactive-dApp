/**
<<<<<<< HEAD
 * 项目提交信息提取脚本
 * Submission information extraction script
 * 
 * 用于处理 GitHub Issue 中的项目提交信息，创建项目文件夹并更新 README 表格
=======
 * Submission information extraction script
 * 
 * Used to process project submission information from GitHub Issues, create project folders and update README table
>>>>>>> temple/main
 */

const SubmissionProcessor = require('./processors/submission-processor');

<<<<<<< HEAD
// 从环境变量获取参数
const issueBody = process.env.ISSUE_BODY || `ProjectName[项目名称]:projectName

Brief description about your project in one sentence（简要描述您的项目）
ProjectDescription[项目描述]:ProjectDescription

Your wallet address or ENS domain on Ethereum mainnet（您在以太坊主网上的钱包地址或 ENS 域名）
WalletAddress[钱包地址]:test.eth`;

const githubUser = process.env.ISSUE_USER || 'githubUser';

// 调试输出
console.log('处理用户:', githubUser);
console.log('Issue 内容:\n', issueBody);

try {
    // 处理项目提交
    SubmissionProcessor.processSubmission(issueBody, githubUser);
} catch (error) {
    console.error('项目提交处理失败:', error.message);
=======
// Get parameters from environment variables
const issueBody = process.env.ISSUE_BODY;

const githubUser = process.env.ISSUE_USER;

// Debug output
console.log('Processing user:', githubUser);
console.log('Issue content:\n', issueBody);

try {
    // Process project submission
    SubmissionProcessor.processSubmission(issueBody, githubUser);

    // Set script_success to true when processing completes successfully
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=true\n`);
    }

    console.log('✅ Submission processing completed successfully');
} catch (error) {
    // Set script_success to false when processing fails
    if (process.env.GITHUB_OUTPUT) {
        const fs = require('fs');
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `script_success=false\n`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `error_message<<EOF\n❌ **Processing Failed**\n\nSubmission processing failed: ${error.message}\nEOF\n`);
    }

    console.error('ERROR_MESSAGE:', `❌ **Processing Failed**\n\nSubmission processing failed: ${error.message}`);
    console.error('Project submission processing failed:', error.message);
>>>>>>> temple/main
    process.exit(1);
}