const { Router } = require('express');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


module.exports = ({
    routerRegister,
    httpErrorMiddleware,
    productRoutes,
    studentRoutes,
    reportRoutes,
    swaggerMiddleware
}) => {
    const apiRouter = Router();

    apiRouter
        .use(cors())
        .use(bodyParser.json())
        .use(cookieParser())
        .use('/api/docs', swaggerMiddleware)
        .use('/api', routerRegister.register(productRoutes))
        .use('/api', routerRegister.register(studentRoutes))
        .use('/api', routerRegister.register(reportRoutes))
        .use(httpErrorMiddleware);

    return apiRouter;
};
