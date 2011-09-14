var winston = require('winston');

/**
 * Queue:
 *
 * Implementation of a queue.
 */
var Queue = function(options) {
  winston.debug("Instantiating Queue");
  //TODO: option cleanup
  options = options || {};
  this.options = {
  };

  // stats
  this.enqueued = 0;
  this.dequeued = 0;
  this.deleted = 0;

  // storage
  this.queue = {};

  var removeItem = function(id, deletion, callback) {
    if (this.queue[id]) {
      item = this.queue[id];
      if (item.timeout) {
        clearTimeout(item.timeout);
      }
      delete item;
      if(deletion) {
        this.deleted ++;
      } else {
        this.dequeued ++;
      }
      callback(200, {'success':'Item was deleted'});
    } else {
      callback(404, {'error': 'Item not found.'});
    }
  };

  return this;
};


Queue.prototype = {

  create: function(message, callback) {
    winston.debug("Invoking Queue.create()");
    var now = new Date();
    var envelope = {
      id: this.nextId(),
      timeout: null,
      message: message,
      added: now.getTime()
    };
    this.queue[envelope.id] = envelope;
    this.enqueued ++;
    callback(200, envelope);
  },

  list: function(callback) {
    callback(200, queue);
  },

  get: function(id, callback) {
    if (this.queue[id]) {
      callback(200, this.queue[id])
    } else {
      callback(404, {'error': 'Item not found.'});
    }
  },

  remove: function(id, callback) {
  },

  flush: function(callback) {
    this.queue = {};
    callback(null, this.queue);
  },

  stats: function(callback) {
    callback(200, {
      uptime: 'not implemented',
      enqueued: this.enqueued,
      dequeued: this.dequeued,
      deleted: this.deleted
    });
  },

  configure: function(options,callback) {
    if (options) {
      for (option in options) {
        if (this.options[option]) {
          this.options[option] = options[option];
        }
      }
    }
    callback(200, {
      configuration: this.options
    });
  },

  nextId: function() {
    return '398028';
  }
};

exports.Queue = Queue;