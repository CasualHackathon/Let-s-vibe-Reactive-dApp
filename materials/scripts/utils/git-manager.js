const { execSync } = require('child_process');

/**
 * Git 操作工具类
 * Git operations utilities
 */
class GitManager {
    /**
     * 配置 Git 用户信息
     */
    static configureGitUser() {
        try {
            execSync('git config --local user.email "action@github.com"', { stdio: 'inherit' });
            execSync('git config --local user.name "GitHub Action"', { stdio: 'inherit' });
        } catch (error) {
            console.error('Git 用户配置失败:', error.message);
            throw error;
        }
    }

    /**
     * 添加文件到 Git 暂存区
     * @param {...string} filePaths - 文件路径
     */
    static addFiles(...filePaths) {
        try {
            const filePathsString = filePaths.join(' ');
            execSync(`git add ${filePathsString}`, { stdio: 'inherit' });
        } catch (error) {
            console.error('添加文件到暂存区失败:', error.message);
            throw error;
        }
    }

    /**
     * 检查是否有变更需要提交
     * @returns {boolean} 是否有变更
     */
    static hasChangesToCommit() {
        try {
            execSync('git diff --cached --quiet');
            return false; // 没有变更
        } catch {
            return true; // 有变更
        }
    }

    /**
     * 提交变更（带重试机制）
     * @param {string} message - 提交信息
     */
    static commitChanges(message) {
        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (!this.hasChangesToCommit()) {
                    console.log('没有需要提交的更改');
                    // 检查是否有未推送的提交
                    try {
                        const result = execSync('git log @{u}..HEAD --oneline', { encoding: 'utf8' });
                        if (result.trim()) {
                            console.log('发现未推送的提交，尝试推送...');
                            execSync('git push', { stdio: 'inherit' });
                            console.log('推送成功');
                            return;
                        }
                    } catch (checkError) {
                        console.log('检查未推送提交时出错:', checkError.message);
                    }
                    return;
                }

                console.log(`开始提交 (尝试 ${attempt}/${maxRetries})...`);

                // 正确转义提交信息
                const escapedMessage = message.replace(/["\\$`]/g, '\\$&');
                execSync(`git commit -m "${escapedMessage}"`, { stdio: 'inherit' });
                console.log('本地提交完成');

                // 尝试推送
                try {
                    execSync('git push', { stdio: 'inherit' });
                    console.log('推送成功');
                    return;
                } catch (pushError) {
                    console.log(`推送失败 (尝试 ${attempt}/${maxRetries}):`, pushError.message);

                    if (attempt < maxRetries) {
                        console.log('拉取远程更改并重试...');
                        try {
                            // 拉取并合并远程更改
                            execSync('git pull --no-rebase origin main', { stdio: 'inherit' });
                            console.log('远程更改已合并');

                            // 立即尝试推送合并后的结果
                            try {
                                execSync('git push', { stdio: 'inherit' });
                                console.log('合并后推送成功');
                                return;
                            } catch (mergedPushError) {
                                console.log('合并后推送失败，继续重试:', mergedPushError.message);
                                continue;
                            }
                        } catch (pullError) {
                            console.log('拉取失败:', pullError.message);
                            if (attempt === maxRetries) {
                                throw pushError;
                            }
                        }
                    } else {
                        throw pushError;
                    }
                }
            } catch (error) {
                console.error(`提交失败 (尝试 ${attempt}/${maxRetries}):`, error.message);

                if (attempt === maxRetries) {
                    // 最后一次尝试失败，输出详细错误信息
                    if (error.status) {
                        console.error('退出代码:', error.status);
                    }
                    if (error.stderr) {
                        console.error('错误输出:', error.stderr.toString());
                    }
                    throw error;
                }

                // 等待一段时间后重试
                console.log(`等待 ${attempt * 2} 秒后重试...`);
                const { setTimeout } = require('timers/promises');
                setTimeout(attempt * 2000);
            }
        }
    }

    /**
     * 完整的提交流程：配置用户 -> 添加文件 -> 提交
     * @param {string} commitMessage - 提交信息
     * @param {...string} filePaths - 文件路径
     */
    static commitWorkflow(commitMessage, ...filePaths) {
        this.configureGitUser();
        this.addFiles(...filePaths);
        this.commitChanges(commitMessage);
    }
}

module.exports = GitManager;