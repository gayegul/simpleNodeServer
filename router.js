'use strict';
var fs = require('fs');
var path = require('path');
var url = require('url');

function readDataFromReq(req, callback) {
	var input = '';
	req.on('data', function(data) {
  		input += data.toString('utf-8');
	});
	req.on('end', function() {
      callback(input);
	});
}

module.exports = function(req, res) {
	var urlpieces = req.url.split('/');
    var id = urlpieces[urlpieces.length-1];
    var filename = id + ".json";
    var path = './data/' + filename;
    var file;

  if (req.method === 'POST') {
  	//checks if a file exists, if not creates it
	fs.open(path, "wx", function(err) {
  		if(err) {
	    	res.writeHead(404);
	    	res.end();
	    } else {
	    	readDataFromReq(req, function(input) {
	    		fs.writeFile(path, input, function(err) {
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
	  	readDataFromReq(req, function(input) {
	      fs.writeFile(path, input, function(err) {
	    	res.writeHead(err ? 404 : 200);
		   	res.end();
	      });
    	});
  }	else if (req.method === 'PATCH') {
 	fs.open(path, 'r+', function(err) {
 		if(err) {
 			res.writeHead(404);
 			res.end();
 		} else {
 			readDataFromReq(req, function(input) { 				
 				input = JSON.parse(input);
 				fs.readFile(path, function(err, data) {
	 				if(err) {
	 					res.writeHead(404);
	 					res.end();
	 				} else {
	 					file = data.toString('utf8');
	 					file = JSON.parse(file);
	 					for (var key in input) {
	 						file[key] = input[key];
	 					}
	 					file = JSON.stringify(file);
	 					fs.writeFile(path, file, function(err) {
	 						res.writeHead(err ? 404 : 200);
	 						res.end();
	 					});
	 				}
 				});
 			});
 		}
 	});
  }	else if (req.method === 'DELETE') {	
  		console.log("deleting: " + path);
	   	fs.unlink(path, function(err) {
	   		res.writeHead(err ? 404 : 200);
	   		res.end();
	   	});
  }	else if (req.method === 'GET') {   
	    fs.readFile(path, function(err, data) {
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








