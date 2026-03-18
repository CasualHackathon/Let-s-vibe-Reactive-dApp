const fs = require('fs');
const path = require('path');

/**
<<<<<<< HEAD
 * 文件操作工具类
=======
>>>>>>> temple/main
 * File operations utilities
 */
class FileManager {
    /**
<<<<<<< HEAD
     * 确保目录存在，不存在则创建
     * @param {string} dirPath - 目录路径
=======
     * Ensure directory exists, create if not
     * @param {string} dirPath - Directory path
>>>>>>> temple/main
     */
    static ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
<<<<<<< HEAD
     * 安全读取文件内容
     * @param {string} filePath - 文件路径
     * @returns {string} 文件内容，文件不存在返回空字符串
=======
     * Safely read file content
     * @param {string} filePath - File path
     * @returns {string} File content, empty string if file does not exist
>>>>>>> temple/main
     */
    static readFileContent(filePath) {
        try {
            return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
        } catch (error) {
<<<<<<< HEAD
            console.error(`读取文件失败: ${filePath}`, error.message);
=======
            console.error(`Failed to read file: ${filePath}`, error.message);
>>>>>>> temple/main
            return '';
        }
    }

    /**
<<<<<<< HEAD
     * 安全写入文件内容
     * @param {string} filePath - 文件路径
     * @param {string} content - 文件内容
=======
     * Safely write file content
     * @param {string} filePath - File path
     * @param {string} content - File content
>>>>>>> temple/main
     */
    static writeFileContent(filePath, content) {
        try {
            fs.writeFileSync(filePath, content, 'utf8');
<<<<<<< HEAD
            console.log(`文件写入成功: ${filePath}`);
        } catch (error) {
            console.error(`文件写入失败: ${filePath}`, error.message);
=======
            console.log(`File written successfully: ${filePath}`);
        } catch (error) {
            console.error(`Failed to write file: ${filePath}`, error.message);
>>>>>>> temple/main
            throw error;
        }
    }

    /**
<<<<<<< HEAD
     * 获取目录下的所有文件
     * @param {string} dirPath - 目录路径
     * @param {string} extension - 文件扩展名过滤，如 '.md'
     * @returns {Array} 文件路径数组
=======
     * Get all files in directory
     * @param {string} dirPath - Directory path
     * @param {string} extension - File extension filter, e.g. '.md'
     * @returns {Array} Array of file paths
>>>>>>> temple/main
     */
    static getDirectoryFiles(dirPath, extension = '') {
        if (!fs.existsSync(dirPath)) {
            return [];
        }

        try {
            return fs.readdirSync(dirPath)
                .filter(file => !extension || file.endsWith(extension))
<<<<<<< HEAD
                .filter(file => file !== '.DS_Store'); // 过滤系统文件
        } catch (error) {
            console.error(`读取目录失败: ${dirPath}`, error.message);
=======
                .filter(file => file !== '.DS_Store'); // Filter system files
        } catch (error) {
            console.error(`Failed to read directory: ${dirPath}`, error.message);
>>>>>>> temple/main
            return [];
        }
    }

    /**
<<<<<<< HEAD
     * 获取目录下的所有子目录
     * @param {string} dirPath - 目录路径
     * @returns {Array} 子目录名称数组
=======
     * Get all subdirectories in directory
     * @param {string} dirPath - Directory path
     * @returns {Array} Array of subdirectory names
>>>>>>> temple/main
     */
    static getSubDirectories(dirPath) {
        if (!fs.existsSync(dirPath)) {
            return [];
        }

        try {
            return fs.readdirSync(dirPath)
                .filter(item => {
                    const itemPath = path.join(dirPath, item);
                    return fs.statSync(itemPath).isDirectory();
                });
        } catch (error) {
<<<<<<< HEAD
            console.error(`读取子目录失败: ${dirPath}`, error.message);
            return [];
        }
    }
=======
            console.error(`Failed to read subdirectories: ${dirPath}`, error.message);
            return [];
        }
    }

    /**
     * Generic file storage method - directly save content to file
     * @param {string} filePath - File path
     * @param {string} content - File content
     * @param {string} logMessage - Log message
     */
    static saveFile(filePath, content, logMessage = 'File saved') {
        try {
            // Ensure directory exists
            const dirPath = path.dirname(filePath);
            this.ensureDirectoryExists(dirPath);

            // Write file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`${logMessage}: ${filePath}`);
        } catch (error) {
            console.error(`Failed to save file: ${filePath}`, error.message);
            throw error;
        }
    }

    /**
     * Check if file exists
     * @param {string} filePath - File path
     * @returns {boolean} Whether file exists
     */
    static fileExists(filePath) {
        return fs.existsSync(filePath);
    }

    /**
     * Generic file update method - update or create file
     * @param {string} filePath - File path
     * @param {string} content - File content
     * @param {string} logMessage - Log message
     */
    static updateFile(filePath, content, logMessage = 'File updated') {
        this.saveFile(filePath, content, logMessage);
    }
>>>>>>> temple/main
}

module.exports = FileManager;