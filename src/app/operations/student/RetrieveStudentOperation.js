module.exports = ({ retrieveStudentService }) => ({
    execute: async (query) => {
        return await retrieveStudentService.execute(query);
    }
});