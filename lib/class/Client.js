(function () {

  'use strict';

  function BooClient (address) {
    require('./Socket').apply(this, arguments);

    this.connect();

    // this.provider(this);
  }

  require('util').inherits(BooClient, require('./Socket'));

  BooClient.prototype.db = function (dbName) {
    if ( typeof dbName === 'string' ) {
      this.address.database = dbName;
    }

    return this;
  };

  BooClient.prototype.collection = function (collectionName) {
    if ( typeof collectionName === 'string' ) {
      if ( /\//.test(collectionName) ) {
        this.address.database = collectionName.split(/\//)[0];
        this.address.collection = collectionName.split(/\//)[0];
      }
      else {
        this.address.collection = collectionName;
      }
    }

    return this;
  };

  BooClient.prototype.send = function (event, document) {

    var client = this;

    process.nextTick(function () {

      var w = {
        database: client.address.database,
        collection: client.address.collection
      };

      w[event] = document || {};

      client
        
        .write(w);
    });

    return this;
  };

  BooClient.prototype.insert = function (document) {
    return this.send('insert', document);
  };

  BooClient.prototype.find = function (document) {
    return this.send('find', document);
  };

  BooClient.prototype.update = function (document) {
    return this.send('update', document);
  };

  BooClient.prototype.remove = function (document) {
    return this.send('remove', document);
  };

  module.exports = BooClient;

})();