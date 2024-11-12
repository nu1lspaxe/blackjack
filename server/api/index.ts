import express, { Application } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { constants } from '../config/constants';
import { createTable, joinTable } from '../src/Lobby';

const app: Application = express();

// Express setup
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Create an HTTP server and integrate it with Express
const server = createServer(app);

// Initialize WebSocket server using the same HTTP server
export const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('A client connected');

    ws.on('message', (message: string) => {
        console.log('Received message:', message);

        try {
            const jsonData = JSON.parse(message);
            if (jsonData.type === 'createRoom') {
                createTable(jsonData.chips, jsonData.name);
            } else if (jsonData.type === 'joinRoom') {
                joinTable(jsonData.roomId, jsonData.chips, jsonData.name);
            }
        } catch (error) {
            if (error instanceof Error) {
                ws.send(JSON.stringify({ type: 'error', message: error.message }));
            }
        }
    });

    ws.on('close', () => {
        console.log('A client disconnected');
    });
});

// Graceful shutdown for WebSocket server
function gracefulShutdown() {
    wss.close();
    server.close(() => {
        console.log('Server and WebSocket closed');
        process.exit(0);
    });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
server.listen(constants.PORT, () => {
    console.log(`Server ready on port ${constants.PORT}.`);
});


module.exports = app;