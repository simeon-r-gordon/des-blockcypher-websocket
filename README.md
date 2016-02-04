## Synopsis

This is a simple wrapper for the blockcypher.com Websocket API. The goal is to make a simple way for Meteor apps to listen to transaction and wallet info from BlockCypher's different networks.

A pseudo-extension of the blockchain.info websocket package by Joshua Rossi. (https://github.com/joshuarossi)
(https://github.com/joshuarossi/meteor.blockchain.info.websocket/)

## Installation
```
meteor add des:blockcypher-websocket

```
# Overview
Create some routes in a client/server JavaScript file with a fibers future for synchronous websocket activities:
First you will create a new instance of the Blockchain object:
```javascript
//default to /bcy/test network
var bc = new BlockCypherSocket();
//otherwise specify your own (eg '/btc/main');
var bc = new BlockCypherSocket(<network>);
```
Then you will connect to the websocket feed:
```javascript
bc.connect();
```
Now you can listen for transaction confirmation involving a given Bitcoin address:
```javascript
bc.subscribeToConfirmedTX(<bitcoin_address>)
```
Or you could subscribe to all confirmations:
```javascript
bc.subscribeToAllConfirmed()
```
Or you could subscribe to ALL transactions:
```javascript
bc.subscribeToAllTransactions()
```
To keep the connection alive, just ping:
```javascript
// Once
bc.ping();
// Continually every 10s
setInterval(function(){bc.ping()}, 10000);
```
To implement more than console logging messages and triggering the object future (save to db, trigger other actions) you can override the "messageHandler" function, here is the current code:
```javascript
bc.messageHandler = function(message){
    if (message.type === 'utf8') {
        console.log("> "+ message.utf8Data);
        this.tx = JSON.parse(message.utf8Data);
        if(! message.utf8Data.includes("pong")){
          this.ready.return(message);
        }
    } else {
      console.log(message);
      this.tx = JSON.parse(message.data);
      this.ready.return(message);
    }
  };
```

Here is an example of the listener I use to wait until a transaction just published has been confirmed
```javascript
	// Load future from fibers
  var Future = Npm.require("fibers/future");
  console.log("---------listening---------");
  var bc = new BlockCypherSocket();

  //connect and wait
  bc.connect();
  var fut_connection = bc.ready;
  var myVar = setInterval(function(){bc.ping()}, 10000);

  setTimeout(function(){
    console.log("---------subscribing---------");
    bc.subscribeToConfirmedTX(invoice.multisig_addr);
  }, 3000);

  //wait for future and then stop the repeating ping
  fut_connection.wait();
  clearInterval(myVar);

  bc.disconnect();
```