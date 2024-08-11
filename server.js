let port = 3000

// Using express: http://expressjs.com/
var express = require('express');
// Create the app
var app = express();

// Set up the server
var server = app.listen(port, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    socket.on('draw_line_start',
        function(data) {
          console.log("Received: 'draw_line_start' " + data.x_pos + " " + data.y_pos + " " +  data.line_id);
        
          // Send it to all other clients
          socket.broadcast.emit('draw_line_start', data);
        }
      );
      socket.on('draw_line_move',
        function(data) {
          console.log("Received: 'draw_line_move' " + data.x_pos + " " + data.y_pos + " " +  data.line_id);
        
          // Send it to all other clients
          socket.broadcast.emit('draw_line_move', data);
        }
      );
      socket.on('draw_line_end',
        function(data) {
          console.log("Received: 'draw_line_end' " + data.draw_line_end);
        
          // Send it to all other clients
          socket.broadcast.emit('draw_line_end', data);
        }
      );
      socket.on('erase_start',
        function(data) {
          console.log("Received: 'erase_start' " + data.x_pos + " " + data.y_pos);
        
          // Send it to all other clients
          socket.broadcast.emit('erase_start', data);
        }
      );
      socket.on('erase_move',
        function(data) {
          console.log("Received: 'erase_move' " + data.x_pos + " " + data.y_pos);
        
          // Send it to all other clients
          socket.broadcast.emit('erase_move', data);
        }
      );
      socket.on('erase_end',
        function(data) {
          console.log("Received: 'erase_end' " + data.erase_end);
        
          // Send it to all other clients
          socket.broadcast.emit('erase_end', data);
        }
      );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);