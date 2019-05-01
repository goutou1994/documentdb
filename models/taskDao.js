var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');

function TaskDao(documentDBClient, databaseId, collectionId) {
    this.client = documentDBClient;
    this.databaseId = databaseId;
    this.collectionId = collectionId;

    this.database = null;
    this.collection = null;
}

module.exports = TaskDao;

TaskDao.prototype = {
    init: function () {
        var self = this;
        return new Promise((resolve, reject) => {
            docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
                if (err) {
                    reject(err);
                } else {
                    self.database = db;
                    docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                        if (err) {
                            reject(err);
                        } else {
                            self.collection = coll;
                            resolve();
                        }
                    });
                }
            });
        });
    },

    query: function ({sql, partitionKey, enableCrossPartitionQuery}) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.client.queryDocuments(
                self.collection._self,
                sql,
                {
                    partitionKey: partitionKey && partitionKey.length > 0 ? partitionKey : undefined,
                    enableCrossPartitionQuery
                }
            ).toArray(function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};