'use strict';

var server = require('../httpServer');
var chai = require('chai');
var chaihttp = require('chai-http');
var merge = require('merge');
var expect = chai.expect;
chai.use(chaihttp);

var expected = '{ "idNum" : "test" }';
var getRandResName = function() {
	return '/magic/' + (10000 + Math.random() * 10000);
}

describe('simple http server w persistance', function() {

	var resource = getRandResName();

	describe('put', function(done) {
		it('should create a new file', function(done) {
			chai.request(server)
			.put(resource)
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(JSON.parse(expected));
				done();
			});
		});
	});
	
	describe('get', function() {	
		it('should not find file', function(done) {
			chai.request(server)
			.get('/magic/doesNotExist')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				expect(JSON.parse(res.text)).to.eql({msg: 'file does not exist'});
				done();
			});
		});
		it('should get 404', function(done) {
			chai.request(server)
			.get('/fakeFolder/doesNotExist')
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				expect(JSON.parse(res.text)).to.eql({msg: 'page not found'});
				done();
			});
		});
		it('should get the resource', function(done) {
			chai.request(server)
			.get(resource)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(JSON.parse(expected));
				done();
			});
		});
	});

	describe('post', function() {
		it('should fail overwriting an existing file', function(done) {
			chai.request(server)
			.post(resource)
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				expect(JSON.parse(res.text)).to.eql({msg: 'file already exists'});
				done();
			});
		});
		it('should create a new file', function(done) {
			chai.request(server)
			.post(getRandResName())
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(JSON.parse(expected));
				done();
			});
		});
	});

	describe('patch', function() {
		it('should err file not found', function(done) {
			chai.request(server)
			.patch(getRandResName())
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				expect(JSON.parse(res.text)).to.eql({msg: 'file does not exist'});
				done();
			});
		});
		it('should not change the file', function(done) {
			chai.request(server)
			.patch(resource)
			.send(expected)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(JSON.parse(expected));
				done();
			});
		});
		it('should patch the file', function(done) {
			var newProp = {"name" : "burton"};
			var result = merge(JSON.parse(expected), newProp);
			chai.request(server)
			.patch(resource)
			.send(JSON.stringify(newProp))
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				expect(JSON.parse(res.text)).to.eql(result);
				done();
			});
		});
	});

	describe('delete', function() {
		it('should delete the file', function(done) {
			chai.request(server)
			.del(resource)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(200);
				done();
			});
		});
		it('should err deleting the non-existing file', function(done) {
			chai.request(server)
			.del(resource)
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res).to.have.status(404);
				expect(JSON.parse(res.text)).to.eql({msg: 'cannot delete'});
				done();
			});
		});
	});
});