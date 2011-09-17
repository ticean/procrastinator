var http = require('http'),
    url = require('url'),
    hashlib = require('hashlib'),
    _und = require('./underscore/underscore'),
    winston = require('winston');

/**
 * Queue
 */
var Queue = function(options) {

  //TODO: option cleanup
  options = options || {};
  this.options = options;
  this.options.delayInterval = 600000;

  this.enqueued = 0;
  this.dequeued = 0;
  this.deleted = 0;
  this.queue = {};
  
  this.removeItem = function (id, deletion, callback) {
    var item = this.queue[id];
    if (item) {
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

  this.callbackHandler = function(context, id){
      var urlObj, connection, request, path;
      var item = context.queue[id];
      winston.debug("Callback on ID: ", {id: id});
      winston.debug("Callback context: ", {item: context.queue[id]});
      if(item) {
        urlObj = url.parse(item.callbackUrl);
        connection = http.createClient(urlObj.port, urlObj.hostname);
        request = connection.request('POST', urlObj.pathname);

        connection.addListener('error', function(e){
          if (e.errno === process.ECONNREFUSED) {
              winston.error('Callback connection refused', {itemId: item.id, callbackUrl: item.callbackUrl});
          } else {
              winston.error('Callback connection error', { exception: e } );
          }
        });
        request.addListener('response', function(response){
          var data = '';
          response.addListener('data', function(chunk){
              data += chunk;
            });
          response.addListener('end', function(){
            });
        });
        request.end();

        context.removeItem(item.id, false, function(){});
      } else {
        winston.debug('Callback on item no longer in queue.', {id: id});
      }
  };

  /**
   * Sanitizing function... not really needed anymore.
   * @param item
   */
  this.sanitizeItem = function(item) {
    return {
      id: item.id,
      callbackUrl: item.callbackUrl,
      interval: item.interval,
      data: item.data,
      scheduledAt: item.scheduledAt,
      scheduledFor: item.scheduledFor
    };
  };

  return this;
};


Queue.prototype = {

  /**
   * Creates a new queue item.
   * @param message
   * @param callback
   */
  create: function(message, callback) {
    var now = new Date(),
        interval = message.interval || 10000;
    
    if (!message.callbackUrl) {
      callback('400', "Missing required callbackUrl parameter.");
      return;
    }

    var id = this.nextId();
    var message = {
      id: id,
      callbackUrl: message.callbackUrl.replace("{{id}}", id),
      interval: interval,
      scheduledAt: now.getTime(),
      scheduledFor: now.getTime() + interval,
      data: message.data || {}
    };

    setTimeout(this.callbackHandler, message.interval, this, message.id);
    this.queue[message.id] = message;
    this.enqueued ++;
    winston.debug("Item queued", {id: message.id});
    
    callback(200, this.sanitizeItem(message));
  },

  update: function(item, callback) {
    callback(501, "Not Implemented");
  },

  list: function(callback) {
    callback(200, _und.keys(this.queue));
  },

  dump: function(callback) {
    callback(200, _und.map(this.queue, function(item){
      return this.sanitizeItem(item);
    }, this));
  },


  get: function(id, callback) {
    if (this.queue[id]) {
      callback(200, this.sanitizeItem(this.queue[id]));
    } else {
      callback(404, 'Item not found.');
    }
  },

  remove: function(id, callback) {
    this.removeItem(id, true, callback);
  },

  flush: function(callback) {
    this.queue = {};
    callback(200, this.queue);
  },

  stats: function(callback) {
    callback(200, {
      //uptime: 'not implemented',
      enqueued: this.enqueued,
      dequeued: this.dequeued,
      deleted: this.deleted
    });
  },

  nextId: function() {
    var now = new Date();
    return hashlib.sha1(now.getTime());
  }
};

exports.Queue = Queue;