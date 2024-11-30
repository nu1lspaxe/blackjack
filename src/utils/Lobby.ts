import PublishSubscribe from './PublishSubscribe';
import Player from './Player';
import Table from './Table';
import { ERROR, generateTableCode } from './utils';

import WebSocket from 'ws';


// tables<TableCode, Table>
export const tables: Map<string, Table> = new Map();

const pubSub = PublishSubscribe.getInstance();

export function createTable(
    ws: WebSocket,
    chips: number,
    name: string
): string {
    const tableCode = generateTableCode();
    const newPlayer = new Player(ws, tableCode, 1, chips, name);

    const table = new Table(tableCode);
    tables.set(tableCode, table);

    table.addPlayer(newPlayer);
    // Subscribe to the player's events
    pubSub.publish(`table/${tableCode}/player/joined/`, {
        tableCode: tableCode,
        message: `Player ${newPlayer.name} joined the table`,
    });

    return tableCode;
}

export function randomTable(
    ws: WebSocket,
    chips: number, 
    name: string
): [string, number] {
    const randomIdx = Math.floor(Math.random()*tables.size);
    const tableCode = Array.from(tables.keys())[randomIdx];

    const table = tables.get(tableCode);
    const newPlayer = new Player(ws, tableCode, table!.players.length + 1, chips, name);
    table!.addPlayer(newPlayer);

    pubSub.publish(`table/${tableCode}/player/joined/`, {
        tableCode: tableCode,
        message: `Player ${newPlayer.name} joined the table`,
    });

    return [tableCode, newPlayer.seat];
}

export function joinTable(
    ws: WebSocket,
    tableCode: string,
    chips: number,
    name: string
) {
    const table = tables.get(tableCode) ? tables.get(tableCode) : undefined;

    if (!table) {
        throw new Error(ERROR.INVALID_TABLE);
    }

    if (table.players.length >= 5) {
        throw new Error(ERROR.TABLE_FULL);
    }

    const newPlayer = new Player(ws, tableCode, table.players.length + 1, chips, name);
    table.addPlayer(newPlayer);

    pubSub.publish(`table/${tableCode}/player/joined/`, {
        tableCode: tableCode,
        message: `Player ${newPlayer.name} joined the table`,
    });

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

        pubSub.publish(`table/${tableCode}/start/`, {
            tableCode: tableCode,
            message: `Table ${tableCode} has started`,
        });
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

export function tableNextTurn(tableCode: string) {
    const table = tables.get(tableCode);
    if (!table) {
        throw new Error(ERROR.INVALID_TABLE);
    }

    let tableData = table.nextTurn();

    pubSub.publish(`table/${tableCode}/next/`, {
        tableCode: tableCode,
        message: tableData,
    });

    return tableData;
}

export function endTable(tableCode: string) {
    const table = tables.get(tableCode);
    if (!table) {
        throw new Error(ERROR.INVALID_TABLE);
    }
    table.calculatePoints();

    pubSub.publish(`table/${tableCode}/end/`, {
        tableCode: tableCode,
        message: table.getTableData(),
    });

    tables.delete(tableCode);

    return table.getTableData();
}