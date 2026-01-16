const Application = require('../GEABEG-Backend/src/app/Application');
const app = new Application();

app
    .loadSetup()
    .then(() => app.start())
    .catch((error) => {
        console.error(error.stack);
        process.exit(1);
    });
    
