import os
import re
from pathlib import Path

CONTRIBUTING_PATH = Path("CONTRIBUTING.md")

REG_START = "<!-- registration-list:start -->"
REG_END = "<!-- registration-list:end -->"
SUB_START = "<!-- submission-list:start -->"
SUB_END = "<!-- submission-list:end -->"

ISSUE_NUMBER = os.environ.get("ISSUE_NUMBER", "").strip()
ISSUE_TITLE = os.environ.get("ISSUE_TITLE", "").strip()
ISSUE_BODY = os.environ.get("ISSUE_BODY", "")
ISSUE_URL = os.environ.get("ISSUE_URL", "").strip()
ISSUE_USER = os.environ.get("ISSUE_USER", "").strip()
ISSUE_LABELS = os.environ.get("ISSUE_LABELS", "").strip().lower()


def is_registration() -> bool:
    return "registration" in ISSUE_LABELS or ISSUE_TITLE.startswith("Registration:")


def is_submission() -> bool:
    return "submission" in ISSUE_LABELS or ISSUE_TITLE.startswith("Submission:")


def clean_quote_block(text: str) -> str:
    lines = []
    for line in text.splitlines():
        line = re.sub(r"^\s*>\s?", "", line).strip()
        if line:
            lines.append(line)
    value = "<br>".join(lines).strip()
    value = value.replace("|", r"\|")
    return value if value else "-"


def extract_field(field_name: str) -> str:
    pattern = rf"\*\*{re.escape(field_name)}\*\*[^\n]*\n((?:>.*(?:\n|$))+)"
    match = re.search(pattern, ISSUE_BODY, re.MULTILINE)
    if not match:
        return "-"
    return clean_quote_block(match.group(1))


def markdown_link(text: str, url: str) -> str:
    text = text.replace("|", r"\|")
    return f"[{text}]({url})" if url and url != "-" else text


def replace_between(content: str, start: str, end: str, key: str, new_row: str) -> str:
    pattern = re.compile(
        rf"({re.escape(start)}\n)(.*?)(\n{re.escape(end)})",
        re.DOTALL,
    )
    match = pattern.search(content)
    if not match:
        raise RuntimeError(f"找不到锚点: {start} / {end}")

    block = match.group(2)
    lines = [line for line in block.splitlines() if line.strip()]

    replaced = False
    updated_lines = []
    for line in lines:
        if key in line:
            updated_lines.append(new_row)
            replaced = True
        else:
            updated_lines.append(line)

    if not replaced:
        updated_lines.append(new_row)

    new_block = "\n".join(updated_lines)
    return content[: match.start(2)] + new_block + content[match.end(2) :]


def build_registration_row() -> str:
    name = extract_field("Name")
    intro = extract_field("Introduction")
    contact = extract_field("ContactMethod")
    wants_team = extract_field("WantsTeam")
    comment = extract_field("Comment")

    edit_link = markdown_link("更新", ISSUE_URL)
    return f"| {ISSUE_NUMBER} | {name} | {intro} | {contact} | {wants_team} | {comment} | {edit_link} |"


def build_submission_row() -> str:
    project_name = extract_field("ProjectName")
    project_desc = extract_field("ProjectDescription")
    repo_link_raw = extract_field("Github Repo Link")
    team_lead = extract_field("Team Lead")

    if repo_link_raw != "-" and repo_link_raw.startswith("http"):
        repo_cell = markdown_link("🔗", repo_link_raw)
    else:
        repo_cell = repo_link_raw

    action_cell = markdown_link(f"查看 / 更新 #{ISSUE_NUMBER}", ISSUE_URL)
    return f"| {project_name} | {project_desc} | {team_lead} | {repo_cell} | {action_cell} |"


def main():
    if not CONTRIBUTING_PATH.exists():
        raise FileNotFoundError("CONTRIBUTING.md 不存在")

    content = CONTRIBUTING_PATH.read_text(encoding="utf-8")

    if is_registration():
        row = build_registration_row()
        key = f"| {ISSUE_NUMBER} |"
        content = replace_between(content, REG_START, REG_END, key, row)

    if is_submission():
        row = build_submission_row()
        key = f"更新 #{ISSUE_NUMBER}]("
        content = replace_between(content, SUB_START, SUB_END, key, row)

    CONTRIBUTING_PATH.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()
