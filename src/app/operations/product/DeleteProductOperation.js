module.exports = ({ deleteProductService }) => ({
    execute: async (register_id) => {
        return await deleteProductService.execute(register_id);
    }
});