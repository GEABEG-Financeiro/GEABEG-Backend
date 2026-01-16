module.exports = ({ container }) => {
    const {productController, productSchema } = container.cradle;

    return [
        {
            method: 'post',
            path: '/products',
            middlewares: [],
            tags: ['products'],
            validation: {
                body: productSchema.createProductBodySchema.body
            },
            handler: productController.createProduct
        },

        {
            method: 'patch',
            path: '/products/:product_id/payments/list',
            middlewares: [],
            tags: ['products'],
            validation: {
                body: productSchema.updateStudentPaymentList.body,
                params: productSchema.getProductByIdParamsSchema.params
            },
            handler: productController.addPaymentList
        },

        {
            method: 'put',
            path: '/products',
            tags: ['products'],
            validation: {
                body: productSchema.updateProductBodySchema.body,
                headers: productSchema.updateProductsHeaderSchema.headers
            },
            handler: productController.updateProduct
        },

        {
            method: 'delete',
            path: '/products',
            tags: ['products'],
            validation: {
                headers: productSchema.deleteProductHeadersSchema.headers
            },
            handler: productController.deleteProduct
        },

        {
            method: 'get',
            path: '/products',
            tags: ['products'],
            validation: {
                query: productSchema.getProductParamsSchema.params
            },
            handler: productController.retrieveProduct
        },

        {
            method: 'get',
            path: '/products/:product_id',
            tags: ['products'],
            validation: {
                params: productSchema.getProductByIdParamsSchema.params
            },
            handler: productController.retrieveProductById
        }
    ];
};
