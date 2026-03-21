const {
  readContributing,
  writeContributing,
  findFieldValue,
  ensureMarkers,
  mdLink
} = require('./shared')

const SECTION_TITLE = '## 04 | 报名列表（Registration List）'
const START_MARKER = '<!-- registration-list:start -->'
const END_MARKER = '<!-- registration-list:end -->'

function escapeForRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractIssueNumberFromRow(row) {
  const match = row.match(/\[更新\]\(https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/(\d+)\)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function splitTableBlock(content) {
  const reg = new RegExp(
    `${escapeForRegExp(START_MARKER)}\\n([\\s\\S]*?)\\n${escapeForRegExp(END_MARKER)}`
  )

  const match = content.match(reg)
  if (!match) {
    throw new Error(`未找到锚点: ${START_MARKER} / ${END_MARKER}`)
  }

  const block = match[1]
  const lines = block
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.trim())

  if (lines.length < 2) {
    throw new Error('报名表格缺少表头或分隔线')
  }

  const headerRow = lines[0]
  const separatorRow = lines[1]
  const dataRows = lines.slice(2)

  return {
    reg,
    headerRow,
    separatorRow,
    dataRows
  }
}

function rebuildTableBlock(content, headerRow, separatorRow, dataRows, reg) {
  const replacement = [
    START_MARKER,
    headerRow,
    separatorRow,
    ...dataRows,
    END_MARKER
  ].join('\n')

  return content.replace(reg, replacement)
}

function upsertDataRow(dataRows, row, issueUrl) {
  const key = mdLink('更新', issueUrl)
  const index = dataRows.findIndex(line => line.includes(key))

  if (index >= 0) {
    dataRows[index] = row
  } else {
    dataRows.push(row)
  }

  return dataRows
}

function renumberDataRows(dataRows) {
  const sortedRows = [...dataRows].sort(
    (a, b) => extractIssueNumberFromRow(a) - extractIssueNumberFromRow(b)
  )

  return sortedRows.map((row, index) => {
    return row.replace(/^\|\s*#?\d+\s*\|/, `| ${index + 1} |`)
  })
}

function processRegistration(issueBody, context) {
  let content = readContributing()

  content = ensureMarkers(content, SECTION_TITLE, START_MARKER, END_MARKER)

  const name = findFieldValue(issueBody, 'Name')
  const introduction = findFieldValue(issueBody, 'Introduction')
  const contactMethod = findFieldValue(issueBody, 'ContactMethod')
  const wantsTeam = findFieldValue(issueBody, 'WantsTeam')
  const comment = findFieldValue(issueBody, 'Comment')

  const row = `| 0 | ${name} | ${introduction} | ${contactMethod} | ${wantsTeam} | ${comment} | ${mdLink('更新', context.issueUrl)} |`

  const { reg, headerRow, separatorRow, dataRows } = splitTableBlock(content)

  const mergedRows = upsertDataRow(dataRows, row, context.issueUrl)
  const renumberedRows = renumberDataRows(mergedRows)

  content = rebuildTableBlock(
    content,
    headerRow,
    separatorRow,
    renumberedRows,
    reg
  )

  writeContributing(content)
}

module.exports = {
  processRegistration
}
