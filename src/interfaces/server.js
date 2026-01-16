const express = require('express');
const http = require('http');
const { scopePerRequest } = require('awilix-express');
const db = require('../infra/database/index')
const app = express()

class Server {
    constructor({ config, router, container }) {
        this.config = config;
        this.express = express();
        this.express.use(scopePerRequest(container));
        this.express.use(router);
        db.sequelize.sync().then(() => {
          console.log("db has been re sync")
        });
        app.use(function (req, res, next) {
          // Website you wish to allow to connect
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With, x-access-token, Origin, Content-Type, Accept"
          );
          // Set to true if you need the website to include cookies in the requests sent
          // to the API (e.g. in case you use sessions)
          res.setHeader('Access-Control-Allow-Credentials', true);
          next();
        });
        app.on('close', function(){
          db.sequelize.close();
        })
    }

    start() {
       return new Promise(resolve => {
            const server = http.createServer(this.express)
                .listen(process.env.PORT, () => {
                    const { port } = server.address();
                    console.log(`[p ${process.pid}] Listening at port ${port}`);
                    resolve();
                });
        });
    }
}

module.exports = Server;