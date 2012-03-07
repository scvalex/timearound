"use strict";

var http = require("http");
var listenPort = 8888;

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello, World");
  response.end();
}).listen(listenPort);

console.log("Server started on ", listenPort);
