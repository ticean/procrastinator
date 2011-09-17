//@see http://blog.nodejitsu.com/rest-easy-test-any-api-in-nodejs
var APIeasy = require('api-easy'),
    assert = require('assert');

//
// Create a APIeasy test suite for our API
//
var suite = APIeasy.describe('procrastinator');


// Create a tokenization function so we can use resource ids.
var replacements = new Object;
suite.before('replaceTokens', function (outgoing) {
    for(replacementIndex in replacements) {
      var replacement = replacements[replacementIndex];
      var token = '$' + replacementIndex;
      outgoing.uri = outgoing.uri.replace(token, replacement);
    }
     return outgoing;
   });

//
// Here we will configure our tests to use
// http://127.0.0.1:8000 as the remote address
// and to always send 'Content-Type': 'application/json'
//
suite.use('127.0.0.1', 8000)
     .setHeader('Content-Type', 'application/json')

  .discuss('When using the API')
    .discuss('and posting a new item')
    .path('/items')
      .discuss('a post missing required parameters')
        .post().expect(400)
      .undiscuss()
      .discuss('a post with required parameters')
        .post({ 
          "callbackUrl": "http://127.0.0.1:8008/callback/items/{{id}}",
          "interval" : 15497,
          "data" : {"test":58695404968659445650}
          })
        .expect(200)
        .expect('item data is set appropriately', function (err, res, body) {
          var result = JSON.parse(body);
          assert.isNotNull(result.id);
          assert.equal(result.callbackUrl, "http://127.0.0.1:8008/callback/items/" + result.id);
          assert.equal(result.interval, 15497);
          assert.equal(result.data.test, 58695404968659445650);
          assert.equal(typeof(result.scheduledAt), "number");
          assert.equal(typeof(result.scheduledFor), "number");
          replacements['item_id'] = result.id
        })
      .undiscuss().next()
    .undiscuss()
    .discuss('and getting an item')
    .path('/$item_id')
      .get().expect(200)
      .expect('item data is set appropriately', function (err, res, body) {
        var result = JSON.parse(body);
        assert.isNotNull(result.id);
        assert.equal(result.callbackUrl, "http://127.0.0.1:8008/callback/items/" + result.id);
        assert.equal(result.interval, 15497);
        assert.equal(result.data.test, 58695404968659445650);
        assert.equal(typeof(result.scheduledAt), "number");
        assert.equal(typeof(result.scheduledFor), "number");
      })
    .undiscuss()
    .discuss('and updating and existing item')
      .put().expect(501)
    .undiscuss().unpath()
    .discuss('and getting a non-valid item')
      .path('/somebaduri-wont.find.nothin.noway')
        .get().expect(404)
    .undiscuss().unpath()
    .discuss('and getting a list of items')
      .get()
        .expect(200)
        .expect('list result is an array', function (err, res, body) {
          var result = JSON.parse(body);
          assert.equal(Object.prototype.toString.apply(result), '[object Array]');
        })
        .expect('the list contains the created item', function (err, res, body) {
          var result = JSON.parse(body);
          var id = replacements['item_id'];
          assert.ok(result.indexOf(id) > -1);
        })
    .undiscuss().next()
    .discuss('and deleting an existing item')
    .path('/$item_id')
      .del().expect(200)
    .undiscuss()
  .undiscuss()
.run();
