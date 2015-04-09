! function () {

  'use strict';

  var Emitter = require('./Emitter');

  /**
   *  @class      Client
   *  @arg        {String} address
   */ 

  function Client (address) {

    var client = this;
    
    process.nextTick(function () {

      client.emit('message', { 'new client': address });

      require('./Socket').apply(client, [address]);

      client.connect();
    });

    // this.provider(this);
  }

  /**
   *    @extends    Socket
   */

  require('util').inherits(Client, require('./Socket'));

  /** send() - Send a new request to Server 
   *
   *  @method       Client.send
   *  @arg 
  */

  Client.prototype.send = function (event, channel, options, cb) {

    var client = this;

    process.nextTick(function () {

      var w = {
        channel: channel
      };

      w[event] = options;

      client.write(w);

    });

    return this;
  };

  /** toArray() - Return an array of messages
   *
   *  @method       Client.toArray
   *  @arg 
  */

  Client.prototype.toArray = function (channel, options, cb) {

    var client = this;

    for ( var i in arguments ) {
      if ( typeof arguments[i] === 'string' ) {
        channel = arguments[i];
      }

      else if ( typeof arguments[i] === 'object' ) {
        options = arguments[i];
      }

      else if ( typeof arguments[i] === 'function' ) {
        cb = arguments[i];
      }
    }

    var emitter = new Emitter();

    process.nextTick(function () {

      if ( typeof channel !== 'string' ) {
        channel = client.address.channel;
      }

      if ( typeof options !== 'object' ) {
        options = {};
      }

      options.emitter = emitter;

      var send = client.send('toArray', channel, options, cb);

      client.on('listed ' + channel, function (players) {
        emitter.emit('success', players);
      });

    });

    return emitter;
  };

  Client.prototype.push = function (data, cb) {

    data          =   data || null;

    var client    =   this;

    /** @type         events.EventEmitter */
    var emitter   =   new Emitter();

    process.nextTick(function () {
      client.send('push', client.address.channel, data, cb);

      client.on('pushed ' + client.address.channel, function (players) {
        emitter.emit('success', players);
      });
    });

    return emitter;
  };

  module.exports = Client;

}();
