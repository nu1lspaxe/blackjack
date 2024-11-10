import { Card, CardValue, Suit } from '../Card';
import Player from '../Player';

describe('Player Class', () => {
    let player: Player;

    beforeEach(() => {
        player = new Player('Alice', 0, 1, 100);
    });

    test('should initialize with correct properties', () => {
        expect(player.name).toBe('Alice');
        expect(player.appearanceID).toBe(0);
        expect(player.position).toBe(1);
        expect(player.getChips()).toBe(100);
    });

    test('should place a valid bet', () => {
        player.placeBet(50);
        expect(player.getChips()).toBe(50);
    });

    test('should throw an error for invalid bet amounts', () => {
        expect(() => player.placeBet(0)).toThrow('Invalid bet amount');
        expect(() => player.placeBet(200)).toThrow('Chips not enough');
    });

    test('should calculate points with cards correctly', () => {
        player.takeCard(new Card(Suit.Spades, CardValue.A));
        player.takeCard(new Card(Suit.Clubs, CardValue.Ten));
        expect(player.getPoints()).toBe(21);
    });

    test('should indicate if player is busted', () => {
        player.takeCard(new Card(Suit.Hearts, CardValue.K));
        player.takeCard(new Card(Suit.Diamonds, CardValue.Q));
        player.takeCard(new Card(Suit.Spades, CardValue.Three));
        expect(player.isBusted()).toBe(true);
    });

    test('should change appearance ID', () => {
        player.changeAppearance(1);
        expect(player.appearanceID).toBe(1);
        expect(() => player.changeAppearance(3)).toThrow('Invalid appearance ID'); // appearance ID was set to 0 or 1
    });

    test('should set and get ready status', () => {
        player.setReadyStatus(true);
        expect(player.getReadyStatus()).toBe(true);
    });

    test('should set and get stand status', () => {
        player.setStandStatus(true);
        expect(player.getStandStatus()).toBe(true);
    });

    test('should change position and validate range', () => {
        player.setPosition(2);
        expect(player.getPosition()).toBe(2);
        expect(() => player.setPosition(5)).toThrow('Invalid position');
    });
});
