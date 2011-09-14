/*
 * service.js: Defines the web service for the Delay Queue module.
 *
 * (C) 2011 Guidance Solutions, Inc.
 *
 */
var http = require('http'),
    journey = require('journey'),
    winston = require('winston');

/**
 * Creates the RESTful router for the delay queue web service
 */
exports.createRouter = function (queue) {
  winston.debug("Instantiating Router");
  var router = new (journey.Router)({
    strict: false,
    strictUrls: false,
    api: 'basic'
  });

  router.path(/\/items/, function () {

    // LIST: GET to /items lists all queue items
    this.get().bind(function (res) {
      res.send(501, {}, { action: 'list' });
    });

    // SHOW: GET to /items/:id shows the details of a specific queue item
    this.get(/\/([\w|\d|\-|\_]+)/).bind(function (res, id) {
      res.send(501, {}, { action: 'show' });
    });

    // CREATE: POST to /items creates a new queue item.
    this.post().bind(function (res, item) {
      winston.debug(item);
      winston.debug("queue property: ", queue.dequeued);
      queue.create({}, function(respCode, envelope){
        winston.debug("Item enqueued", {respCode: respCode, envelope: envelope});
      });
      /*var id = setTimeout(function(){
        http.createClient(8008, '127.0.0.1')
          .request('GET', '/created/item/id/')
          .end();
      }, 5000);*/
      res.send(200, {}, { action: 'create' });
    });

    // UPDATE: PUT to /items updates an existing queue item.
    this.put(/\/([\w|\d|\-|\_]+)/).bind(function (res, item) {
      res.send(501, {}, { action: 'update' });
    });

    // DELETE: DELETE to /items/:id deletes a specific queue item.
    this.del(/\/([\w|\d|\-|\_]+)/).bind(function (res, id) {
      res.send(501, {}, { action: 'delete' });
    });
  });

  return router;
};