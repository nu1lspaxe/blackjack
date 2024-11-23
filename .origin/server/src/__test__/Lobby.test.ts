import { after } from 'node:test';
import { ERROR } from '../../utils/utils';
import { createTable, joinTable, tables } from '../Lobby';

jest.mock('../Lobby', () => {
    return {
        ...jest.requireActual('../Lobby'), 
        broadcast: jest.fn(), 
    };
});

describe('createTable', () => {

    it('should create a table with a unique table code and add the initial player', () => {
        const chips = 1000;
        const name = 'Player1';

        createTable(chips, name);

        expect(tables.size).toBe(1);

        const tableCode = Array.from(tables.keys())[0]; 
        const table = tables.get(tableCode);

        expect(table!.players.length).toBe(1);

        const player = table!.players[0];
        expect(player.chips).toBe(chips);
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
        
        createTable(chips, 'Player1');
        
        const tableCode = Array.from(tables.keys())[0]; 
        
        joinTable(tableCode, chips, name);
        
        // Ensure the table has 2 players
        const table = tables.get(tableCode);
        expect(table!.players.length).toBe(2);
        
        // Ensure the new player is added with the correct chips and name
        const newPlayer = table!.players[1];
        expect(newPlayer.chips).toBe(chips);
        expect(newPlayer.name).toBe(name);
    });

    it('should throw an error when trying to join a non-existent table', () => {
        const chips = 1000;
        const name = 'Player3';
        expect(() => joinTable('non-table-code', chips, name)).toThrowError(ERROR.INVALID_ROOM);
    });

    it('should throw an error when the table is full (5 players)', () => {
        const chips = 1000;

        createTable(chips, 'Player1');
        const tableCode = Array.from(tables.keys())[0]; 

        joinTable(tableCode, chips, 'Player2');
        joinTable(tableCode, chips, 'Player3');
        joinTable(tableCode, chips, 'Player4');
        joinTable(tableCode, chips, 'Player5');
        
        // Try adding a 6th player to the table
        expect(() => joinTable(tableCode, chips, 'Player6')).toThrowError(ERROR.ROOM_FULL);
    });
});
