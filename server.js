var http = require('http');

http.createServer(function (req, res) {

    console.log('Got request.');

    setTimeout(function() {
        console.log('Timout reached. Send response.');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World');
    }, 2000)

}).listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');
