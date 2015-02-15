'use strict';

var chai = require('chai');
var chaihttp = require('chai-http');
var server = require('../httpServer');
var fs = require('fs');
var expect = chai.expect;
chai.use(chaihttp);


var expected = '{ "idNum" : "1" }';
var path = './data/1.json';
var host = 'localhost:3000';


describe('simple http server w persistance', function() {
	
	describe('get', function() {
		
		it('should read the file', function(done) {
			fs.writeFileSync(path, expected);
			chai.request(server)
			.get('/magic/1')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(res.text).to.eql(expected);
				done();
			});
		});
	});

	describe('put', function() {
		try{
			fs.unlinkSync(path);
		} catch(err) {}
		it('should create a new file', function(done) {
			chai.request(server)
			.put('/magic/1')
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				
				fs.readFile(path, function(errReading, data) {
					if(errReading) {
						throw errReading;
					} else {
						expect(data.toString('utf-8')).to.eql(expected);
						done();
					}
				});
			});
		});
	});

	/*
	describe('post', function() {
		it('should checks a file exists, if not creates it', function(done) {
			chai.request('localhost:3000')
			.post('/magic/1')
			.send('{ "idNum" : "1" }')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				//expect(res.text).to.eql('{ "idNum" : "1" }');
				done();
			});
		});
	});

	
*/
	describe('delete', function() {
		it('should delete the file', function(done) {
			//fs.writeFileSync(path, expected);
			chai.request(server)
			.del('/magic/1')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				fs.open(path, "wx", function(err) {
					if(err) {
						done();
					} else {
						throw new Error("File still exists.");
					}
				});
			});
		});
	});
});