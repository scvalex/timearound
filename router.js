"use strict";

function route(handlers, pathname, request, response) {
  // Strip the trailing slash
  if (pathname.length > 1 && pathname.charAt(pathname.length - 1) === "/") {
    pathname = pathname.substr(0, pathname.length - 1);
  }

  // Route the request
  if (typeof handlers[pathname] === 'function') {
    response.writeHead(200, {"Content-Type": "text/plain"});
    handlers[pathname](request, response);
  } else {
    console.log("No handler found for '" + pathname + "'");

    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("Not Found");
  }
}

exports.route = route;
