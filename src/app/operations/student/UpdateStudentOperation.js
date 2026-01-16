module.exports = ({ updateStudentService }) => ({
    execute: async (body, student_id) => {
        return await updateStudentService.execute(body, student_id);
    }
});