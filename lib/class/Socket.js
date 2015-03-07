(function () {

  'use strict';

  var Server = require('./Server');

  /**  Boo Socket
   *
   *  @class
   *  @description Handles #<Net> socket
   *  @extends BooQuery
   */

  function BooSocket (address) {
    this.address = new (require('./Address'))(address);

    // require('./Query').apply(this, [this.address]);

    this.connected = false;
  }

  // require('util').inherits(BooSocket, require('./Query'));

  require('util').inherits(BooSocket, require('events').EventEmitter);

  /**  Connect
   *
   *  @method
   *  @description Connect to a Socket Server
   *  @return {BooSocket}
   *  @arg {Boolean} forced_server_start - If false, will try to force start the server. 
   */

  BooSocket.prototype.connect = function (forced_server_start) {

    var self = this;

    /** Connect to socket server */

    this.socket = require('net').connect({ port: this.address.port },
      function () {
        self.emit('connected');

        self.connected = true;
      });

    /** On socket connexion error */

    this.socket.on('error', function (error) {

      console.log('client error', error.message)

      /** If relevant, try to force-start the server */

      if ( error.code === 'ECONNREFUSED' && ! forced_server_start ) {
        
        new Server(self.address)

          .create()

          .on('error', function (error) {
            self.emit('error', error);
          })

          .on('request', function (client_request) {
            self.emit('request', client_request);
          })

          .on('response', function (server_response) {
            self.emit('response', server_response);
          })       

          .on('listening', function (service) {
            self.emit('listening', service);
            self.connect(true);
          })

          .on('inserting', function (document) {
            self.emit('inserting', document);
          })

          .on('inserted', function (document) {
            self.emit('inserted', document);
          });
      }

      /** Emit error otherwise */

      else {
        self.emit('error', error);
      }
    });

    /** On server response */

    this.socket.on('data', function (data) {
      var incoming,
        message = '[' + data.toString().replace(/\}\{/g, '},{') + ']';

      try {
        incoming = JSON.parse(message);
      }
      catch ( error ) {
        self.emit('error', new Error('Could not parse: ' + message));
        return;
      }

      incoming.forEach(function (incoming) {
        if ( 'event' in incoming ) {
          self.emit(incoming.event, incoming.message);
        }
      });
    });

    /** On socket connexion end */

    this.socket.on('end', function () {
      self.emit('disconnected');
    });

    return this;
  };

  BooSocket.prototype.disconnect = function () {
    this.socket.end();
    return this;
  };

  /**  Write
   *
   *  @method
   *  @description Write to socket (send request to server)
   *  @return {BooSocket}
   *  @arg {Mixed} request - Request 
   */

  BooSocket.prototype.write = function (request) {
    var self = this;

    process.nextTick(function () {

      try {
        request = JSON.stringify(request, null, 2);
      }
      
      catch ( error ) {
        return self.emit('error', error);
      }

      if ( ! self.connected ) {
        self.once('connected', function () {
          self.socket.write(request);
        });
      }
      
      else {
        self.socket.write(request);
      }
    });

    return this;
  };

  module.exports = BooSocket;

})();
