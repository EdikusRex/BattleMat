// Keep track of our socket connection
var socket = require('socket.io');

function initClient() {
  // Start a socket connection to the server
  // TODO: Set up server hosting
  socket = io.connect("http://localhost:3000");

  // Socket receivers
  socket.on('line_start',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x_pos + " " + data.y_pos + " " + data.line_id);
      drawLineStart(data.x_pos, data.y_pos, data.line_id)
    }
  );
  socket.on('line_move',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x_pos + " " + data.y_pos + " " + data.line_id + " " + data.draw_mode);
      if (data.draw_mode == "erase") {
        eraseLineMove(data.x_pos, data.y_pos)
      } 
      drawLineMove(data.x_pos, data.y_pos, data.line_id)
    }
  );
  socket.on('line_end',
    // When we receive data
    function(data) {
      console.log("Got: " + data.line_end);
      lineEnd()
    }
  );
}

// Functions for sending data to the socket
function sendLineStart(x_pos, y_pos, line_id) {
  console.log("sendLineStart: " + x_pos + " " + y_pos + " " + line_id);

  var data = {
    x_pos: x_pos,
    y_pos: y_pos,
    line_id: line_id,
  };

  // Send data to the socket
  socket.emit("line_start", data);
}

function sendLineMove(x_pos, y_pos, line_id, draw_mode) {
  console.log(
    "sendLineMove: " + x_pos + " " + y_pos + " " + line_id + " " + draw_mode
  );

  var data = {
    x_pos: x_pos,
    y_pos: y_pos,
    line_id: line_id,
    draw_mode: draw_mode,
  };

  // Send data to the socket
  socket.emit("line_move", data);
}

function sendlineEnd() {
  console.log("sendLineEnd");

  var data = { line_end: true };

  // Send data to the socket
  socket.emit("line_end", data);
}
