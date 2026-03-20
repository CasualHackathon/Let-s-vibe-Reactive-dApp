const {
  readContributing,
  writeContributing,
  findFieldValue,
  ensureMarkers,
  upsertRow,
  mdLink
} = require('./shared')

const SECTION_TITLE = '## 04 | 报名列表（Registration List）'
const START_MARKER = '<!-- registration-list:start -->'
const END_MARKER = '<!-- registration-list:end -->'

function extractIssueNumberFromRow(row) {
  const match = row.match(/\[更新\]\(https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/(\d+)\)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function renumberRows(content) {
  const reg = new RegExp(
    `${escapeForRegExp(START_MARKER)}\\n([\\s\\S]*?)\\n${escapeForRegExp(END_MARKER)}`
  )

  const match = content.match(reg)
  if (!match) {
    throw new Error(`未找到锚点: ${START_MARKER} / ${END_MARKER}`)
  }

  const rows = match[1]
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.trim())

  rows.sort((a, b) => extractIssueNumberFromRow(a) - extractIssueNumberFromRow(b))

  const renumbered = rows.map((row, index) => {
    return row.replace(/^\|\s*#?\d+\s*\|/, `| ${index + 1} |`)
  })

  const replacement = `${START_MARKER}\n${renumbered.join('\n')}\n${END_MARKER}`
  return content.replace(reg, replacement)
}

function escapeForRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function processRegistration(issueBody, context) {
  let content = readContributing()

  content = ensureMarkers(content, SECTION_TITLE, START_MARKER, END_MARKER)

  const name = findFieldValue(issueBody, 'Name')
  const introduction = findFieldValue(issueBody, 'Introduction')
  const contactMethod = findFieldValue(issueBody, 'ContactMethod')
  const wantsTeam = findFieldValue(issueBody, 'WantsTeam')
  const comment = findFieldValue(issueBody, 'Comment')

  const row = `| ${context.issueNumber} | ${name} | ${introduction} | ${contactMethod} | ${wantsTeam} | ${comment} | ${mdLink('更新', context.issueUrl)} |`

  content = upsertRow(
    content,
    START_MARKER,
    END_MARKER,
    mdLink('更新', context.issueUrl),
    row
  )

  content = renumberRows(content)

  writeContributing(content)
}

module.exports = {
  processRegistration
}
