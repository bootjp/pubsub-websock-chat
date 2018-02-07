"use strict";

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const DEFAULT_CHANNEL = 'general';

function server() {
  const redis = require("redis");
  const subClient = redis.createClient(6379, REDIS_HOST);
  const pubClient = redis.createClient(6379, REDIS_HOST);
  let clients = [ ];
  subClient.subscribe(DEFAULT_CHANNEL);

  subClient.on("message", function(_, msg) {
    clients.forEach(function(client) {
      client.sendUTF(msg);
    });
  });

  process.title = 'node-chat';

  const webSocketsServerPort = 1337;
  const webSocketServer = require('websocket').server;
  const http = require('http');
  //TODO: TO REDIS LIST TYPE!
  let history = [ ];


  /**
   * Helper function for escaping input strings
   */
  function htmlEntities(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  const colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
  // colors.sort(function(a,b) {
  //   return Math.random() > 0.5;
  // });
  /**
   * HTTP server
   */
  const server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
  });
  server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
  });
  /**
   * WebSocket server
   */
  const wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket
    // request is just an enhanced HTTP request. For more info
    // http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
  });


  wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    let connection = request.accept(null, request.origin);
    // we need to know client index to remove them on 'close' event
    let index = clients.push(connection) - 1;
    let userName = null;
    let userColor = null;

    // TODO GET REDIS
    if (history.length > 0) {

      connection.sendUTF(
        JSON.stringify({ type: 'history', data: history} ));
    }
    // user sent some message
    connection.on('message', function(message) {
      if (message.type !== 'utf8') {
        return true;
      }
      // first message sent by user is their name
      if (userName === null) {
        // remember user name
        userName = htmlEntities(message.utf8Data);
        // get random color and send it back to the user
        userColor = colors.shift();
        connection.sendUTF(
          JSON.stringify({ type:'color', data: userColor }));
        console.log((new Date()) + ' User is known as: ' + userName + ' with ' + userColor + ' color.');
      } else { // log and broadcast the message
        console.log((new Date()) + ' Received Message from ' + userName + ': ' + message.utf8Data);

        // we want to keep history of all sent messages
        let massage = {
          time: (new Date()).getTime(),
          text: htmlEntities(message.utf8Data),
          author: userName,
          color: userColor
        };
        history.push(massage);
        history = history.slice(-100);
        const json = JSON.stringify({ type:'message', data: massage });
        pubClient.publish(DEFAULT_CHANNEL, json);
      }
    });
    // user disconnected
    connection.on('close', function(connection) {
      if (userName !== false && userColor !== false) {
        console.log((new Date()) + " Peer "
          + connection.remoteAddress + " disconnected.");
        // remove user from the list of connected clients
        clients.splice(index, 1);
        // push back user's color to be reused by another user
        colors.push(userColor);
      }
    });
  });

}

server();


