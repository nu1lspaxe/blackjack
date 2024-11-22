import Table from '../Table';
import Player from '../Player';
import Dealer from '../Dealer';
import { ERROR } from '../../utils/utils';


jest.mock('../../event/Notifier', () => ({
    broadcast: jest.fn(),
}));

describe('Table', () => {
    let table: Table;
    let player1: Player;
    let player2: Player;
    let player3: Player;
    let player4: Player;
    let player5: Player;

    beforeEach(() => {
        player1 = new Player(1, 1000, 'Player 1');
        player2 = new Player(2, 1000, 'Player 2');
        player3 = new Player(3, 1000, 'Player 3');
        player4 = new Player(4, 1000, 'Player 4');
        player5 = new Player(5, 1000, 'Player 5');

        table = new Table([player1, player2, player3, player4, player5]);
    });

    describe('startGame', () => {
        it('should start the game and initialize necessary properties', () => {
            table.startGame();

            expect(table.status).toBe('going');
            expect(table.deck).toBeDefined();
            expect(table.hands).toEqual([]);
            expect(table.isBusted).toEqual([false, false, false, false, false]);
            expect(table.points).toEqual([0, 0, 0, 0, 0]);
            expect(table.round).toBe(0);
        });
    });

    describe('nextRound', () => {
        it('should deal cards correctly in the first round', () => {
            table.startGame();
            table.nextRound();

            expect(table.round).toBe(1);
            expect(table.hands[0].length).toBe(1);  // Dealer's hand
            for (let i = 1; i < table.players.length; i++) {
                expect(table.hands[i].length).toBe(2);
            }
        });

        it('should deal cards correctly in the second round and calculate points', () => {
            table.startGame();
            table.nextRound();  // Round 1
            table.nextRound();  // Round 2

            expect(table.hands[0].length).toBeGreaterThanOrEqual(2); // Dealer receives at least 2 cards
            expect(table.status).toBe('closed');
            expect(table.points).toEqual(expect.arrayContaining([expect.any(Number)])); // Points should be calculated
        });

        it('should throw an error for invalid rounds', () => {
            table.startGame();

            expect(() => {
                table.nextRound();  // Round 1
                table.nextRound();  // Round 2
                table.nextRound();  // Invalid round
            }).toThrowError(ERROR.INVALID_VALUE);
        });
    });

    describe('getTableData', () => {
        it('should return correct table data as a string', () => {
            table.startGame();

            const tableData = table.getTableData();

            expect(tableData).toContain('"id":');
            expect(tableData).toContain('"status":"going"');
            expect(tableData).toContain('"hands":');
            expect(tableData).toContain('"isBusted":');
            expect(tableData).toContain('"points":');
        });
    });
});
