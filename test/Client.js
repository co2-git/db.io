(function () {

  'use strict';

  var path      =   require('path');
  var assert    =   require('assert');

  var mocha     =   require('mocha');
  var should    =   require('should');

  var config    =   require('../config.json');

  var Client, client;

  /** @class Client */

  describe ( 'Client - Class', function () {

    it ( 'should have its own file, lib/class/Client.js', function () {
      Client = require('../lib/class/Client');
    });

    it ( 'should be a function', function () {
      Client.should.be.a.function;
    });

    it ( 'should have prototypes', function () {
      Client.prototype.should.be.an.Object;
    });

    it ( 'should have a db method', function () {
      Client.prototype.db.should.be.a.Function;
    });

    it ( 'should have a collection method', function () {
      Client.prototype.collection.should.be.a.Function;
    });

  });

  describe ( 'client - Instance', function () {

    it ( 'should be an object', function () {
      client = new Client();
      client.should.be.an.Object;
    });

    it ( 'should be an instance of BooClient', function () {
      client.constructor.name.should.equal('BooClient');
    });

    it ( 'should have inherited from BooSocket', function () {
      for ( var method in require('../lib/class/Socket').prototype ) {
        client.should.have.property(method).which.is.a.Function;
      }
    });

    it ( 'should have inherited from EventEmitter', function () {
      for ( var method in require('events').EventEmitter.prototype ) {
        client.should.have.property(method).which.is.a.Function;
      }
    });

  });

  describe ( 'client - methods - db()', function () {

    var db;

    it ( 'should be a function', function () {
      client.db.should.be.a.Function;
    });

    it ( 'should NOT change address db when called with a non-string argument', function () {
      db = client.db(123);
      client.address.database.should.equal(config.address.database);
    });

    it ( 'should change address db when called', function () {
      db = client.db('test123');
      client.address.database.should.equal('test123');
    });

    it ( 'should return client', function () {
      db.constructor.name.should.equal('BooClient');
    });

  });

  describe ( 'client - methods - collection()', function () {

    var collection;

    it ( 'should be a function', function () {
      client.collection.should.be.a.Function;
    });

    it ( 'should NOT change address collection when called with a non-string argument', function () {
      collection = client.collection(123);
      client.address.collection.should.equal(config.address.collection);
    });

    it ( 'should change address collection when called', function () {
      collection = client.collection('test123');
      client.address.collection.should.equal('test123');
    });

    it ( 'should change address database when called with /', function () {
      collection = client.collection('test456/collec123');
      client.address.database.should.equal('test456');
    });

    it ( 'should return client', function () {
      collection.constructor.name.should.equal('BooClient');
    });

  });

  describe ( '-- house cleaning --', function () {

    it ( 'should disconnect client', function (done) {
      var disconnect = client.disconnect();

      disconnect.on('error', done);

      disconnect.on('disconnected', done);
    });

  });


})();
