module.exports = ({ retrieveProductByIdService }) => ({
    execute: async (register_id) => {
        return await retrieveProductByIdService.execute(register_id);
    }
});