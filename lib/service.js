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
  var router = new (journey.Router)({
    strict: false,
    strictUrls: false,
    api: 'basic'
  });

  router.path(/\/items/, function () {

    // LIST: GET to /items lists all queue items
    this.get().bind(function (res) {
      queue.list(function(respCode, items){
        res.send(respCode, {}, { action: 'list', items: items });
      });
    });

    // SHOW: GET to /items/:id shows the details of a specific queue item
    this.get(/\/([\w|\d|\-|\_]+)/).bind(function (res, id) {
      queue.get(id, function(respCode, item){
        res.send(respCode, {}, { action: 'show', item: item });
      });
    });

    // CREATE: POST to /items creates a new queue item.
    this.post().bind(function (res, item) {
      queue.create({}, function(respCode, envelope){
        res.send(respCode, {}, { action: 'create', envelope: envelope });
      });
    });

    // UPDATE: PUT to /items updates an existing queue item.
    this.put(/\/([\w|\d|\-|\_]+)/).bind(function (res, item) {
      queue.update(item, function(respCode, items){
        res.send(respCode, {}, { action: 'list', items: items });
      });
    });

    // DELETE: DELETE to /items/:id deletes a specific queue item.
    this.del(/\/([\w|\d|\-|\_]+)/).bind(function (res, id) {
      queue.remove(id, function(respCode, message){
        res.send(respCode, {}, { action: 'delete', message: message });
      });
    });
  });

  return router;
};