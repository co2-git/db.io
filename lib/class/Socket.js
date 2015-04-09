! function () {

  'use strict';

  var Server = require('./Server');

  /**  Boo Socket
   *
   *  @class
   *  @description Handles #<Net> socket
   *  @extends BooQuery
   */

  function Socket (address) {
    this.address = new (require('./Address'))(address);

    this.connected = false;
  }

  // require('util').inherits(Socket, require('./Query'));

  require('util').inherits(Socket, require('events').EventEmitter);

  Socket.prototype.verbose = function(message) {

    var date = new Date();

    var month = (date.getMonth() + 1);

    if ( month < 10 ) {
      month = '0' + month;
    }

    var day = (date.getDate());

    if ( day < 10 ) {
      day = '0' + day;
    }

    var year = (date.getFullYear());

    year = year.toString().substr(2,2);

    var hour = (date.getHours());

    if ( hour < 10 ) {
      hour = '0' + hour;
    }

    var minute = (date.getMinutes());

    if ( minute < 10 ) {
      minute = '0' + minute;
    }

    var second = (date.getSeconds());

    if ( second < 10 ) {
      second = '0' + second;
    }

    var datef = '[' + month.toString() + '/' + day + '/' + year +
      ' -' + hour + ':' + minute + ':' + second + ']';

    console.log(datef.grey, 'db.io~client:'.yellow.bold + this.address.port.toString().magenta + 
          '#'.grey + this.address.channel.green + ' > ' + message);
  };

  /**  Connect
   *
   *  @method
   *  @description Connect to a Socket Server
   *  @return {Socket}
   *  @arg {Boolean} forced_server_start - If false, will try to force start the server. 
   */

  Socket.prototype.connect = function (forced_server_start) {

    var self = this;

    this.emit('message', { 'connecting socket': this.address });

    /** Connect to socket server */

    this.socket = require('net').connect({ port: this.address.port },
      function () {

        self.verbose("Hey! I'm a new client!");

        self.emit('connected');

        self.connected = true;
      });

    /** On socket connexion error */

    this.socket.on('error', function (error) {

      self.emit('message', { 'socket warning': error });

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

  Socket.prototype.disconnect = function () {
    this.socket.end();
    return this;
  };

  /**  Write
   *
   *  @method
   *  @description Write to socket (send request to server)
   *  @return {Socket}
   *  @arg {Mixed} request - Request 
   */

  Socket.prototype.write = function (request, cb) {
    var self = this;

    process.nextTick(function () {

      self.emit('message', { request: request });

      try {
        request = JSON.stringify(request, null, 2);
      }
      
      catch ( error ) {
        return self.emit('error', error);
      }

      if ( ! self.connected ) {
        self.once('connected', function () {
          self.socket.write(request, cb);
        });
      }
      
      else {
        self.socket.write(request, cb);
      }
    });

    return this;
  };

  module.exports = Socket;

} ();
