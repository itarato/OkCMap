console.log('Server init');

var http = require('http');
var url = require('url');
var okcMapStorage = require('./okcmap.storage');

var server = http.createServer(onServerCreated);
server.listen(8888, 'localhost');

function onServerCreated(request, response) {
  console.log('Request in');

  var parsed_url = url.parse(request.url, true);
  okcMapStorage.save(parsed_url.query);

  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Request has been processed' + "\n");
}
