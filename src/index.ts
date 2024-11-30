import { AddressInfo } from "net";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

import serveStatic from "serve-static";

import { createTable, endTable, joinTable, randomTable, startTable, tableNextTurn, updatePlayer } from "./utils/Lobby";

const server = createServer();

// Handle static resources
const staticResourceHandler = serveStatic("./public", { index: ["index.html"] });
server.addListener("request", function (req, res) {
    staticResourceHandler(req, res, function (err) {
        console.log(err);
    });
});

// Create 
const wsServer = new WebSocketServer({ server });

// Initialize WebSocket server using the same HTTP server
export const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('A client connected');

    ws.on('message',  (message: string) => {

        try {
            const jsonData = JSON.parse(message);
            console.log('Message from client:', jsonData);

            switch (jsonData.type) {
                case 'create_table':
                    var tableCode = createTable(ws, jsonData.chips, jsonData.name);
                    
                    ws.send(JSON.stringify({ type: 'table_created', tableCode: tableCode}));
                    break;

                case 'random_table':
                    var [tableCode, seat] = randomTable(ws, jsonData.chips, jsonData.name);

                    ws.send(JSON.stringify({ 
                        'type': 'table_joined', 
                        playerName: jsonData.name, 
                        tableCode: tableCode, 
                        seat: seat }));
                    break;

                case 'join_table':
                    var seat = joinTable(ws, jsonData.tableCode, jsonData.chips, jsonData.name);

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
                    var updatedInfo = updatePlayer(jsonData.tableCode, jsonData.chips, jsonData.name, jsonData.readyStatus);
                    ws.send(JSON.stringify({ type: 'player_updated', playerInfo: updatedInfo}));
                    break;

                case 'next_turn':
                    var tableData = tableNextTurn(jsonData.tableCode);
                    ws.send(JSON.stringify({ type: 'next_turn', tableData: tableData }));

                    if (tableData.status === 'end') {
                        tableData = endTable(jsonData.tableCode);
                        ws.send(JSON.stringify({ type: 'table_ended', tableCode: jsonData.tableCode }));
                    }
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
server.listen(process.env.PORT ?? 5000, () => {
    console.log(`Server ready on port ${(<AddressInfo>server.address()).port}.`);
});