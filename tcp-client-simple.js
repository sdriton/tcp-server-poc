const net = require('net');

// Specify the server address and port
const SERVER_ADDRESS = '127.0.0.1'; // Replace with your server's IP address or hostname
const SERVER_PORT = 3000; // Replace with the port your server is listening on

// Create a TCP socket and connect to the server
const client = net.createConnection({ host: SERVER_ADDRESS, port: SERVER_PORT }, () => {
  console.log(`Connected to server at ${SERVER_ADDRESS}:${SERVER_PORT}`);
});

// Handle data received from the server
client.on('data', (data) => {
  console.log(`Received data from server: ${data}`);
});

// Handle the connection being closed by the server
client.on('end', () => {
  console.log('Connection closed by the server');
});

// Handle errors
client.on('error', (err) => {
  console.error(`Socket error: ${err.message}`);
});

// Handle the connection being fully closed
client.on('close', () => {
  console.log('Connection fully closed');
});
