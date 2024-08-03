// Keep track of our socket connection
var socket = require("socket.io");

function initClient() {
  // Start a socket connection to the server
  // TODO: Set up server hosting
  socket = io.connect("http://localhost:3000");

  // Socket receivers
  socket.on(
    "line_start",
    // When we receive data
    function (data) {
      console.log(
        "Got line_start: " + data.x_pos + " " + data.y_pos + " " + data.line_id
      );
      drawLineStart(data.x_pos, data.y_pos, data.line_id);
    }
  );
  socket.on(
    "line_move",
    // When we receive data
    function (data) {
      console.log(
        "Got line_move: " + data.x_pos + " " + data.y_pos + " " + data.line_id
      );
      drawLineMove(data.x_pos, data.y_pos, data.line_id);
    }
  );
  socket.on(
    "line_end",
    // When we receive data
    function (data) {
      console.log("Got line_end: " + data.line_end);
      lineEnd();
    }
  );
  socket.on(
    "erase_start",
    // When we receive data
    function (data) {
      console.log("Got erase_start: " + data.x_pos + " " + data.y_pos);
      eraseLineStart(data.x_pos, data.y_pos);
    }
  );
  socket.on(
    "erase_move",
    // When we receive data
    function (data) {
      console.log("Got erase_move: " + data.x_pos + " " + data.y_pos);
      eraseLineMove(data.x_pos, data.y_pos);
    }
  );
  socket.on(
    "erase_end",
    // When we receive data
    function (data) {
      console.log("Got erase_move: " + data.erase_end);
      eraseLineEnd();
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

function sendLineMove(x_pos, y_pos, line_id) {
  console.log("sendLineMove: " + x_pos + " " + y_pos + " " + line_id);

  var data = {
    x_pos: x_pos,
    y_pos: y_pos,
    line_id: line_id,
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

function sendEraseStart(x_pos, y_pos) {
  console.log("sendEraseStart: " + x_pos + " " + y_pos);

  var data = {
    x_pos: x_pos,
    y_pos: y_pos,
  };

  // Send data to the socket
  socket.emit("erase_start", data);
}

function sendEraseMove(x_pos, y_pos) {
  console.log("sendEraseMove: " + x_pos + " " + y_pos);

  var data = {
    x_pos: x_pos,
    y_pos: y_pos,
  };

  // Send data to the socket
  socket.emit("erase_move", data);
}

function sendEraseEnd() {
  console.log("sendEraseEnd: ");

  var data = { erase_end: true };

  // Send data to the socket
  socket.emit("erase_end", data);
}
