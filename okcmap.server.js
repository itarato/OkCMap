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

  switch (parsed_url.pathname) {
    case '/list':
      doMapDataResponse(response, parsed_url);
      break;
    case '/save':
      doDataSave(response, parsed_url);
      break
    case '/map':
      var fs = require('fs');
      var page = fs.readFileSync('./okcmap.map.html');
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(page);
      break;
    case '/update':
      doUpdate(response, parsed_url);
      break;
    default:
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('NodeJS server is working' + "\n");
      break;
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

function doMapDataResponse(response, parsed_url) {
  collection.find(function(err, cursor){
    response.writeHead(200, {'Content-Type': 'script/javascript'});
    var items = [];

    cursor.each(function(err, item){
      if (item) {
        items.push(item);
      }
      else {
        response.write(JSON.stringify(items));
        response.end();
      }
    });
  });
}

function doUpdate(response, parsed_url) {
  var item = collection.findOne({'username': parsed_url.query.username}, function(err, item) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    if (!item) {
      response.end('Item has not been found');
      return;
    }

    item.Xa = parsed_url.query.Xa;
    item.Ya = parsed_url.query.Ya;
    collection.save(item);

    response.end('Data has been updated: ' + item._id);
  });
}
