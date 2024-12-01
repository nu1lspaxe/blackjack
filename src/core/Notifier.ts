import {wss} from '../index';
import { tables } from './Lobby';


export function broadcast2All(message: string) {
    wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'broadcast_all', message: message }));
        }
    });
}

export function broadcast2Table(tableCode: string, message: string) {
    let table = tables.get(tableCode);
    if (!table) {
        console.log(`Table ${tableCode} not found`);
        return;
    }
    table.players.forEach(async (player) => {
        if (player._ws.readyState === WebSocket.OPEN) {
            player._ws.send(JSON.stringify({ type: 'broadcast_table', message: message }));
        }
    });
}