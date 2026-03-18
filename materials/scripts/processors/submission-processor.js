const path = require('path');
const FileManager = require('../utils/file-manager');
<<<<<<< HEAD
const { parseIssueFields, parseFieldFromContent } = require('../utils/field-parser');
const UserManager = require('../services/user-manager');
const ReadmeManager = require('../services/readme-manager');
const GitManager = require('../utils/git-manager');
const { DIRECTORIES, FILE_NAMES, FIELD_NAMES, STATUS_INDICATORS } = require('../config/constants');

/**
 * 项目提交处理器
=======
const { parseFieldFromContent } = require('../utils/parser-manager');
const UserManager = require('../utils/user-manager');
const ReadmeManager = require('../utils/readme-manager');
const FieldValidator = require('../utils/field-validator');
const { DIRECTORIES, FILE_NAMES, FIELD_NAMES } = require('../config/constants');

/**
>>>>>>> temple/main
 * Submission processor
 */
class SubmissionProcessor {
    /**
<<<<<<< HEAD
     * 处理项目提交
     * @param {string} issueBody - Issue 内容
     * @param {string} githubUser - GitHub 用户名
     */
    static processSubmission(issueBody, githubUser) {
        console.log('开始处理项目提交...');

        // 验证用户是否已注册
        const displayName = UserManager.getUserDisplayName(githubUser);

        // 解析字段
        const fields = parseIssueFields(issueBody);
        const submissionData = this.extractSubmissionData(fields, displayName);

        // 验证必填字段
        this.validateSubmissionData(submissionData);

        // 创建项目文件
        this.createSubmissionFile(githubUser, submissionData);

        // 更新提交表格
        this.updateSubmissionTable();

        // 提交到 Git
        const submissionFile = this.getSubmissionFilePath(githubUser);
        const readmePath = ReadmeManager.getReadmePath();
        GitManager.commitWorkflow(
            `Add submission for ${githubUser}@${submissionData.projectName}`,
            submissionFile,
            readmePath
        );

        console.log('项目提交处理完成');
    }

    /**
     * 从解析的字段中提取提交数据
     * @param {Object} fields - 解析的字段
     * @param {string} displayName - 用户显示名称
     * @returns {Object} 提交数据
     */
    static extractSubmissionData(fields, displayName) {
        return {
            projectName: fields[FIELD_NAMES.SUBMISSION.PROJECT_NAME] || '',
            projectDescription: fields[FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION] || '',
            projectMembers: fields[FIELD_NAMES.SUBMISSION.PROJECT_MEMBERS] || displayName,
            walletAddress: fields[FIELD_NAMES.SUBMISSION.WALLET_ADDRESS] || ''
        };
    }

    /**
     * 验证提交数据
     * @param {Object} submissionData - 提交数据
     */
    static validateSubmissionData(submissionData) {
        const { projectName, walletAddress, projectMembers } = submissionData;

        if (!projectName || !walletAddress || !projectMembers) {
            console.error('项目提交字段不全，缺少必填信息');
            process.exit(1);
        }
    }

    /**
     * 获取提交文件路径
     * @param {string} githubUser - GitHub 用户名
     * @returns {string} 提交文件路径
     */
    static getSubmissionFilePath(githubUser) {
        const submissionDir = path.join(__dirname, DIRECTORIES.SUBMISSION, githubUser);
        return path.join(submissionDir, FILE_NAMES.HACKATHON_INFO);
    }

    /**
     * 创建提交文件
     * @param {string} githubUser - GitHub 用户名
     * @param {Object} submissionData - 提交数据
     */
    static createSubmissionFile(githubUser, submissionData) {
        const submissionDir = path.join(__dirname, DIRECTORIES.SUBMISSION, githubUser);
        FileManager.ensureDirectoryExists(submissionDir);

        const content = this.generateSubmissionFileContent(githubUser, submissionData);
        const filePath = this.getSubmissionFilePath(githubUser);

        FileManager.writeFileContent(filePath, content);
        console.log(`项目信息已写入: ${filePath}`);
    }

