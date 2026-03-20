const { appendGithubOutput } = require('./processors/shared')
const { processSubmission } = require('./processors/submission-processor')

const issueBody = process.env.ISSUE_BODY || ''

const context = {
  issueNumber: process.env.ISSUE_NUMBER || '',
  issueTitle: process.env.ISSUE_TITLE || '',
  issueUrl: process.env.ISSUE_URL || '',
  issueUser: process.env.ISSUE_USER || ''
}

console.log('处理 submission issue:', context.issueNumber)
console.log('处理用户:', context.issueUser)
console.log('Issue 标题:', context.issueTitle)
console.log('Issue 内容:\n', issueBody)
console.log('---')

try {
  processSubmission(issueBody, context)
  appendGithubOutput('script_success', 'true')
  console.log('✅ 项目信息同步成功')
} catch (error) {
  appendGithubOutput('script_success', 'false')
  appendGithubOutput('error_message', `❌ 项目提交处理失败\n\n${error.message}`)
  console.error('❌ 项目提交处理失败:', error.message)
  console.error(error.stack)
  process.exit(1)
}
