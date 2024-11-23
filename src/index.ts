import { AddressInfo } from "net";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

import serveStatic from "serve-static";

import { createTable, joinTable } from "./utils/Lobby";

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

    ws.on('message', (message: string) => {
        console.log('Received message:', message);

        try {
            const jsonData = JSON.parse(message);
            if (jsonData.type === 'create_table') {
                let tableCode = createTable(jsonData.chips, jsonData.name);
                ws.send(JSON.stringify({ type: 'table_created', tableCode: tableCode }));

            } else if (jsonData.type === 'join_table') {
                joinTable(jsonData.tableCode, jsonData.chips, jsonData.name);
                ws.send(JSON.stringify({ type: 'table_joined', tableCode: jsonData.tableCode }));
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