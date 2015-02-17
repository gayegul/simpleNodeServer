'use strict';
var fs = require('fs');
//var path = require('path');
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

var headers = {'Content-Type': 'application/json'};

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
	    	res.writeHead(404, headers);
	    	res.write(JSON.stringify({msg: 'file already exists'}));
	    	res.end();
	    } else {
	    	readDataFromReq(req, function(input) {
	    		try {
	    			JSON.parse(input);
	    		} catch (err) {
	    			res.writeHead(404, headers);
				    res.write(JSON.stringify({msg: 'bad input JSON'}));
					res.end();
					return; 
	    		}
	    		fs.writeFile(path, input, function(err) {
			    	if(err) {
				    	res.writeHead(404, headers);
				    	res.write(JSON.stringify({msg: 'cannot write'}));
						res.end();
					} else {
						res.writeHead(200, headers);
						res.write(input);
			    		res.end();
					}
		      	});
	    	});
    	}
  	}); 
  } else if (req.method === 'PUT') {
  	//replaces the content 
	  	res.writeHead(200, headers);
	  	readDataFromReq(req, function(input) {
	      fs.writeFile(path, input, function(err) {
	    	if(err) {
		    	res.writeHead(404, headers);
		    	res.write(JSON.stringify({msg: 'cannot write'}));
				res.end();
			} else {
				res.writeHead(200, headers);
				res.write(input);
	    		res.end();
			}
	      });
    	});
  }	else if (req.method === 'PATCH') {
  	//assigns/adds different bits to the file
 	fs.open(path, 'r+', function(err) {
 		if(err) {
 			res.writeHead(404, headers);
	    	res.write(JSON.stringify({msg: 'file does not exist'}));
	    	res.end();
 		} else {
 			readDataFromReq(req, function(input) { 				
 				input = JSON.parse(input);
 				fs.readFile(path, function(err, data) {
 					file = data.toString('utf8');
 					file = JSON.parse(file);
 					for (var key in input) {
 						file[key] = input[key];
 					}
 					file = JSON.stringify(file);
 					fs.writeFile(path, file, function(err) {
 						if(err) {
					    	res.writeHead(404, headers);
					    	res.write(JSON.stringify({msg: 'cannot write'}));
							res.end();
						} else {
							res.writeHead(200, headers);
							res.write(file);
				    		res.end();
						}				
 					});
 				});
 			});
 		}
 	});
  }	else if (req.method === 'DELETE') {	
  	//deletes the file
  		console.log("deleting: " + path);
	   	fs.unlink(path, function(err) {
	   		if(err) {
		    	res.writeHead(404, headers);
		    	res.write(JSON.stringify({msg: 'cannot delete'}));
				res.end();
			} else {
				res.writeHead(200);
	    		res.end();
			}
	   	});
  }	else if (req.method === 'GET') {
  	//reads the file   
	    fs.readFile(path, function(err, data) {
	    	if(err) {
	    		res.writeHead(404, headers);
	    		res.write(JSON.stringify({msg: 'file does not exist'}));
	    		res.end();
	    	} else {
	    		res.writeHead(200, headers);
	    		res.write(data);
	    		res.end();
	    	}
	    });	    
  	}	
};








