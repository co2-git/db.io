! function () {

  'use strict';

  var config = require('../../config.json');

  /**  Boo Server
   *
   *  @class
   *  @description The socket server
   *  @extends EventEmitter
   */

  function Server (address) {
    this.address = new (require('./Address'))(address);

    this.channels = {};

    this.clients = [];

    this.inc = 0;

    var self = this;
  }

  require('util').inherits(Server, require('events').EventEmitter);

  Server.prototype.broadcast = function (event, message) {
    this.clients.forEach(function (client) {
      client.write(JSON.stringify({ event: event, message: message },
        null, 2));
    });
  };

  Server.prototype.verbose = function(message, info) {

    try {
      info = JSON.stringify(info, null, 2);
    }
    catch ( e ) {}

    if ( ! info ) {
      info = '';
    }

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

    console.log(datef.grey, 'db.io~server:'.blue.bold + this.address.port.toString().magenta + 
          '#'.grey + this.address.channel.green + ' > ' + message, info.yellow);
  };

  /**  Create Socket Server
   *
   *  @method
   *  @description Create the Socket Server
   *  @return {Server}
   */

  Server.prototype.create = function () {
    var server = this;

    process.nextTick(function () {

      /** Create client */

      server.service = require('net').createServer(function (socket) {

        server.verbose("Hey! I'm a new server!");

        socket.booid = server.inc ++;

        /** Add this client to list of clients **/

        server.clients.push(socket);

        /** Notify "join" */

        server.emit('join');

        server.socket = socket;

        server.socket.on('end', function () {
          server.emit('leave');

          server.clients = server.clients.filter(function (client) {
            return client.booid !== socket.booid;
          });
        });

        server.socket.on('error', function (error) {
          server.emit('error', error);
        });

        /** INCOMING MESSAGE */

        server.socket.on('data', function (data) {

          var incoming,
            message = '[' + data.toString().replace(/\}\{/g, '},{') + ']';

          try {
            incoming = JSON.parse(message);
          }
          catch ( error ) {
            server.emit('error', new Error('Could not parse: ' + message));
            return;
          }

          server.verbose('New incoming data!', incoming);

          server.emit('message', { incoming: incoming });

          incoming.forEach(function (incoming) {
            server.emit('request', incoming);
            server.broadcast('request', incoming);

            if ( 'dbs' in incoming ) {
              server.emit('dbs', Object.keys(server.channels));
              server.broadcast('dbs', Object.keys(server.channels));
            }

            else if ( 'collections' in incoming ) {
              server.emit('collections', Object.keys(server.channels[incoming.channel || config.address.channel]));
              server.broadcast('collections', Object.keys(server.channels[incoming.channel || config.address.channel]));
            }

            else if ( 'push' in incoming ) {

              var channel = incoming.channel || config.address.channel;

              server.verbose('.. push', incoming);

              server.emit('pushing', incoming);
              server.broadcast('pushing', incoming);

              if ( ! server.channels[channel] ) {
                server.channels[channel] = [];
                server.emit('new channel', channel);
                server.broadcast('new channel', channel);
              }

              var position = server.channels[channel].push(incoming.push);

              server.verbose('OK push', incoming);

              server.emit('pushed', incoming, position);
              server.broadcast('pushed', incoming, position);
            }

            else if ( 'toArray' in incoming ) {

              var channel = incoming.channel || config.address.channel;

              server.emit('listing', incoming);
              server.broadcast('listing', incoming);

              if ( ! server.channels[channel] ) {
                server.channels[channel] = [];
                server.emit('new channel', channel);
                server.broadcast('new channel', channel);
              }

              server.emit('listed ' + channel, {
                channel: channel,
                store: server.channels[channel]
              });

              server.broadcast('listed ' + channel, {
                channel: channel,
                store: server.channels[channel]
              });
            }

            else if ( 'update' in incoming ) {

              var db_name = incoming.channel || config.address.channel;
              var collection_name = incoming.collection || config.address.collection;

              server.emit('updating', incoming);
              server.broadcast('updating', incoming);

              if ( ! server.channels[db_name] ) {
                server.emit('error', new Error('No such channel: ' + db_name));
                server.broadcast('error', new Error('No such channel: ' + db_name));
                return;
              }

              if ( ! server.channels[db_name][collection_name] ) {
                server.emit('error', new Error('No such collection: ' + collection_name));
                server.broadcast('error', new Error('No such collection: ' + collection_name));
                return;
              }

              var updated = server.channels[db_name][collection_name];

              server.channels[db_name][collection_name] = server.channels[db_name][collection_name]
                .map(function (document) {
                  for ( var setter in incoming.update.$set ) {
                    document[setter] = incoming.update.$set[setter];
                  }
                  return document;
                });

              server.emit('updated', {
                channel: db_name,
                collection: collection_name,
                documents: updated
              });
              server.broadcast('updated', {
                channel: db_name,
                collection: collection_name,
                documents: updated
              });
            }

            else if ( 'remove' in incoming ) {

              var db_name = incoming.channel || config.address.channel;
              var collection_name = incoming.collection || config.address.collection;

              server.emit('removing', incoming);
              server.broadcast('removing', incoming);

              if ( ! server.channels[db_name] ) {
                server.emit('error', new Error('No such channel: ' + db_name));
                server.broadcast('error', new Error('No such channel: ' + db_name));
                return;
              }

              if ( ! server.channels[db_name][collection_name] ) {
                server.emit('error', new Error('No such collection: ' + collection_name));
                server.broadcast('error', new Error('No such collection: ' + collection_name));
                return;
              }

              var removed = server.channels[db_name][collection_name];

              server.channels[db_name][collection_name] = server.channels[db_name][collection_name]
                .filter(function (document) {
                  return false;
                });

              server.emit('removed', {
                channel: db_name,
                collection: collection_name,
                documents: removed
              });
              server.broadcast('removed', {
                channel: db_name,
                collection: collection_name,
                documents: removed
              });
            }
          });

        });
      });

      /** Start client */

      server.service.listen(server.address.port, server.address.server,
        function () {
          server.emit('listening', {
            port: server.address.port
          });
        });

      /** Catch client errors */

      server.service.on('error', function (error) {

        if ( error.code === 'EADDRINUSE' ) {
          server.emit('server bounced', server.address.port);
        }

        server.emit('error', error);
      });

      server.service.unref();
    });

    return this;
  };

  module.exports = Server;

} ();
