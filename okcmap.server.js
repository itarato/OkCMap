console.log('Server init');

var http = require('http');
var url = require('url');
var okcMapStorage = require('./okcmap.storage');
var server = http.createServer(onServerCreated);
var collection = null;

server.listen(8888, 'localhost');

okcMapStorage.openCollection(function(_collection) {
  collection = _collection;
  console.log('Db is ready to use');
});

function onServerCreated(request, response) {
  console.log('Request in');

  var parsed_url = url.parse(request.url, true);
  if (!parsed_url.query.hasOwnProperty('username')) {
    return;
  }
  collection.findOne({username: parsed_url.query.username}, function(err, item) {
    if (!item) {
      collection.insert(parsed_url.query);
    }
  });

  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Request has been processed' + "\n");
}
