/***

  

***/

! function () {

  'use strict';

  exports.client = function (address) {
    var Client = require('./lib/class/Client');

    var client = new Client(address);

    return client;
  };

  exports.server = function (address) {
    var Server = require('./lib/class/Server');

    var server = new Server(address);

    return server;
  };

}();
