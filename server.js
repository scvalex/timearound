"use strict";

function start(listenPort, route) {
  var http = require("http");
  var url = require("url");

  http.createServer(function(request, response) {
    route(url.parse(request.url).pathname, response);
  }).listen(listenPort);

  console.log("Server started on", listenPort);
}

exports.start = start;
