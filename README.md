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

var players = dbio.client('players');

// Get all players

players
  .toArray()
  .then(function (players) {});

// Insert player

players
  .push({ 'name': 'Toni' })
  .then(function (players) {});

// Get last player which name is Toni

players
  .toArray()
  .limit(1)
  .reverse()
  .filter(function (player) {
    return player.name === 'Toni';
  )
  .then(function (players) {});;
  
// Update player

players
  .limit(1)
  .reverse()
  .filter(function (player) {
    return player.name === 'Toni';
  )
  .map(function (player) {
    player.score += 100;
    
    return player;
  })
  .then(function (players) {});

// Remove Toni if his score is below 1000

players
  .limit(1)
  .reverse()
  .filter(function (player) {
    return player.name === 'Toni' && score < 100;
  )
  .remove()
  .then(function (players) {});
```
# Command Line

We ship with a command line utility:

```bash
npm install -g db.io

$ dbio push players '{"test":"foo"}'
  server: dbio://localhost:7000
  message: players pushed
  data:
    0: {"test":"foo"}

$ dbio toArray players limit=10
  server: dbio://localhost:7000
  message: players toArray
  length: 1
  data:
    0: {"test":"foo"}

$ dbio pull players 0
```
