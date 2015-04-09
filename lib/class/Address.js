! function () {

  'use strict';

  var config = require('../../config.json');

  /** Address Object ( From String 'dbio://...' )
   *
   *  @class
   */

  function Address (address) {

    address = address || {};

    if ( typeof address === 'string' ) {
      var url = require('url').parse(address);

      address = {
        server:     url.hostname,
        port:       url.port
      };

      if ( url.path ) {
        address.channel = url.path.replace(/^\//, '').split(/\//)[0];
      }
    }

    this.server       =   address.server || config.address.server;
    this.port         =   +(address.port || config.address.port);
    this.channel      =   address.channel || config.address.channel;
  }

  module.exports = Address;

} ();
