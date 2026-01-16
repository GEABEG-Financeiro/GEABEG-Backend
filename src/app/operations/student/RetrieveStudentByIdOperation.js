module.exports = ({ retrieveStudentByIdService }) => ({
    execute: async (student_id) => {
        return await retrieveStudentByIdService.execute(student_id);
    }
});