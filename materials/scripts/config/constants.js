/**
<<<<<<< HEAD
 * 配置常量
 * Configuration constants
 */

// 目录路径配置
=======
 * Configuration constants
 */

// Directory path configuration
>>>>>>> temple/main
const DIRECTORIES = {
    REGISTRATION: '../../../registration',
    SUBMISSION: '../../../submission',
    SCRIPTS: __dirname
};

<<<<<<< HEAD
// 文件名配置
const FILE_NAMES = {
    README: '../../README.md',
    HACKATHON_INFO: 'HACKATHON.md'
};

// 字段名配置
const FIELD_NAMES = {
    // 注册字段
    REGISTRATION: {
        NAME: 'Name[姓名]',
        DESCRIPTION: 'Description[个人介绍]',
        CONTACT_METHOD: 'ContactMethod[联系方式]',
        CONTACT: 'Contact[联系账号]'
    },
    // 项目提交字段
    SUBMISSION: {
        NAME: 'Name[姓名]',
        PROJECT_NAME: 'ProjectName[项目名称]',
        GITHUB_USER: 'GithubUser[Github用户名]',
        PROJECT_DESCRIPTION: 'ProjectDescription[项目描述]',
        PROJECT_MEMBERS: 'ProjectMembers[项目成员]',
        WALLET_ADDRESS: 'WalletAddress[钱包地址]'
    }
};

// Git 相关配置
const GIT_CONFIG = {
    USER_EMAIL: 'action@github.com',
    USER_NAME: 'GitHub Action'
};

// GitHub 相关配置
const GITHUB_CONFIG = {
    REPO_URL: 'https://github.com/CasualHackathon/Template', // TODO: 替换为实际仓库地址
=======
// File name configuration
const FILE_NAMES = {
    README: '../../README.md'
};

// Field name configuration
const FIELD_NAMES = {
    // Registration fields
    REGISTRATION: {
        NAME: 'Name',
        DESCRIPTION: 'Description',
        CONTACT: 'Contact',
        WALLET_ADDRESS: 'Wallet Address',
        TEAM_WILLINGNESS: 'Team Willingness'
    },
    // Project submission fields
    SUBMISSION: {
        PROJECT_NAME: 'Project Name',
        PROJECT_DESCRIPTION: 'Project Description',
        PROJECT_MEMBERS: 'Project Members',
        PROJECT_LEADER: 'Project Leader',
        REPOSITORY_URL: 'Repository URL'
    }
};

// Required fields configuration
const REQUIRED_FIELDS = {
    REGISTRATION: [
        FIELD_NAMES.REGISTRATION.NAME,
        FIELD_NAMES.REGISTRATION.DESCRIPTION,
        FIELD_NAMES.REGISTRATION.CONTACT
    ],
    SUBMISSION: [
        FIELD_NAMES.SUBMISSION.PROJECT_NAME,
        FIELD_NAMES.SUBMISSION.PROJECT_DESCRIPTION,
        FIELD_NAMES.SUBMISSION.PROJECT_LEADER
    ]
};


// GitHub related configuration
const GITHUB_CONFIG = {
    REPO_URL: 'https://github.com/CasualHackathon/Template', // TODO: Replace with actual repository URL
>>>>>>> temple/main
    ISSUE_TITLE_PREFIXES: {
        REGISTRATION: 'Registration',
        SUBMISSION: 'Submission'
    }
};

<<<<<<< HEAD
// README 更新标记
const README_MARKERS = {
    REGISTRATION: {
        START: '<!-- Registration star -->',
=======
// README update markers
const README_MARKERS = {
    REGISTRATION: {
        START: '<!-- Registration start -->',
>>>>>>> temple/main
        END: '<!-- Registration end -->'
    },
    SUBMISSION: {
        START: '<!-- Submission start -->',
        END: '<!-- Submission end -->'
    }
};

<<<<<<< HEAD
// 状态指示符
const STATUS_INDICATORS = {
    NOT_SUBMITTED: '⚪',
    SUBMITTED: '🟢'
};
=======
>>>>>>> temple/main

module.exports = {
    DIRECTORIES,
    FILE_NAMES,
    FIELD_NAMES,
<<<<<<< HEAD
    GIT_CONFIG,
    GITHUB_CONFIG,
    README_MARKERS,
    STATUS_INDICATORS
=======
    REQUIRED_FIELDS,
    GITHUB_CONFIG,
    README_MARKERS
>>>>>>> temple/main
};