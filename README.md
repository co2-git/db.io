db.io `alpha`
============

# Minimalistic database service

`db.io` is a server/client database written in JavaScript with the following features:

- Memory database (data is stored in RAM)
- TCP socket server (fast socket connexion)
- Event-driven (all clients get notified in real time of any watched events)

# About

`db.io` is the on-the-go solution to create a database server. The database server uses TCP sockets and data is stored in the RAM as JSON. A client is provided to execute CRUD queries. The database server is emitting events so a client get be used as a listener.

# Usage

```bash
npm install db.io
```

```js
var dbio = require('db.io');

var client = dbio.client();

// Get all players

client.toArray('players', function (error, players) {
  console.log(players);
});

// Insert player

client
  .push('players', { 'name': 'Toni' },
    function (error, player) {
      
      console.log(player);
      
      // { '_id': 1, 'name': 'Toni', '_created': Date }
    }
  );

// Get last player which name is Toni

client
  .toArray('players',
    
    {
      'limit':      1,
      'reverse':    true,
      'filter':     function (player) {
        return player.name === 'Toni';
      }
    },
    
    function (error, players) {
      //...
    }
  );
  
// Update player

client
  .map('players',
  
    {
      'filter': function (player) {
        return player.name === 'Toni';;
      }
    },
    
    function (player) {
      player.score += 100;
      return player;
    },
    
    function (error, players) {
      //...
    }
  );

// Remove Toni if his score is below 1000

client.pull('players',

  {
    'filter': function (player) {
      return player.name === 'Toni' && player.score < 1000;
    }
  },
  
  function (error, players) {
    //...
  }
);
```
