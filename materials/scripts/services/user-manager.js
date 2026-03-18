const path = require('path');
const FileManager = require('../utils/file-manager');
const { parseFieldFromContent } = require('../utils/field-parser');
const { DIRECTORIES, FIELD_NAMES } = require('../config/constants');

/**
 * 用户管理类
 * User management utilities
 */
class UserManager {
    /**
     * 获取用户注册信息文件路径
     * @param {string} githubUser - GitHub 用户名
     * @returns {string} 注册文件路径
     */
    static getRegistrationFilePath(githubUser) {
        const registrationDir = path.join(__dirname, DIRECTORIES.REGISTRATION);
        return path.join(registrationDir, `${githubUser}.md`);
    }

    /**
     * 验证用户是否已注册
     * @param {string} githubUser - GitHub 用户名
     * @returns {boolean} 是否已注册
     */
    static isUserRegistered(githubUser) {
        const registrationFile = this.getRegistrationFilePath(githubUser);
        return FileManager.readFileContent(registrationFile) !== '';
    }

    /**
     * 获取用户显示名称
     * @param {string} githubUser - GitHub 用户名
     * @returns {string} 用户显示名称
     */
    static getUserDisplayName(githubUser) {
        if (!this.isUserRegistered(githubUser)) {
            console.error(`用户 ${githubUser} 未在 registration 中完成注册，请先完成报名`);
            process.exit(1);
        }

        const registrationFile = this.getRegistrationFilePath(githubUser);
        const content = FileManager.readFileContent(registrationFile);
        const displayName = parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.NAME);
        
        return displayName || githubUser;
    }

    /**
     * 获取用户注册信息
     * @param {string} githubUser - GitHub 用户名
     * @returns {Object} 注册信息对象
     */
    static getUserRegistrationInfo(githubUser) {
        const registrationFile = this.getRegistrationFilePath(githubUser);
        const content = FileManager.readFileContent(registrationFile);

        if (!content) {
            return null;
        }

        return {
            name: parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.NAME),
            description: parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.DESCRIPTION),
            contactMethod: parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.CONTACT_METHOD),
            contact: parseFieldFromContent(content, FIELD_NAMES.REGISTRATION.CONTACT)
        };
    }
}

module.exports = UserManager;