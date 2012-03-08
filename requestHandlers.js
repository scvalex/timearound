"use strict";

function start(request, response) {
  console.log("Request handler 'start' was called");

  var postData = "";

  request.setEncoding("utf8");
  request.addListener("data", function(postDataChunk) {
    postData += postDataChunk;
  });
  request.addListener("end", function() {
    response.write("Received:\n" + postData);
    response.end();
  });
}

function upload(request, response) {
  console.log("Request handler 'upload' was called");
  response.write("Hello, Upload");
  response.end();
}

exports.start = start;
exports.upload = upload;
