import express, { Application } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { constants } from '@config/constants';
import { createTable, joinTable, startTable, updatePlayer } from '@core/Lobby';

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

    ws.on('message',  (message: string) => {

        try {
            const jsonData = JSON.parse(message);
            console.log('Received message:', jsonData);

            switch (jsonData.type) {
                case 'create_table':
                    let tableCode = createTable(ws, jsonData.chips, jsonData.name);
                    
                    ws.send(JSON.stringify({ type: 'table_created', tableCode: tableCode}));
                    break;

                case 'join_table':
                    let seat = joinTable(ws, jsonData.tableCode, jsonData.chips, jsonData.name);

                    ws.send(JSON.stringify({ 
                        type: 'table_joined', 
                        playerName: jsonData.name,
                        tableCode: jsonData.tableCode,
                        seat: seat,}));
                    break;

                case 'start_table':
                    startTable(jsonData.tableCode);
                    ws.send(JSON.stringify({ type: 'table_started', tableCode: jsonData.tableCode }));
                    break;

                case 'update_player':
                    let updatedInfo = updatePlayer(jsonData.tableCode, jsonData.chips, jsonData.name, jsonData.readyStatus);
                    ws.send(JSON.stringify({ type: 'player_updated', playerInfo: updatedInfo}));
                    break;
                
                default:
                    throw new Error('Invalid message type');
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