import {wss} from '@api/index';
import { tables } from '@core/Lobby';


export function broadcast2All(message: string) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

export function broadcast2TablePlayers(tableCode: string, message: string) {
    let table = tables.get(tableCode);
    if (!table) {
        console.log(`Table ${tableCode} not found`);
        return;
    }
    console.log(`Broadcasting to table ${tableCode}`);
    console.log(message);
    table.players.forEach(player => {
        if (player._ws.readyState === WebSocket.OPEN) {
            player._ws.send(message);
        }
    });
}