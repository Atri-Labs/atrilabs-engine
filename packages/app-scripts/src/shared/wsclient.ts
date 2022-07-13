const socket = new WebSocket("ws://" + window.location.host);

// Connection opened
socket.addEventListener("open", function () {
  socket.send("[wsclient] Connected with dev server.");
});

// Listen for messages
socket.addEventListener("message", function (event) {
  if (event.data === "reload") window.location.href = window.location.href;
});
