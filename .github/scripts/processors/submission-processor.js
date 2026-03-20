const {
  readContributing,
  writeContributing,
  findFieldValue,
  ensureMarkers,
  upsertRow,
  mdLink,
} = require('./shared');

const SECTION_TITLE = '## 05 | 项目提交名单（Submission List）';
const START_MARKER = '<!-- submission-list:start -->';
const END_MARKER = '<!-- submission-list:end -->';

function processSubmission(issueBody, context) {
  let content = readContributing();

  content = ensureMarkers(content, SECTION_TITLE, START_MARKER, END_MARKER);

  const projectName = findFieldValue(issueBody, 'ProjectName');
  const projectDescription = findFieldValue(issueBody, 'ProjectDescription');
  const repoLink = findFieldValue(issueBody, 'Github Repo Link');
  const teamLead = findFieldValue(issueBody, 'Team Lead');

  const repoCell =
    repoLink !== '-' && /^https?:\/\//i.test(repoLink)
      ? mdLink('Repo', repoLink)
      : repoLink;

  const actionCell = mdLink(`查看 / 更新 #${context.issueNumber}`, context.issueUrl);

  const row = `| ${projectName} | ${projectDescription} | ${teamLead} | ${repoCell} | ${actionCell} |`;

  content = upsertRow(
    content,
    START_MARKER,
    END_MARKER,
    `更新 #${context.issueNumber}](`,
    row
  );

  writeContributing(content);
}

module.exports = {
  processSubmission,
};
