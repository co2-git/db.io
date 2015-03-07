(function () {
  'use strict';

  var path      =   require('path');
  var assert    =   require('assert');

  var mocha     =   require('mocha');
  var should    =   require('should');

  var config    =   require('../config.json');

  var Socket, socket;

  /** @class Socket */

  describe ( 'Socket - Class', function () {
    it ( 'should have its own file, lib/class/Socket.js', function () {
      Socket = require('../lib/class/Socket');
    });

    it ( 'should be a function', function () {
      Socket.should.be.a.function;
    });

    it ( 'should have prototypes', function () {
      Socket.prototype.should.be.an.Object;
    });

    it ( 'should have a connect method', function () {
      Socket.prototype.connect.should.be.a.Function;
    });

    it ( 'should have a disconnect method', function () {
      Socket.prototype.disconnect.should.be.a.Function;
    });

    it ( 'should have a write method', function () {
      Socket.prototype.write.should.be.a.Function;
    });

  });

  describe ( 'socket - Instance', function () {

    it ( 'should be an object', function () {
      socket = new Socket();
      socket.should.be.an.Object;
    });

    it ( 'should be an instance of BooSocket', function () {
      socket.constructor.name.should.equal('BooSocket')
    });

    it ( 'should have inherited from EventEmitter', function () {
      for ( var method in require('events').EventEmitter.prototype ) {
        socket.should.have.property(method).which.is.a.Function;
      }
    });

  });

  describe ( 'socket - properties - address', function () {

    it ( 'should exist', function () {
      socket.address.should.be.ok;
    });

    it ( 'should an instance of Address', function () {
      socket.address.should.be.an.instanceof(require('../lib/class/Address'));
    });

    it ( 'should have a property database which is a string and equals default database from config', function () {
      socket.address.should.have.property('database')
        .which.is.a.String
        .and.equal(config.address.database);
    });

    it ( 'should have a property collection which is a string and equals default collection from config', function () {
      socket.address.should.have.property('collection')
        .which.is.a.String
        .and.equal(config.address.collection);
    });

  });

  describe ( 'socket - properties - connected', function () {

    it ( 'should exist', function () {
      socket.connected.should;
    });

    it ( 'should be a boolean', function () {
      socket.connected.should.be.a.Boolean;
    });

    it ( 'should be false', function () {
      socket.connected.should.be.false;
    });

    it ( 'should have a property collection which is a string and equals default collection from config', function () {
      socket.address.should.have.property('collection')
        .which.is.a.String
        .and.equal(config.address.collection);
    });

  });

  describe ( 'socket - methods - connect()', function () {

    var connect;

    it ( 'should be a function', function () {
      socket.connect.should.be.a.Function;
    });

    it ( 'should not throw errors; be a BooSocket; emit a connected event', function (done) {
      connect = socket.connect();

      connect.on('error', function (error) {
        throw error;
      });

      connect.constructor.name.should.equal('BooSocket');

      connect.on('connected', done);
    });

  });

  describe ( 'socket - methods - write()', function () {

    var write,
      user_request1 = { insert: { t: 22 } },
      request1,
      response1;

    it ( 'should be a function', function () {
      socket.write.should.be.a.Function;
    });

    it ( 'should not throw errors; be a BooSocket; emit a "request" event; emit a "response" event', function (done) {

      var is_done = false;

      write = socket.write(user_request1);

      write.on('error', function (error) {
        throw error;
      });

      write.constructor.name.should.equal('BooSocket');

      write.on('request', function (request) {
        request1 = request;
        if ( ! is_done ) {
          is_done = true;
          done();
        }
      });

      write.on('inserted', function (response) {
        response1 = response;
        if ( ! is_done ) {
          is_done = true;
          done();
        }
      });
    });

    it ( '\'s "request" event should be the same than user request',
      function () {
        request1.should.eql(user_request1);
      });

    it ( '\'s "response" event should be an object',
      function () {
        response1.should.be.an.Object;
      });

  });

  describe ( 'socket - methods - disconnect()', function () {

    var disconnect;

    it ( 'should be a function', function () {
      socket.disconnect.should.be.a.Function;
    });

    it ( 'should not throw errors; be a BooSocket; emit an disconnected event', function (done) {
      disconnect = socket.disconnect();

      disconnect.on('error', done);

      disconnect.constructor.name.should.equal('BooSocket');

      disconnect.on('disconnected', done);
    });

  });
  
})();
