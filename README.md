db.io `alpha`
============

`db.io` is a server/client database written in JavaScript with the following features:

- Memory database (data is stored in RAM)
- TCP socket server (fast socket connexion)
- Event-driven (all clients get notified in real time of any watched events)

# About

`db.io` is the on-the-go solution to create a database server. The database server uses TCP sockets and data is stored in the RAM as JSON and is cataloged under a database/collection structure. A client is provided to execute CRUD queries. The database server is emitting events so a client get be used as a listener.

# Use case

You can use `db.io` to easily share data between various threads. Each thread can execute queries and listen to other queries executed by other clients in realtime.

# Database design

Since this is very prototype-ish, data is stored in RAM as JSON objects. See it as a bucket of data. There is no ACID compliancy or other database-specific design.

# Data type

Data is saved via `JSON.stringify` so for example functions would not get saved. It has to be strict JSON:

```js
var client = require('db.io').client({ "bucket": "foo" });

client
  .push({
    "foo": 1,
    "bar": function () {}
  })
  .pushed(function (document) {
    console.log(document.foo); // 1
    console.log(document.bar); // undefined ("bar" did not get saved because it is a function)
  });
```

# Indexing

Also there is **no indexing** and **no unique id keys**.

# Install

```bash
npm install co2-git/db.io
```

# Usage

```js
var db = require('db.io');
```

# Connect

`db.io`'s server is a service listening on a port.

Contrary to other databases, you don't need to start the server. It will start by itself on the first query it receives from a client.

These are the informations needed by a client to connect to a server:

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| Server | String | The server domain name or IP address | `"localhost"` |
| Port | Number | The server port number | `7000` |
| Database | String | The database name | `"test"` |
| Collection | String | The collection name | `"test"` |

You can overwrite the default values passing a list of the properties you want to modify to the client. If for example you want to switch collection:

```js
// Create new client on collection "players"

client = db.client({ "collection": "players" });
```

## Insert

```js

client.insert({ "name": "Toni", "score": 100 });

// Update (increment Toni's score by 100)

client
  
  .update({ "name": "Toni" }, function (player) {
    player.score += 100;
    return player;
  });

// Find Tonis whose score is above 200

client.find({ "name": "Toni" });

// Increment each team red's players every time they have a new member

client.on('inserted', function (players) {

  // Find out how many of the new players are from team red
  
  var newMembers = players
    
    .filter(function (player) {
      return player.team === 'red';
    })
    
    .map(function (player) {
      return { $id: player.$id };
    });
  
  // Update each player of team red, except new ones
  
  if ( newMembers.length ) {
    client.update('players', {
      team: 'red',
      $id: { $not: newMembers },
      $inc: { score: ( 100 * newMembers.length ) } }); 
  }
});

```

# Connexion

`db.io` uses a URL format to identify connexions:

    dbio://<server>(:<port>)(/dbname(/collectionName))
    
Default address is:

    dbio://localhost:7000/test/test

# Server

boo server starts automatically when a client requires it.

```js
boo.client(); // will use default address
boo.client('dbio://app.com:9009'); // specify a diffent host and port
boo.client('test'); // will use default address but with "test" as database
boo.client('test/running'); // will use default address but with "test" as database and "running" as collection
boo.client(9876); // will use default address but with 9876 as port
boo.client({ host: 'app.com', port: 9009, database: 'test', collection: 'users'); // Use object for finer control
```

# Client

You can use boo module to statically create a new client, or called the Client library directly:

```js
var client = db.client();

// is the same than

var client = new (require('db.io/lib/class/Client'))();
```

# Query

Special queries are prefixed by a dollar sign `$` and injected into the regular query:

```js
// name is Joe and score is greater than 100

client.find({ name: 'Joe', score: function (score) {
  return score > 100;
}});
```

# Query filters

## Literal match

Any value other than 

```js
// name is Joe
client.find({ name: 'Joe' }); 

// score is 100
client.find({ score: 100 });
```

## Advanced query

A more advanced query can be passed via functions.

Can you guess what this query is doing?

```js
client.find({
  name: 
})
```

# Test

Tests are written in Mocha and shouldjs.

