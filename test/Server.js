/***
            /  |                                               
            ## |____    ______    ______          __   _______ 
            ##      \  /      \  /      \        /  | /       |
            #######  |/######  |/######  |       ##/ /#######/ 
            ## |  ## |## |  ## |## |  ## |       /  |##      \ 
            ## |__## |## \__## |## \__## |__     ## | ######  |
            ##    ##/ ##    ##/ ##    ##//  |    ## |/     ##/ 
            #######/   ######/   ######/ ##/__   ## |#######/  
                                           /  \__## |          
                                           ##    ##/           
                                            ######/             
                                    
                                    
                             

                                           all
                            your      .do-"""""'-o..  sockets
                           are     .o""            ""..   belong
                            to   ,,''                 ``b. us
                                d'                      ``b                   
                               d`d:                       `b.                 
                              ,,dP                         `Y.               
                             d`88                           `8.               
       ooooooooooooooooood888`88'                            `88888888888bo, 
      d"""    `""""""""""""Y:d8P                              8,          `b 
      8                    P,88b                             ,`8           8 
      8                   ::d888,                           ,8:8.          8 
      :                   dY88888                           `' ::          8 
      :                   8:8888                               `b          8 
      :                   Pd88P',...                     ,d888o.8          8 
      :                   :88'dd888888o.                d8888`88:          8 
      :                  ,:Y:d8888888888b             ,d88888:88:          8 
      :                  :::b88d888888888b.          ,d888888bY8b          8 
                          b:P8;888888888888.        ,88888888888P          8 
                          8:b88888888888888:        888888888888'          8 
                          8:8.8888888888888:        Y8888888888P           8 
      ,                   YP88d8888888888P'          ""888888"Y            8 
      :                   :bY8888P"""""''                     :            8 
      :                    8'8888'                            d            8 
      :                    :bY888,                           ,P            8 
      :                     Y,8888           d.  ,-         ,8'            8 
      :                     `8)888:           '            ,P'             8 
      :                      `88888.          ,...        ,P               8 
      :                       `Y8888,       ,888888o     ,P                8 
      :                         Y888b      ,88888888    ,P'                8 
      :                          `888b    ,888888888   ,,'                 8 
      :                           `Y88b  dPY888888OP   :'                  8 
      :                             :88.,'.   `' `8P-"b.                   8 
      :.                             )8P,   ,b '  -   ``b                  8 
      ::                            :':   d,'d`b, .  - ,db                 8 
      ::                            `b. dP' d8':      d88'                 8 
      ::                             '8P" d8P' 8 -  d88P'                  8 
      ::                            d,' ,d8'  ''  dd88'                    8 
      ::                           d'   8P'  d' dd88'8                     8 
       :                          ,:   `'   d:ddO8P' `b.                   8 
       :                  ,dooood88: ,    ,d8888""    ```b.                8 
       :               .o8"'""""""Y8.b    8 `"''    .o'  `"""ob.           8 
       :              dP'         `8:     K       dP''        "`Yo.        8 
       :                    8888                           888:    ::      8 
       :                    8888:                          888b     Y.     8, 
       :                    8888b                          :888     `b     8: 
       :                    88888.                         `888,     Y     8: 
       ``ob...............--"""""'----------------------`""""""""'"""`'"""""

***/

(function () {
  'use stritc';

  var path      =   require('path');
  var assert    =   require('assert');

  var mocha     =   require('mocha');
  var should    =   require('should');

  var config    =   require('../config.json');

  var Server, server;

  /** @class Server */

  describe ( 'Server - Class', function () {

    it ( 'should have its own file, lib/class/Server.js', function () {
      Server = require('../lib/class/Server');
    });

    it ( 'should be a function', function () {
      Server.should.be.a.function;
    });

    it ( 'should have prototypes', function () {
      Server.prototype.should.be.an.Object;
      Server.prototype.constructor.name.should.equal('BooServer');
    });

    it ( 'should have a create method', function () {
      Server.prototype.create.should.be.a.Function;
    });

  });

  describe ( 'Server - Instance', function () {

    it ( 'should be an object', function () {
      server = new Server({ port: 3456 });
      server.should.be.an.Object;
    });

    it ( 'should be an instance of BooServer', function () {
      server.constructor.name.should.equal('BooServer')
    });

    it ( 'should have inherited from EventEmitter', function () {
      for ( var method in require('events').EventEmitter.prototype ) {
        server.should.have.property(method).which.is.a.Function;
      }
    });

  });

  describe ( 'server - properties - address', function () {

    it ( 'should exist', function () {
      server.address.should;
    });

    it ( 'should an instance of Address', function () {
      server.address.should.be.an.instanceof(require('../lib/class/Address'));
    });

    it ( 'should have a property database which is a string and equals default database from config', function () {
      server.address.should.have.property('database')
        .which.is.a.String
        .and.equal(config.address.database);
    });

    it ( 'should have a property collection which is a string and equals default collection from config', function () {
      server.address.should.have.property('collection')
        .which.is.a.String
        .and.equal(config.address.collection);
    });

  });

  describe ( 'server - properties - databases', function () {

    it ( 'should exist', function () {
      server.databases.should;
    });

    it ( 'should be an object', function () {
      server.databases.should.be.an.Object;
    });

  });

  describe ( 'server - methods - create()', function () {

    var create;

    it ( 'should be a function', function () {
      server.create.should.be.a.Function;
    });

    it ( 'should return server; not have errors; emit a listening event', function (done) {
      create = server.create();
      
      create.constructor.name.should.equal('BooServer');
      
      create.on('error', done);

      create.on('listening', function () {
        done();
      });
    });

  });

  describe ( 'server - properties - service', function () {

    it ( 'should exist', function () {
      server.service.should;
    });

    it ( 'should be a #<Net> Server', function () {
      server.service.should.be.an.Object;
      server.service.constructor.name.should.equal('Server');
    });

  });

})();
