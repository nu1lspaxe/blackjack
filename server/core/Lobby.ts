import Player from './Player';
import Table from './Table';
import { ERROR, generateTableCode } from '@utils/utils';

import WebSocket from 'ws';


// tables<TableCode, Table>
export const tables: Map<string, Table> = new Map(); 

export function createTable(ws: WebSocket, chips: number, name: string): string {
    const tableCode = generateTableCode();  
    const newPlayer = new Player(ws, tableCode, 1, chips, name);

    const table = new Table(tableCode);
    table.addPlayer(newPlayer);
    tables.set(tableCode, table);

    return tableCode;
}

export function joinTable(ws: WebSocket, tableCode: string, chips: number, name: string) {
    const table = tables.get(tableCode) ? tables.get(tableCode) : undefined;

    if (!table) {
        throw new Error(ERROR.INVALID_TABLE);
    }

    if (table.players.length >= 5) {
        throw new Error(ERROR.TABLE_FULL);
    }

    const newPlayer = new Player(ws, tableCode, table.players.length + 1, chips, name);
    table.addPlayer(newPlayer);

    return newPlayer.seat;
}

export function startTable(tableCode: string) {
    const table = tables.get(tableCode);

    if (!table) {
        throw new Error(ERROR.INVALID_TABLE);
    }

    table.players.forEach(player => {
        if (!player.readyStatus) {
            throw new Error(ERROR.NOT_READY);
        }
    });

    if (table) {
        table.startGame();
    }
}

export function updatePlayer(
    tableCode: string, 
    seat: number, 
    chips: number | null = null, 
    readyStatus: boolean | null = null
) {
    const table = tables.get(tableCode);
    if (!table) {
        throw new Error(ERROR.INVALID_TABLE);
    }
    const player = table?.getPlayer(seat);
    if (!player) {
        throw new Error(ERROR.INVALID_PLAYER);
    }

    if (chips) {
        player.setChips(chips);
    }

    if (readyStatus) {
        player.setReadyStatus(readyStatus);
    }

    return player.toString();
}