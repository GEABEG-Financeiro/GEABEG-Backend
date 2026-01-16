module.exports = ({ retrieveProductService }) => ({
    execute: async (query) => {
        return await retrieveProductService.execute(query);
    }
});