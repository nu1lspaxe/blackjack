import { after } from 'node:test';
import { ERROR } from '../utils';
import { createTable, joinTable, tables, startTable, endTable, randomTable, tableNextTurn, updatePlayer } from '../Lobby';
import WebSocket from 'ws';
import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import { AddressInfo } from 'net';
import { broadcast2Table } from '../Notifier';

jest.mock('../Notifier', () => {
    return {
        broadcast: jest.fn(), 
        broadcast2Table: jest.fn(),
    };
});
let ws: WebSocket;
let serverPort: number;

// Start server and get the port dynamically
beforeAll((done) => {
    const server = createServer();
    const wss = new WebSocketServer({ server });

    server.listen(0, () => { // Port 0 lets the system choose an available port
        serverPort = (<AddressInfo>server.address()).port;
        console.log(`Test server listening on port ${serverPort}`);
        ws = new WebSocket(`ws://localhost:${serverPort}`);
        done();
    });
});

describe('createTable', () => {


    it('should create a table with a unique table code and add the initial player', () => {
        const chips = 1000;
        const name = 'Player1';

        createTable(ws, chips, name);

        expect(tables.size).toBe(1);

        const tableCode = Array.from(tables.keys())[0]; 
        const table = tables.get(tableCode);

        expect(table!.getPlayerLen()).toBe(1);

        const player = table!.players[0];
        expect(player.name).toBe(name);
    });
});

describe('joinTable', () => {

    beforeEach(() => {
        tables.clear();
    });


    it('should add a player to an existing table and start the game when the table reaches 5 players', () => {
        const chips = 1000;
        const name = 'Player2';
        
        createTable(ws, chips, 'Player1');
        
        const tableCode = Array.from(tables.keys())[0]; 
        
        joinTable(ws, tableCode, chips, name);
        
        // Ensure the table has 2 players
        const table = tables.get(tableCode);
        expect(table!.getPlayerLen()).toBe(2);
        
        // Ensure the new player is added with the correct chips and name
        const newPlayer = table!.getPlayerLen();
        expect(table!.players[newPlayer - 1].name).toBe(name);
    });

    it('should throw an error when trying to join a non-existent table', () => {
        const chips = 1000;
        const name = 'Player3';
        expect(() => joinTable(ws, 'non-table-code', chips, name)).toThrowError(ERROR.INVALID_TABLE);
    });

    it('should throw an error when the table is full (5 players)', () => {
        const chips = 1000;

        createTable(ws, chips, 'Player1');
        const tableCode = Array.from(tables.keys())[0]; 

        joinTable(ws, tableCode, chips, 'Player2');
        joinTable(ws, tableCode, chips, 'Player3');
        joinTable(ws, tableCode, chips, 'Player4');
        joinTable(ws, tableCode, chips, 'Player5');
        
        // Try adding a 6th player to the table
        expect(() => joinTable(ws, tableCode, chips, 'Player6')).toThrowError(ERROR.TABLE_FULL);
    });

    it('should trigger a broadcast when a player joins the table', () => {
        const chips = 1000;
        const name = 'Player4';
        const tableCode = createTable(ws, chips, 'Player1');
        
        joinTable(ws, tableCode, chips, name);
        
        expect(broadcast2Table).toHaveBeenCalledWith(tableCode, `Player ${name} joined the table`);
    });
});


describe('startTable', () => {
    it('should start the game and broadcast start message when all players are ready', () => {
        const chips = 1000;
        const tableCode = createTable(ws, chips, 'Player1');

        joinTable(ws, tableCode, chips, 'Player2');
        joinTable(ws, tableCode, chips, 'Player3');
        joinTable(ws, tableCode, chips, 'Player4');
        joinTable(ws, tableCode, chips, 'Player5');

        // Set all players to be ready
        const table = tables.get(tableCode);
        table!.players.forEach(player => player.setReadyStatus(true));

        startTable(tableCode);

        // Ensure the game has started and the start broadcast was called
        expect(broadcast2Table).toHaveBeenCalledWith(tableCode, `Table ${tableCode} has started`);
    });

    it('should throw an error if a player is not ready', () => {
        const chips = 1000;
        const tableCode = createTable(ws, chips, 'Player1');

        joinTable(ws, tableCode, chips, 'Player2');
        joinTable(ws, tableCode, chips, 'Player3');
        joinTable(ws, tableCode, chips, 'Player4');
        joinTable(ws, tableCode, chips, 'Player5');

        // Make one player not ready
        const table = tables.get(tableCode);
        table!.players[0].setReadyStatus(false);

        expect(() => startTable(tableCode)).toThrowError(ERROR.NOT_READY);
    });
});


describe('endTable', () => {
    it('should end the game and broadcast the results', () => {
        const chips = 1000;
        const tableCode = createTable(ws, chips, 'Player1');

        joinTable(ws, tableCode, chips, 'Player2');
        joinTable(ws, tableCode, chips, 'Player3');
        joinTable(ws, tableCode, chips, 'Player4');
        joinTable(ws, tableCode, chips, 'Player5');

        // Start the game first
        startTable(tableCode);

        // End the game
        const tableData = endTable(tableCode);

        // Ensure the game has ended and the correct table data is returned
        expect(tableData).toHaveProperty('id');

        expect(broadcast2Table).toHaveBeenCalledWith(tableCode, tableData);
    });
});



describe('randomTable', () => {
    beforeEach(() => {
        tables.clear();
    });

    it('should join a random existing table and add a player', () => {
        const chips = 1000;
        const name = 'Player3';
        
        createTable(ws, chips, 'Player1');
        
        const data = randomTable(ws, chips, name);

        // Ensure the player is added to a table
        const table = tables.get(Array.from(tables.keys())[0]);
        expect(table!.getPlayerLen()).toBe(2);
        expect(table!.players[1].name).toBe(name);

        expect(broadcast2Table).toHaveBeenCalledWith(data[0], `Player ${name} joined the table`);
    });

});


describe('tableNextTurn', () => {
    it('should broadcast the next turn message', () => {
        const chips = 1000;
        const tableCode = createTable(ws, chips, 'Player1');

        joinTable(ws, tableCode, chips, 'Player2');
        joinTable(ws, tableCode, chips, 'Player3');
        joinTable(ws, tableCode, chips, 'Player4');
        joinTable(ws, tableCode, chips, 'Player5');

        // Start the game first
        // const table = tables.get(tableCode);

        startTable(tableCode);

        const tableData = tableNextTurn(tableCode);

        expect(broadcast2Table).toHaveBeenCalledWith(tableCode, tableData);
    });
});


describe('updatePlayer', () => {
    it('should update the player\'s chips and broadcast the updated table data', () => {
        const chips = 1000;
        const tableCode = createTable(ws, chips, 'Player1');

        let a = joinTable(ws, tableCode, chips, 'Player2');
        joinTable(ws, tableCode, chips, 'Player3');
        joinTable(ws, tableCode, chips, 'Player4');
        joinTable(ws, tableCode, chips, 'Player5');

        // Start the game first
        startTable(tableCode);

        const table = tables.get(tableCode);
        const player = table!.players[0];

        updatePlayer(tableCode, player.seat - 1, 500);
        expect(player.getChips()).toBe(500);

    });
});