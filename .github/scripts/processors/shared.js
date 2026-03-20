const fs = require('fs');
const path = require('path');

const CONTRIBUTING_PATH = path.join(process.cwd(), 'CONTRIBUTING.md');

function normalize(text = '') {
  return String(text).replace(/\r\n/g, '\n');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanCell(value) {
  const text = String(value ?? '')
    .trim()
    .replace(/\r?\n/g, '<br>')
    .replace(/\|/g, '\\|');

  return text || '-';
}

function mdLink(text, url) {
  if (!url) return cleanCell(text);
  return `[${cleanCell(text)}](${url})`;
}

function readContributing() {
  return fs.readFileSync(CONTRIBUTING_PATH, 'utf8');
}

function writeContributing(content) {
  fs.writeFileSync(CONTRIBUTING_PATH, content, 'utf8');
}

function appendGithubOutput(key, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  if (String(value).includes('\n')) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `${key}<<EOF\n${value}\nEOF\n`
    );
  } else {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  }
}

function findFieldValue(issueBody, fieldName) {
  const lines = normalize(issueBody).split('\n');
  const fieldReg = new RegExp(
    `^${escapeRegExp(fieldName)}(?:\\s*\\([^\\n]*\\))?\\s*:?\s*$`
  );

  for (let i = 0; i < lines.length; i++) {
    const current = lines[i].trim();
    if (!fieldReg.test(current)) continue;

    const values = [];
    let seenQuote = false;

    for (let j = i + 1; j < lines.length; j++) {
      const line = lines[j];
      const trimmed = line.trim();

      if (!trimmed) {
        if (seenQuote) break;
        continue;
      }

      if (trimmed.startsWith('>')) {
        seenQuote = true;
        const value = trimmed.replace(/^>\s?/, '').trim();
        if (value) values.push(value);
        continue;
      }

      if (seenQuote) break;
    }

    return values.length ? cleanCell(values.join('<br>')) : '-';
  }

  return '-';
}

function ensureMarkers(content, sectionTitle, startMarker, endMarker) {
  if (content.includes(startMarker) && content.includes(endMarker)) {
    return content;
  }

  const lines = normalize(content).split('\n');
  const sectionIndex = lines.findIndex((line) => line.trim() === sectionTitle.trim());

  if (sectionIndex === -1) {
    throw new Error(`未找到章节标题: ${sectionTitle}`);
  }

  let separatorIndex = -1;
  for (let i = sectionIndex + 1; i < Math.min(lines.length, sectionIndex + 12); i++) {
    if (/^\|\s*---/.test(lines[i].trim())) {
      separatorIndex = i;
      break;
    }
  }

  if (separatorIndex === -1) {
    throw new Error(`未找到表格分隔行: ${sectionTitle}`);
  }

  lines.splice(separatorIndex + 1, 0, startMarker, endMarker);
  return lines.join('\n');
}

function upsertRow(content, startMarker, endMarker, key, row) {
  const reg = new RegExp(
    `${escapeRegExp(startMarker)}\\n([\\s\\S]*?)\\n${escapeRegExp(endMarker)}`
  );
  const match = content.match(reg);

  if (!match) {
    throw new Error(`未找到锚点: ${startMarker} / ${endMarker}`);
  }

  const rows = match[1]
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim());

  const index = rows.findIndex((line) => line.includes(key));

  if (index >= 0) {
    rows[index] = row;
  } else {
    rows.push(row);
  }

  const replacement = `${startMarker}\n${rows.join('\n')}\n${endMarker}`;
  return content.replace(reg, replacement);
}

module.exports = {
  readContributing,
  writeContributing,
  appendGithubOutput,
  findFieldValue,
  ensureMarkers,
  upsertRow,
  mdLink,
  cleanCell,
};
