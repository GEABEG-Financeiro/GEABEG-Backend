const {
    createContainer,
    asClass,
    asFunction,
    asValue,
    InjectionMode,
    Lifetime
} = require('awilix');

const Server = require('./interfaces/server');
const Router = require('./interfaces/Router');

const ErrorService = require('./domain/error/ErrorService');
const ValidatorMiddleware = require('./interfaces/middlewares/ValidatorMiddleware');
const httpErrorMiddleware = require('./interfaces/middlewares/HttpErrorMiddleware');
const { httpConstants } = require('./domain/enum/EnumHttpConstants');


const container = createContainer();

const configureContainer = config => {
    container
        .register({
            server: asClass(Server).singleton(),
            router: asFunction(Router),
            container: asValue(container),
            config: asValue(config),
            exception: asClass(ErrorService).singleton(),
            httpConstants: asValue(httpConstants),
            httpErrorMiddleware: asFunction(httpErrorMiddleware),
            validatorMiddleware: asFunction(ValidatorMiddleware),
        })
        .loadModules(
            [
                [
                    'src/infra/database/mongo/models/**/*.js',
                    {
                        lifetime: Lifetime.SINGLETON
                    }
                ],
                'src/infra/database/repository/**/*.js',
                'src/infra/database/models/**/*.js',
                'src/infra/database/repository/**/*.js',
                'src/infra/integration/**/*.js',
                'src/infra/logging/mapping/**/*.js',
                'src/infra/support/**/*.js',
                'src/app/operations/**/*.js',
                'src/app/services/**/*.js',
                'src/domain/error/**/*.js',
                'src/domain/enum/**/.js',
                'src/interfaces/amqp/**/*.js',
                'src/interfaces/errors/**/*.js',
                'src/interfaces/middlewares/**/*.js',
                'src/interfaces/presentation/**/*.js'
            ],
            {
                formatName: 'camelCase',
                resolverOptions: {
                    injectionMode: InjectionMode.PROXY
                }
            }
        );

    return container;
};


module.exports = { configureContainer, container };