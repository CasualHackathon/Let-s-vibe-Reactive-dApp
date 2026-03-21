const {
  readContributing,
  writeContributing,
  findFieldValue,
  mdLink
} = require('./shared')

const SECTION_TITLE = '## **04 | 报名列表（Registration List）**'
const NEXT_SECTION_TITLE = '## **05 | 项目提交名单（Submission List）**'

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractIssueNumberFromUrl(url) {
  const match = String(url).match(/\/issues\/(\d+)$/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function extractIssueNumberFromRow(row) {
  const match = String(row).match(/\[更新\]\((https:\/\/github\.com\/[^)]+\/issues\/(\d+))\)/)
  return match ? Number(match[2]) : Number.MAX_SAFE_INTEGER
}

function normalize(text = '') {
  return String(text).replace(/\r\n/g, '\n')
}

function getSectionBounds(content) {
  const startIndex = content.indexOf(SECTION_TITLE)
  if (startIndex === -1) {
    throw new Error(`未找到章节标题: ${SECTION_TITLE}`)
  }

  const nextIndex = content.indexOf(NEXT_SECTION_TITLE, startIndex)
  if (nextIndex === -1) {
    throw new Error(`未找到下一章节标题: ${NEXT_SECTION_TITLE}`)
  }

  return { startIndex, nextIndex }
}

function extractExistingRows(sectionText) {
  const rowRegex = /\|\s*(?:#?\d+)\s*\|[\s\S]*?\[更新\]\(https:\/\/github\.com\/[^)]+\/issues\/\d+\)\s*\|/g
  const rows = sectionText.match(rowRegex) || []
  return rows.map(row => row.replace(/\s+/g, ' ').trim())
}

function upsertRow(rows, newRow, issueUrl) {
  const targetIssueNumber = extractIssueNumberFromUrl(issueUrl)

  const existingIndex = rows.findIndex(row => extractIssueNumberFromRow(row) === targetIssueNumber)

  if (existingIndex >= 0) {
    rows[existingIndex] = newRow
  } else {
    rows.push(newRow)
  }

  return rows
}

function renumberRows(rows) {
  const sorted = [...rows].sort((a, b) => extractIssueNumberFromRow(a) - extractIssueNumberFromRow(b))

  return sorted.map((row, index) => {
    return row.replace(/^\|\s*#?\d+\s*\|/, `| ${index + 1} |`)
  })
}

function buildSection(rows) {
  const lines = [
    SECTION_TITLE,
    '',
    '| 序号 | 姓名 | 个人介绍 | 联系方式 | 组队意愿 | 备注 | 更新资料 |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    ''
  ]

  return lines.join('\n')
}

function processRegistration(issueBody, context) {
  const content = normalize(readContributing())

  const { startIndex, nextIndex } = getSectionBounds(content)

  const before = content.slice(0, startIndex)
  const currentSection = content.slice(startIndex, nextIndex)
  const after = content.slice(nextIndex)

  const name = findFieldValue(issueBody, 'Name')
  const introduction = findFieldValue(issueBody, 'Introduction')
  const contactMethod = findFieldValue(issueBody, 'ContactMethod')
  const wantsTeam = findFieldValue(issueBody, 'WantsTeam')
  const comment = findFieldValue(issueBody, 'Comment')

  const newRow = `| 0 | ${name} | ${introduction} | ${contactMethod} | ${wantsTeam} | ${comment} | ${mdLink('更新', context.issueUrl)} |`

  const existingRows = extractExistingRows(currentSection)
  const mergedRows = upsertRow(existingRows, newRow, context.issueUrl)
  const finalRows = renumberRows(mergedRows)

  const rebuiltSection = buildSection(finalRows)
  const newContent = `${before}${rebuiltSection}${after}`

  writeContributing(newContent)
}

module.exports = {
  processRegistration
}