    /**
     * 生成提交文件内容
     * @param {string} githubUser - GitHub 用户名
     * @param {Object} submissionData - 提交数据
     * @returns {string} 文件内容
     */
    static generateSubmissionFileContent(githubUser, submissionData) {
        const displayName = UserManager.getUserDisplayName(githubUser);
        const { projectName, projectDescription, projectMembers, walletAddress } = submissionData;

        return `# ${projectName}

**${FIELD_NAMES.SUBMISSION.NAME}**: ${displayName}  
**${FIELD_NAMES.SUBMISSION.GITHUB_USER}**: ${githubUser}  
**${FIELD_NAMES.SUBMISSION.PROJECT_NAME}**: ${projectName}  
**${FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION}**: ${projectDescription}  
**${FIELD_NAMES.SUBMISSION.PROJECT_MEMBERS}**: ${projectMembers}  
**${FIELD_NAMES.SUBMISSION.WALLET_ADDRESS}**: ${walletAddress}`;
    }

    /**
     * 更新提交表格
     */
    static updateSubmissionTable() {
        const submissionRoot = path.join(__dirname, DIRECTORIES.SUBMISSION);
        const userFolders = FileManager.getSubDirectories(submissionRoot);

        const rows = userFolders.map(folder => {
            const submissionFile = path.join(submissionRoot, folder, FILE_NAMES.HACKATHON_INFO);
=======
     * Process project submission
     * @param {string} issueBody - Issue content
     * @param {string} githubUser - GitHub username
     */
    static processSubmission(issueBody, githubUser) {
        console.log('Starting project submission processing...');

        // Check if user is registered
        FieldValidator.checkUserRegistration(githubUser, UserManager, FileManager);

        // Validate required fields
        FieldValidator.validateRequiredFields(issueBody, 'SUBMISSION');

        // Save original issue content
        this.createSubmissionFile(issueBody, githubUser);

        // Update submission table
        this.updateSubmissionTable();

        console.log('Project submission processing completed');
    }


    /**
     * Get submission file path
     * @param {string} githubUser - GitHub username
     * @returns {string} Submission file path
     */
    static getSubmissionFilePath(githubUser) {
        const submissionDir = path.join(__dirname, DIRECTORIES.SUBMISSION);
        return path.join(submissionDir, `${githubUser}.md`);
    }

    /**
     * Create submission file
     * @param {string} originalIssueBody - Original issue content
     * @param {string} githubUser - GitHub username
     */
    static createSubmissionFile(originalIssueBody, githubUser) {
        // Create submission file using GitHub username as filename
        const filePath = this.getSubmissionFilePath(githubUser);
        FileManager.saveFile(filePath, originalIssueBody, 'Project submission information written');
    }

    /**
     * Update submission table
     */
    static updateSubmissionTable() {
        const submissionRoot = path.join(__dirname, DIRECTORIES.SUBMISSION);
        const submissionFiles = FileManager.getDirectoryFiles(submissionRoot, '.md');

        const rows = submissionFiles.map(file => {
            const submissionFile = path.join(submissionRoot, file);
>>>>>>> temple/main
            const content = FileManager.readFileContent(submissionFile);

            if (!content) return null;

<<<<<<< HEAD
            const displayName = UserManager.getUserDisplayName(folder);

            return {
                folder: folder,
                name: displayName,
                projectName: parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_NAME),
                projectDescription: parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION),
                projectMembers: parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_MEMBERS),
                walletAddress: parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.WALLET_ADDRESS)
            };
        }).filter(Boolean);

        // 按项目名称首字母升序排序
=======
            // Get GitHub username from filename (remove .md extension)
            const githubUser = file.replace('.md', '');

