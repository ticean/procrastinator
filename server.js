var http = require('http');

try {
    var config = require('./appConfig').config;
} catch (e) {
    console.log("\nCouldn't load settings. Try $> cp appConfig.example.js appConfig.js");
}


http.createServer(function (req, res) {
    console.log('Got request.');
    setTimeout(function() {
        console.log('Timout reached. Send response.');
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World');
    }, 2000);
}).listen(config.port, config.hostname);

console.log('Server running at http://' + config.hostname + ':' + config.port + '/');
