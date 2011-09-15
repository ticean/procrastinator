/*
 * procrastinator.js: Top-level include for the Procrastinator module.
 *
 * (C) 2011 Guidance Solutions
 *
 */
 
var http = require('http'),
    https = require('https'),
    fs = require('fs'),
    winston = require('winston'),
    service = require('./service'),
    delayqueue = require('./queue');

/**
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 */
exports.createServer = function (options) {
  var server,
      handler,
      queue = new delayqueue.Queue({});
      router = service.createRouter(queue);

  handler = function (request, response) {
    winston.info('Incoming Request', { url: request.url });
    var body = '';
    request.on('data', function (chunk) {
      body += chunk;
    });

    request.on('end', function () {
      router.handle(request, body, function (route) {
        response.writeHead(route.status, route.headers);
        response.end(route.body);
      });
    });
  };

  if(!options.secure) {
    winston.warn('Serving over non-secure HTTP connection.');
    server = http.createServer(handler);
  } else {
    winston.info('Serving over secure HTTPS connection.');
    options.cert = fs.readFileSync(options.cert);
    options.key = fs.readFileSync(options.key);
    server = https.createServer(options, handler);
  }

  server.listen(options.port, options.host);
  return server;
};

/**
 * Light-weight wrapped to 'createServer' method for future use
 */
exports.start = function (options, callback) {
  var server = exports.createServer(options);
  callback(null, server);
}