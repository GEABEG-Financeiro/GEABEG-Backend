const { Router } = require('express');

module.exports = ({ validatorMiddleware }) => ({
    register: (routes) => {
        const router = Router();

        routes.forEach(route => {
            const { method, path, validation, handler } = route;

            const middlewares = [
                validatorMiddleware.validateContract(validation)
            ];
            
            router[method](path, ...middlewares, handler);
        });

        return router;
    }
});