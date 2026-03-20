const {
  readContributing,
  writeContributing,
  findFieldValue,
  ensureMarkers,
  upsertRow,
  mdLink,
} = require('./shared')

const SECTION_TITLE = '## 04 | 报名列表（Registration List）'
const START_MARKER = '<!-- registration-list:start -->'
const END_MARKER = '<!-- registration-list:end -->'

function processRegistration(issueBody, context) {
  let content = readContributing()

  content = ensureMarkers(content, SECTION_TITLE, START_MARKER, END_MARKER)

  const name = findFieldValue(issueBody, 'Name')
  const introduction = findFieldValue(issueBody, 'Introduction')
  const contactMethod = findFieldValue(issueBody, 'ContactMethod')
  const wantsTeam = findFieldValue(issueBody, 'WantsTeam')
  const comment = findFieldValue(issueBody, 'Comment')

  const row = `| #${context.issueNumber} | ${name} | ${introduction} | ${contactMethod} | ${wantsTeam} | ${comment} | ${mdLink('更新', context.issueUrl)} |`

  content = upsertRow(
    content,
    START_MARKER,
    END_MARKER,
    `| #${context.issueNumber} |`,
    row
  )

  writeContributing(content)
}

module.exports = {
  processRegistration,
}
