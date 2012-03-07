"use strict";

function start(listenPort, route) {
  var http = require("http");
  var url = require("url");

  http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;

    route(pathname);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello, World");
    response.end();
  }).listen(listenPort);

  console.log("Server started on ", listenPort);
}

exports.start = start;
