import { WebSocketServer } from 'ws';
import { constants } from '../../config/constants';
import { ERROR } from '../../utils/utils';
import { Card, Value, Suit } from '../Card';
import Player from '../Player';


describe('Player Class', () => {
    let player: Player;

    beforeEach(() => {
        player = new Player(1, 100, "Alice");
    });

    test('should initialize with correct properties', () => {
        expect(player.name).toBe('Alice');
        expect(player.seat).toBe(1);
        expect(player.getChips()).toBe(100);
    });

    test('should place a valid bet', () => {
        player.placeBet(50);
        expect(player.getChips()).toBe(50);
    });

    test('should throw an error for invalid bet amounts', () => {
        expect(() => player.placeBet(0)).toThrow(ERROR.INVALID_VALUE);
        expect(() => player.placeBet(200)).toThrow(ERROR.INVALID_VALUE);
    });

    test('should calculate points with cards correctly', () => {
        player.resetHand();
        player.receiveCard(new Card(Suit.Spades, Value.Ace));
        player.receiveCard(new Card(Suit.Clubs, Value.Ten));
        expect(player.calculateHand()).toBe(21);
    });

    test('should indicate if player is busted', () => {
        player.receiveCard(new Card(Suit.Hearts, Value.King));
        player.receiveCard(new Card(Suit.Diamonds, Value.Queen));
        player.receiveCard(new Card(Suit.Spades, Value.Three));
        expect(player.isBust()).toBe(true);
    });

    test('should set and get ready status', () => {
        player.toggleReadyStatus();
        expect(player.readyStatus).toBe(true);
    });

    test('should set and get stand status', () => {
        player.stand();
        expect(player.standStatus).toBe(true);
    });
});
