import Table from '../Table';
import Player from '../Player';
import { ERROR, generateTableCode } from '../utils';
import WebSocket from 'ws';
import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import { AddressInfo } from 'net';


jest.mock('../Notifier', () => ({
    broadcast: jest.fn(),
}));

describe('Table', () => {
    let table: Table;
    let player1: Player;
    let player2: Player;
    let player3: Player;
    let player4: Player;
    let player5: Player;
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

    beforeEach(() => {
        table = new Table(generateTableCode());
        for (let i = 0; i < 5; ++i) {
            let player = new Player(ws, "", i+i, 1000, 'Player_'+i);
            table.addPlayer(player);
        }
    });

    describe('startGame', () => {
        it('should start the game and initialize necessary properties', () => {
            table.startGame();

            expect(table.status).toBe('going');
            expect(table.getDeck()).toBeDefined();
            expect(table.hands).toEqual([]);
            expect(table.isBusted).toEqual([false, false, false, false, false]);
            expect(table.points).toEqual([0, 0, 0, 0, 0]);
            expect(table.round).toBe(0);
        });
    });

    describe('nextRound', () => {
        it('should deal cards correctly in the first round', () => {
            table.startGame();
            table.nextTurn(); // dealer's turn

            for (let i = 0; i < table.getPlayerLen(); i++) { // player's turn
                table.nextTurn();
            }

            expect(table.round).toBe(1);
            expect(table.hands[0].length).toBe(1);  // Dealer's hand

            for (let i = 0; i < table.getPlayerLen(); i++) {
                expect(table.players[i].getHand().length).toBe(2);
            }

            for (let i = 1; i < table.getPlayerLen() + 1; i++) {
                expect(table.hands[i].length).toBe(2);
            }

        });

        it('should deal cards correctly in the second round and calculate points', () => {
            table.startGame();
            // round 1
            table.nextTurn(); // dealer's turn
            for (let i = 0; i < table.getPlayerLen(); i++) { // player's turn
                table.nextTurn();
            }

            while (table.status === 'going') { // dealer's 2nd turn
                table.nextTurn();
            }

            expect(table.hands[0].length).toBeGreaterThanOrEqual(2); // Dealer receives at least 2 cards
            expect(table.status).toBe('end');
            expect(table.points).toEqual(expect.arrayContaining([expect.any(Number)])); // Points should be calculated
        });

        it('should throw an error for invalid rounds', () => {
            table.startGame();

            expect(() => {
                table.nextTurn(); // dealer's turn
                for (let i = 0; i < table.getPlayerLen(); i++) { // player's turn
                    table.nextTurn();
                }
    
                while (table.status === 'going') { // dealer's 2nd turn
                    table.nextTurn();
                }

                table.nextTurn();  // Invalid round
            }).toThrowError(ERROR.INVALID_VALUE);
        });
    });

    describe('Player management', () => {
        it('should throw an error when trying to add more than 5 players', () => {
            const newPlayer = new Player(ws, "", 6, 1000, 'Player_6');
            expect(() => table.addPlayer(newPlayer)).toThrowError(ERROR.TABLE_FULL);
        });
    });

    describe('calculatePoints', () => {
        it('should calculate points for dealer and players', () => {
            table.startGame();
            table.nextTurn(); // dealer's turn

            for (let i = 0; i < table.getPlayerLen(); i++) {
                table.nextTurn(); // player's turn
            }
            table.calculatePoints();
            
            expect(table.points[0]).toBeGreaterThan(0); // Dealer's points
            table.points.slice(1).forEach(point => {
                expect(point).toBeGreaterThan(0); // Players' points
            });
        });
    });

    describe('getTableData', () => {
        it('should return correct table data', () => {
            table.startGame();

            const tableData = table.getTableData();

            // expect(tableData.id).toBe(table.id);
            expect(tableData.status).toBe(table.status);
            expect(tableData.hands).toEqual(table.hands);
            expect(tableData.isBusted).toEqual(table.isBusted);
            expect(tableData.points).toEqual(table.points);
        });
    });
});
