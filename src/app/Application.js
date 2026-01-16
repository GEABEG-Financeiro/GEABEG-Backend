const container = require('../container');
const db = require('../infra/database/index');

class Application {
    constructor() {
        this.container = null;
    }

    async loadSetup() {
        const config = require('dotenv').config();

        this.container = container.configureContainer(config);

        return this;
    }

    async start() {
        const { server } = this.container.cradle;

        await server.start();
    }
}

module.exports = Application;