'use strict';
var fs = require('fs');
var path = require('path');
var url = require('url');

module.exports = function(req, res) {
	var urlpieces = req.url.split('/');
    var id = urlpieces[urlpieces.length-1];
    var filename = id + ".json";

  if (req.method === 'POST') {
	fs.access('./data/' + filename, fs.F_OK, function(err) {
  		if(err) {
	    	res.writeHead(404);
	    	res.end();
	    } else {
		    var input = '';
	    	req.on('data', function(data) {
	      		input += data.toString('utf-8');
	    	});
	    	req.on('end', function() {
		      fs.writeFile('./data/' + filename, input, function(err) {
		    	res.writeHead(err ? 404 : 200);
			   	res.end();
		      });
	    	});
    	}
  	}); 
  } else if (req.method === 'PUT') {
  	//replaces the content - working
	  	res.writeHead(200, {
	      'Content-Type': 'application/json'
	    });
	  	var input = '';
    	req.on('data', function(data) {
      		input += data.toString('utf-8');
    	});
    	req.on('end', function() {
	      fs.writeFile('./data/' + filename, input, function(err) {
	    	res.writeHead(err ? 404 : 200);
	    	//is it bad practice to write head twice?
		   	res.end();
	      });
    	});
  }	else if (req.method === 'PATCH') {
  	//patch 
  	res.writeHead(200, {
      'Content-Type': 'application/json'
    });
 

  }	else if (req.method === 'DELETE') {	
	   	fs.unlink('./data/' + filename, function(err) {
	   		res.writeHead(err ? 404 : 200);
	   		res.end();
	   	});
  	
  }	else if (req.method === 'GET') {   
	    fs.readFile('./data/' + filename, function(err, data) {
	    	if(err) {
	    		res.writeHead(404);
	    	} else {
	    		res.writeHead(200, {
	      			'Content-Type': 'application/json'
	    		});
	    		res.write(data);
	    	}
	    	res.end();
	    });	    
  }
};








