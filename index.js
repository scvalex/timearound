#!/usr/bin/node

"use strict";

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handlers = {
  "/": requestHandlers.start,
  "/start": requestHandlers.start,
  "/upload": requestHandlers.upload
};

server.start(8888, function(filepath, response) {
  router.route(handlers, filepath, response)
});
