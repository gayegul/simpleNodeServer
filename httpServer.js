'use strict';

var http = require('http');
var route = require('./lib/router');

var routes = {};
routes['magic'] = route;

var server = http.createServer(function(req, res) {
	var pathBits = req.url.split('/');
	if(typeof(routes[pathBits[1]]) === 'function') {
		routes[pathBits[1]](req, res);
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});
		res.write(JSON.stringify({msg: 'page not found'}));
		res.end();
	}
});

server.listen(3000, function() {
	console.log('server listening');
});

module.exports = server;


















