var mongodb = require('mongodb');
var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : mongodb.Connection.DEFAULT_PORT;
var db_name = 'okcupid';
var collection_name = 'girl';
var db = new mongodb.Db(db_name, new mongodb.Server(host, port, {}), {native_parser: true});

console.log('Storage init');

exports.save = function(query) {
  db.open(function(err, db){
    onDBOpen(err, db, query);
  });
}

function onDBOpen(err, db, query) {
  db.collection(collection_name, function(err, collection){
    onCollection(err, collection, query);
  });
}

function onCollection(err, collection, query) {
  collection.insert(query);
  db.close();
}
