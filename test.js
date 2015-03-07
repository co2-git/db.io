require('colors');

var Client = require('./lib/class/Client');

var client = new Client();

client.on('error', function (error) {
  error.stack.split(/\n/).map(function (stack) {
    console.log(stack.orange);
  });
});

client.on('disconnected', function () {
  console.log('client disconnected'.yellow);
});

client.on('connected', function () {
  console.log('client connected'.green);
});

client.on('listening', function () {
  console.log('server listening'.green);
});

client.on('client request', function () {
  console.log('client request'.cyan);
});

client.on('server response', function () {
  console.log('server response'.green);
});

client.insert()

  

// var insert = client.db().collection().insert({ foo: true });

// insert
//   .on('error', function (error) {
//     console.log({ 'insert error': error });
//   })

//   .on('inserted', function (error) {
//     console.log('inserted');

//     var find = client.db().collection().find();

//     find
//       .on('error', function (error) {
//         console.log({ 'find error': error });
//       })

//       .on('found', function (error) {
//         console.log('cool');
//       })

//       .on('empty', function (error) {
//         console.log('empty');
//       });
//   });
