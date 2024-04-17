const net = require('net');
const fs = require("fs");

// Run program:
// node tcp-server.js 3001

const port = process.argv[2];

// Create a TCP server
const server = net.createServer((socket) => {
  // New client connected
  console.log('Client connected');

  // Send data to the client every second
  const intervalId = setInterval(() => {
    const fileContent = fs.readFileSync("results.json");
    // const data = 'Hello, client!\r\n';
    const data = fileContent + "\r\n";
    socket.write(data);
  }, 1000);

  // Handle data received from the client
  socket.on('data', (data) => {
    console.log(`Received data from client: ${data}`);
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
    clearInterval(intervalId); // Stop sending data when client disconnects
  });

  // Handle errors
  socket.on('error', (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

// Listen on a specific port
const PORT = port || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
