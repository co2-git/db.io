(function () {

  'use strict';

  var config = require('../../config.json');

  function Address (address) {

    address = address || {};

    if ( typeof address === 'string' ) {
      var url = require('url').parse(address);

      address = {
        server: url.hostname,
        port: url.port,
        database: url.path.replace(/^\//, '')
          .split(/\//)[0],
        collection: url.path.replace(/^\//, '')
          .split(/\//)[1]
      };
    }

    this.server = address.server || config.address.server;
    this.port = +(address.port || config.address.port);
    this.database = address.database || config.address.database;
    this.collection = address.collection || config.address.collection;
  }

  module.exports = Address;

})();
