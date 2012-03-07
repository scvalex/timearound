#!/usr/bin/node

"use strict";

var server = require("./server");
var router = require("./router");

server.start(8888, router.route);
