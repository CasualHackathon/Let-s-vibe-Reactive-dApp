/**
<<<<<<< HEAD
 * 提交状态表格更新脚本
 * Submission status table update script
 * 
 * 用于更新 README.md 中的项目提交状态表格
=======
 * Submission status table update script
 * 
 * Used to update project submission status table in README.md
>>>>>>> temple/main
 */

const SubmissionProcessor = require('./processors/submission-processor');

/**
<<<<<<< HEAD
 * 更新提交表格
 */
function updateSubmissionTable() {
    try {
        console.log('开始更新提交表格...');
        SubmissionProcessor.updateSubmissionTable();
        console.log('提交表格更新完成');
    } catch (error) {
        console.error('更新提交表格失败:', error.message);
=======
 * Update submission table
 */
function updateSubmissionTable() {
    try {
        console.log('Starting submission table update...');
        SubmissionProcessor.updateSubmissionTable();
        console.log('Submission table update completed');
    } catch (error) {
        console.error('Failed to update submission table:', error.message);
>>>>>>> temple/main
        throw error;
    }
}

<<<<<<< HEAD
// 如果作为主程序运行，直接执行更新
=======
// If run as main program, execute update directly
>>>>>>> temple/main
if (require.main === module) {
    updateSubmissionTable();
}

module.exports = { updateSubmissionTable };