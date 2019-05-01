const DocumentDBClient = require('documentdb').DocumentClient;
const config = require('./config.json');
const TaskDao = require('./models/taskDao');
const save = require('./src/saveFile');
const format = require('./src/format');

const docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
const taskDao = new TaskDao(docDbClient, config.databaseId, config.collectionId);

(async function() {
    try {
        await taskDao.init();
        let result = await taskDao.query(config);
        if (config.removeRedundancy) result = format(result);
        const files = await save(config, result);
        console.log(`json file saved to ${__dirname}/json/:`);
        console.log(files.join('  '));
    } catch(e) {
        console.error(e);
    }
})();