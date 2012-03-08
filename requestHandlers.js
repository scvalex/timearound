"use strict";

function start(output) {
  console.log("Request handler 'start' was called");
  output("Hello, Start");
}

function upload(output) {
  console.log("Request handler 'upload' was called");
  output("Hello, Upload");
}

exports.start = start;
exports.upload = upload;
