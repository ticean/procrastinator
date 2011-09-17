var vows = require('vows'),
    assert = require('assert'),
    queue = require('../lib/queue');

vows.describe('Procrastinator Queue').addBatch({
  'A queue instance': {
    topic: new queue.Queue({}),
    'should have list() method': function(topic) {
      assert.isFunction(topic.list);
    },
    'should have a get() method': function(topic) {
      assert.isFunction(topic.get);
    },
    'should have a create() method': function(topic) {
      assert.isFunction(topic.create);
    },
    'should have a remove() method': function(topic) {
      assert.isFunction(topic.remove);
    },
    'should have a flush() method': function(topic) {
      assert.isFunction(topic.flush);
    },
    'should have a stats() method': function(topic) {
      assert.isFunction(topic.stats);
    }
  }
}).run();