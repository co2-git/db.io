(function () {
  'use strict';

  var util = require("util");

  var events = require("events");

  var net = require('net');

  var Server = require('./Server');

  function Connexion (address) {

    var connexion = this;

    this.connected = false;

    function onSocket (socket) {
      console.log(' ✔ '.green + 'connected'.bold.green);
      console.log(' -----------------------'.grey);

      connexion.emit('connected', socket);

      connexion.connected = true;

      Connexion.cache[address.toString(true)] = socket;
    }

    function onData (data) {
      this.emit('log', {
        ok: 'client received response from server',
        info: data
      });
    }

    function onEnd () {

    }

    function onError (error) {
      switch ( error.code ) {
        default:
          
          connexion.emit('log', {
            ko: 'socket socket error',
            info: error
          });

          return connexion.emit('error', error);

        case 'ECONNREFUSED':
          
          connexion.emit('log', {
            warn: 'socket socket error',
            info: error
          });

          connexion.emit('log', {
            message: 'maybe server is not started, will try to start it now'
          });

          return new Server(address)
            .on('error', function (error) {
              error.code = 'ECONNREFUSED_TWICE';
              connexion.emit('error', error);
            })
            .on('log', function (log) {
              connexion.emit('log', log);
            })
            .on('listening', function () {

              var listeners = {
                data: connexion.socket.listeners('data'),
                end: connexion.socket.listeners('end'),
                error: connexion.socket.listeners('error')
              };

              connexion.socket = net.connect({ port: address.port }, onSocket);

              connexion.socket.on('error', function (error) {
                connexion.emit('error', error);
              });

              connexion.socket.on('data', onData.bind(connexion));

              connexion.socket.on('end', onEnd);

              listeners.data.forEach(function (listener) {
                if ( listener.name !== 'onData' ) {
                  connexion.socket.on('data', listener);
                }
              });

              listeners.end.forEach(function (listener) {
                if ( listener.name !== 'onEnd' ) {
                  connexion.socket.on('end', listener);
                }
              });

              listeners.error.forEach(function (listener) {
                if ( listener.name !== 'onError' ) {
                  connexion.socket.on('error', listener);
                }
              });
            });
      }
    }

    process.nextTick(function () {

      connexion.emit('log', {
        ok: 'new Connexion',
        info: {
          address: address
        }
      });

      if ( Connexion.cache[address.toString(true)] ) {
        connexion.emit('connected', Connexion.cache[address.toString(true)]);
        connexion.socket = Connexion.cache[address.toString(true)];
      }

      else {
        connexion.emit('log', {
          warn: 'no cache, connecting now'
        });

        connexion.socket = net.connect({ port: address.port }, onSocket);

        connexion.socket.on('error', onError.bind(connexion));

        connexion.socket.on('data', onData.bind(connexion));

        connexion.socket.on('end', onEnd);
      }
    });
  }

  util.inherits(Connexion, events.EventEmitter);

  Connexion.cache = {};

  Connexion.prototype.write = function (message) {

    message = JSON.stringify(message, null, 2);

    console.log(' ℹ '.cyan + 'writing'.bold.cyan, message);
    console.log(' -----------------------'.grey);

    var connexion = this;
    
    if ( ! this.connected ) {
      console.log(' ⚠ '.yellow + 'socket not connected, can not write message'.bold.yellow, message);
      console.log(' -----------------------'.grey);

      console.log(' ℹ '.cyan + 'adding a listener to write message once connected'.bold.cyan, message);
      console.log(' -----------------------'.grey);

      this.once('connected', function () {
        console.log(' ℹ '.cyan + 'writing'.bold.cyan, message);
        console.log(' -----------------------'.grey);

        connexion.socket.write(message);
      });
    }
    else {
      this.socket.write(message);
    }
  };

  module.exports = Connexion;
})();
