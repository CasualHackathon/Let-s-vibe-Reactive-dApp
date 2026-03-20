const {
  readContributing,
  writeContributing,
  findFieldValue,
  ensureMarkers,
  upsertRow,
  mdLink
} = require('./shared')

const SECTION_TITLE = '## 06 | 特别挑战提交名单'
const START_MARKER = '<!-- special-list:start -->'
const END_MARKER = '<!-- special-list:end -->'

function processSpecial(issueBody, context) {
  let content = readContributing()

  content = ensureMarkers(content, SECTION_TITLE, START_MARKER, END_MARKER)

  const name = findFieldValue(issueBody, 'Name')
  const demo1 = findFieldValue(issueBody, 'Demo1')
  const demo2 = findFieldValue(issueBody, 'Demo2')
  const demo3 = findFieldValue(issueBody, 'Demo3')

  const row = `| ${name} | ${demo1} | ${demo2} | ${demo3} | ${mdLink(`查看 / 更新 #${context.issueNumber}`, context.issueUrl)} |`

  content = upsertRow(
    content,
    START_MARKER,
    END_MARKER,
    `更新 #${context.issueNumber}](`,
    row
  )

  writeContributing(content)
}

module.exports = {
  processSpecial
}
