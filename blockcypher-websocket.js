BlockCypherSocket = function(network){
  // Load future from fibers
  var Future = Npm.require("fibers/future");

  // default to block cypher testnet
  wsurl = '';
  if(typeof network !== "undefined"){
   wsurl = 'wss://socket.blockcypher.com/v1'+network;
  } else {
	 wsurl = 'wss://socket.blockcypher.com/v1/bcy/test';
  }
  console.log("-----------  "+wsurl+"   -----------")
	this.url = wsurl;
  this.WebSocketClient = Npm.require('websocket').client;
  this.client = new this.WebSocketClient();
  this.tx = undefined;
  this.ready = new Future();

  this.ping = function () {
    var message = JSON.stringify({"event":"ping"});
    if (this.client.connection.connected) {
      this.client.connection.send(message);
    }
  };
  this.subscribeToAllTransactions = function(){
    var message = JSON.stringify({"event":"unconfirmed-tx"});
    if (this.client.connection.connected) {
        this.client.connection.send(message);
    }
  };
  this.subscribeToAllConfirmed = function(){
    var message = JSON.stringify({"event":"confirmed-tx"});
    if (this.client.connection.connected) {
        this.client.connection.send(message);
    }
  };
  this.subscribeToConfirmedTX = function (address) {
    console.log("address")
    console.log("-------"+address+"-------")
    
    var message = JSON.stringify({"event": "confirmed-tx", "address": address, "token": "2a4ee8babacafe1ba93d312ca650af93"});
    if (this.client.connection.connected) {
      this.client.connection.send(message);
      console.log("message sent")
    } else {
      console.log("not connected yet")
    }
  };
  this.messageHandler = function(message){
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
  this.client.on('connectFailed', function(error) {
      console.log('Connect Error: ' + error.toString());
  });
  var _this = this;
  this.client.on('connect', function(connection) {
      this.connection = connection;
      console.log('WebSocket Client Connected');

      connection.on('error', function(error) {
          console.log("Connection Error: " + error.toString());
      });

      connection.on('close', function() {
          console.log('echo-protocol Connection Closed');
          // this.connect(wsurl);
          // this.subscribe();
      });
      connection.on('message', function(message) {
          _this.messageHandler(message);
      });
  });
  this.connect = function (){
    this.client.connect(this.url);
  };
  this.disconnect = function (){
    this.client.close();
  };
  
};
