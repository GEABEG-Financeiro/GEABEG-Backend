const AsyncMiddleware = require('../../middlewares/AsyncMiddleware');

module.exports = () => ({

    createProduct: AsyncMiddleware(async (ctx) => {
        const { createProductOperation, httpConstants } = ctx.container.cradle;

        const { body: transactionData } = ctx;

        const productSingup = await createProductOperation.execute(transactionData);

        return ctx.res.status(httpConstants.CREATED).json(productSingup);
    }),

    retrieveProduct: AsyncMiddleware(async (ctx) => {
        const { retrieveProductOperation, httpConstants } = ctx.container.cradle;

        const productRetrieved = await retrieveProductOperation.execute(ctx.query);

        return ctx.res.status(httpConstants.OK).json(productRetrieved);
    }),

    retrieveProductById: AsyncMiddleware(async (ctx) => {
        const { retrieveProductByIdOperation, httpConstants } = ctx.container.cradle;
        const { product_id } = ctx.params;

        const productRetrieved = await retrieveProductByIdOperation.execute(product_id);

        return ctx.res.status(httpConstants.OK).json(productRetrieved);
    }),

    updateProduct: AsyncMiddleware(async (ctx) => {
        const { updateProductOperation, httpConstants } = ctx.container.cradle;
        const { product_id } = ctx.headers;
        const { body: transactionData } = ctx;

        const productRetrieved = await updateProductOperation.execute(transactionData, product_id);

        return ctx.res.status(httpConstants.OK).json(productRetrieved);
    }),

    
    addPaymentList: AsyncMiddleware(async (ctx) => {
        const { addPaymentListOperation, httpConstants } = ctx.container.cradle;
        const { product_id } = ctx.params;
        const { body: transactionData } = ctx;

        const productRetrieved = await addPaymentListOperation.execute(transactionData, product_id);

        return ctx.res.status(httpConstants.OK).json(productRetrieved);
    }),


    deleteProduct: AsyncMiddleware(async (ctx) => {
        const { deleteProductOperation, httpConstants } = ctx.container.cradle;
        const { product_id } = ctx.headers;

        await deleteProductOperation.execute(product_id);

        return ctx.res.status(httpConstants.OK).json({});
    })
});
