# tcp-server-poc

This is a sample nodejs application that connects to two tcp server instances running in active-standby mode.

## Run two instances of the server:
````
node tcp-server.js 3000
node tcp-server.js 3001
````

## Run the client:
````
node tcp-client-bimode.js
````



