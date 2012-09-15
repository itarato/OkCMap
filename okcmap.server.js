console.log('Server init');

var http = require('http');
var url = require('url');
var okcMapStorage = require('./okcmap.storage');
var server = http.createServer(onRequestReceived);
var collection = null;

server.listen(8888, 'localhost');

okcMapStorage.openCollection(function(_collection) {
  collection = _collection;
  console.log('Db is ready to use');
});

function onRequestReceived(request, response) {
  console.log('Request in');

  var parsed_url = url.parse(request.url, true);

  if (true) {
    doMapDataResponse(response);
  }
  else {
    doDataSave(response, parsed_url);
  }
}

function doDataSave(response, parsed_url) {
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

function doMapDataResponse(response) {
  collection.find(function(err, cursor){
    cursor.each(function(err, item){
      if (item) {
        console.log(item);
      }
      else {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('hello');
      }
    });
  });
}
