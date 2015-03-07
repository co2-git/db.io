db.io `alpha`
============


db.io is a database written in JavaScript with the following features:

- memory database
- tcp socket server
- event-driven (all clients get notified in real time of any watched events)

# Install

```bash
npm install co2-git/db.io
```

# Usage

```js

var db = require('db.io');

# Connect

// Create new client on collection "players"

client = db.client({ collection: 'players' });

// Create a new document

client.insert({ name: "Toni", score: 100, team: "red" });

// Update (increment Toni's score by 100)

client.update({ name: "Toni", $inc: { score: 100 } });

// Find Toni

client.find({ name: "Toni" });

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

    dbio://localhost:7000/boo-db/boo-sandbox

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