            // Try to parse fields, skip if parsing fails
            try {
                const projectName = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_NAME);
                const projectDescription = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION);
                const projectMembers = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_MEMBERS);
                const projectLeader = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.PROJECT_LEADER);
                const repositoryUrl = parseFieldFromContent(content, FIELD_NAMES.SUBMISSION.REPOSITORY_URL);

                // Skip this file if parsing fails or key fields are empty
                if (!projectName || !projectDescription || !projectLeader) {
                    console.log(`Skipping file ${file}: parsing failed or missing key fields`);
                    return null;
                }

                return {
                    fileName: file,
                    githubUser: githubUser,
                    projectName: projectName,
                    projectDescription,
                    projectMembers,
                    projectLeader,
                    repositoryUrl
                };
            } catch (error) {
                console.log(`Skipping file ${file}: parsing failed - ${error.message}`);
                return null;
            }
        }).filter(Boolean);

        // Sort by project name alphabetically
>>>>>>> temple/main
        rows.sort((a, b) => {
            const nameA = (a.projectName || '').toLowerCase();
            const nameB = (b.projectName || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

<<<<<<< HEAD
        const tableContent = this.generateSubmissionTable(rows, submissionRoot);
        ReadmeManager.updateReadmeSection('SUBMISSION', tableContent);
    }

    /**
     * 生成提交表格内容
     * @param {Array} rows - 提交数据行
     * @param {string} submissionRoot - 提交根目录
     * @returns {string} 表格内容
     */
    static generateSubmissionTable(rows, submissionRoot) {
        let table = '| Project | Description | Members | Submitted | Operate |\n| ----------- | ----------------- | -------------- | ------ | -------- |\n';

        rows.forEach(row => {
            // 检查项目是否已提交文件
            const submissionDir = path.join(submissionRoot, row.folder);
            const files = FileManager.getDirectoryFiles(submissionDir)
                .filter(file => file !== '.DS_Store' && file !== FILE_NAMES.HACKATHON_INFO);

            const submitted = files.length > 0 ? STATUS_INDICATORS.SUBMITTED : STATUS_INDICATORS.NOT_SUBMITTED;

            // 生成操作链接
            const issueTitle = `Submission - ${row.projectName}`;
            const issueBody = `${FIELD_NAMES.SUBMISSION.PROJECT_NAME}:${row.projectName}\n${FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION}:${row.projectDescription}\n${FIELD_NAMES.SUBMISSION.PROJECT_MEMBERS}:${row.projectMembers}\n${FIELD_NAMES.SUBMISSION.WALLET_ADDRESS}:${row.walletAddress}`;
            const issueUrl = ReadmeManager.generateIssueUrl(issueTitle, issueBody);
            const folderUrl = ReadmeManager.generateFolderUrl(`submission/${row.folder}`);

            table += `| ${row.projectName} | ${row.projectDescription} | ${row.projectMembers} | ${submitted} | [Edit](${issueUrl}) &#124; [Folder](${folderUrl}) |\n`;
        });

        return table;
=======
        // Generate table content directly
        let table = '| Project | Description | Members | Leader | Repository | Operate |\n| ----------- | ----------------- | -------------- | ------- | ---------- | -------- |\n';

        rows.forEach((row) => {
            const issueTitle = `Submission - ${row.projectName}`;

            // Read MD file content directly as body for edit link
            const filePath = path.join(submissionRoot, row.fileName);
            const issueBody = FileManager.readFileContent(filePath);

            const issueUrl = ReadmeManager.generateIssueUrl(issueTitle, issueBody);

            // Generate repository link: show 🔗 if exists, ❌ if not
            const repoLink = row.repositoryUrl && row.repositoryUrl.trim() !== '' ? `[🔗](${row.repositoryUrl})` : '❌';

            table += `| ${row.projectName} | ${row.projectDescription} | ${row.projectMembers} | ${row.projectLeader} | ${repoLink} | [Edit](${issueUrl}) |\n`;
        });

        ReadmeManager.updateReadmeSection('SUBMISSION', table);
>>>>>>> temple/main
    }
}

module.exports = SubmissionProcessor;