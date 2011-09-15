var http = require('http'),
    hashlib = require('hashlib'),
    _und = require('./underscore/underscore'),
    winston = require('winston');

/**
 * Queue
 */
var Queue = function(options) {
  winston.debug("Instantiating Queue");

  //TODO: option cleanup
  options = options || {};
  
  this.options = options;
  this.enqueued = 0;
  this.dequeued = 0;
  this.deleted = 0;
  this.queue = {};
  
  this.removeItem = function (id, deletion, callback) {
    if (this.queue[id]) {
      item = this.queue[id];
      if (item.timeoutId) {
        clearTimeout(item.timeoutId);
      }

      delete this.queue[id];

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

  //TODO: Cleanup item/message/envelope semantics.
  create: function(message, callback) {
    var now = new Date();

    /*
    var timeoutId = setTimeout(function(){
      http.createClient(8008, '127.0.0.1')
        .request('GET', '/created/item/id/')
        .end();
      }, 5000); */

    var envelope = {
      id: this.nextId(),
      timeoutId: null,
      message: message,
      timestamp_added: now.getTime()
    };

    this.queue[envelope.id] = envelope;
    this.enqueued ++;
    winston.debug("Queue item created.", {item: envelope});
    callback(200, envelope);
  },

  update: function(message, callback) {
    callback(501, "Not Implemented");
  },

  list: function(callback) {
    callback(200, _und.keys(this.queue));
  },

  dump: function(callback) {
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
    this.removeItem(id, true, callback);
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
    var now = new Date();
    return hashlib.sha1(now.getTime());
  }
};

exports.Queue = Queue;