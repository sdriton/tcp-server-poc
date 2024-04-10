const net = require('net');
const EventEmitter = require('events');

// Define the TCP server hosts and ports
const SERVER_1_HOST = 'localhost';
const SERVER_1_PORT = 3000;
const SERVER_2_HOST = 'localhost';
const SERVER_2_PORT = 3001;

// Define the heartbeat interval in milliseconds
const HEARTBEAT_INTERVAL = 3000;

// Define the backoff parameters
const INITIAL_RECONNECT_DELAY = 1000; // in milliseconds
const MAX_RECONNECT_DELAY = 60000; // in milliseconds
const EXIT_APP_DELAY = 1000;

class DispatchReceiver extends EventEmitter {

    constructor(mp) {
        super();
        this.messageProcessor = mp;
        this.active = false;
        this.currentServerIndex = 0;
        this.servers = [
            { host: SERVER_1_HOST, port: SERVER_1_PORT },
            { host: SERVER_2_HOST, port: SERVER_2_PORT }
        ];
        this.connect();
    }

    connect() {
        if (!this.active) {
            this.active = true;
            this.currentServerIndex = Math.random() < 0.5 ? 0 : 1;
            this.connectToServer();
        }
    }

    connectToServer() {
        const server = this.servers[this.currentServerIndex];
        console.log(`Connecting to ${server.host}:${server.port}`);
        this.socket = net.createConnection(server.port, server.host);
        this.socket.setKeepAlive(true, 0);

        this.socket.on('connect', () => {
            console.log(`Connected to ${server.host}:${server.port}`);
            this.emit('connected');
            this.startHeartbeat();
        });

        this.socket.on('data', (data) => {
            console.log('Received data from server:', data.toString());
            // Handle received data from the server
            this.messageProcessor.processMessage(data.toString());
        });

        this.socket.on('error', (err) => {
            console.error(`Connection error to ${server.host}:${server.port}:`, err.message);
            this.reconnect();
        });

        this.socket.on('close', () => {
            console.log(`Connection to ${server.host}:${server.port} closed`);
            this.stopHeartbeat();
            this.reconnect();
        });
    }

    reconnect() {
        this.active = false;
        const reconnectDelay = Math.min(
            INITIAL_RECONNECT_DELAY * Math.pow(2, this.currentServerIndex),
            MAX_RECONNECT_DELAY
        );
        console.log(`Reconnecting in ${reconnectDelay} milliseconds...`);
        setTimeout(() => {
            this.currentServerIndex = (this.currentServerIndex + 1) % this.servers.length;
            this.connect();
        }, reconnectDelay);
    }

    startHeartbeat() {
        this.heartbeatInterval = setInterval(() => {
            if (this.socket && !this.socket.destroyed) {
                this.socket.write('Heartbeat');
            }
        }, HEARTBEAT_INTERVAL);
    }

    stopHeartbeat() {
        clearInterval(this.heartbeatInterval);
    }

    closeSocket(){
        this.stopHeartbeat();
        this.socket.destroy();
    }
}

class MessageProcessor {
    constructor(){
        // TODO: Initialization
        // this.count = count;
    }

    processMessage(message){
        // Process Message
        console.log("MessageProcessor processing message.");
        return message;
    }
}

// Create and run the TCP client
let messageProcessor = new MessageProcessor();
const dispatchReceiver = new DispatchReceiver(messageProcessor);



