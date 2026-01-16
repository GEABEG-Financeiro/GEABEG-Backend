module.exports = ({ deleteStudentService }) => ({
    execute: async (student_id) => {
        return await deleteStudentService.execute(student_id);
    }
});