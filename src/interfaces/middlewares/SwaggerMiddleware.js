const SwaggerUi = require('swagger-ui-express');
const { generateSwagger } = require('../../infra/suppport/SwaggerDocGenerator')

module.exports = ({ studentRoutes, productRoutes, reportRoutes }) => {
    const routes = [].concat(studentRoutes, productRoutes, reportRoutes);

    const options = {
        title: 'GEABEG Backend',
        version: 'v1',
        description: 'Swagger for GEABEG Backend Project'
    };

    const swaggerDoc = generateSwagger(routes, options);

    return [SwaggerUi.serve, SwaggerUi.setup(swaggerDoc)];
};
