import Player from './Player';
import Table from './Table';
import { ERROR, generateTableCode } from '../utils/utils';
import {wss} from '../api/index';

export function broadcast(message: string) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

export const tables: Map<string, Table> = new Map(); 

export function createTable(chips: number, name: string): string {
    const tableCode = generateTableCode();  
    const newPlayer = new Player(1, chips, name);

    const table = new Table([newPlayer]);
    tables.set(tableCode, table);

    console.log(`Table created with ID: ${tableCode}`);

    return tableCode;
}

export function joinTable(tableCode: string, chips: number, name: string) {
    const table = tables.get(tableCode) ? tables.get(tableCode) : undefined;

    if (!table) {
        throw new Error(ERROR.INVALID_ROOM);
    }

    if (table.players.length >= 5) {
        throw new Error(ERROR.ROOM_FULL);
    }

    const newPlayer = new Player(table.players.length + 1, chips, name);
    table.players.push(newPlayer);

    console.log(`Player ${name} joined table ${tableCode}`);

    if (table.players.length === 5) {
        table.startGame();
    }
}