module.exports = ({ removeStudentProductService }) => ({
    execute: async (student_id, product_id) => {
        return await removeStudentProductService.execute(student_id, product_id);
    }
});