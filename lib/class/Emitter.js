! function () {
  
  'use strict';

  function Emitter () {
  }

  require('util').inherits(Emitter, require('events').EventEmitter);

  Emitter.prototype.then = function then (success, failure) {
    this.on('success', success);
    
    if ( failure ) {
      this.on('error', failure);
    }
  };

  module.exports = Emitter;

} ();
