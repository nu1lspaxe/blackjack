import { ERROR } from '../utils';
import { Card, Value, Suit } from '../Card';
import Player from '../Player';
import WebSocket from 'ws';
import { createServer, Server } from 'http';
import { WebSocketServer } from 'ws';
import { AddressInfo } from 'net';


describe('Player Class', () => {
    let player: Player;
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
        player = new Player(ws, "test-code", 1, 100, "Alice");
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

    test('should place an insurance bet', () => {
        player.placeBet(50);
        expect(player.placeInsuranceBet()).toBe(true);
        expect(player.getChips()).toBe(25);
    });

    test('should calculate chips correctly when winning insurance', () => {
        player.placeBet(50);
        expect(player.placeInsuranceBet()).toBe(true);
        expect(player.getChips()).toBe(25);
        player.winInsurance();
        expect(player.getChips()).toBe(75);
    });

    test('should not place an insurance bet if not enough chips', () => {
        player.placeBet(100);
        expect(player.placeInsuranceBet()).toBe(false);
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
        player.setReadyStatus(false);
        player.toggleReadyStatus();
        expect(player.getReadyStatus()).toBe(true);
    });

    test('should set and get stand status', () => {
        player.stand();
        expect(player.standStatus).toBe(true);
    });

    test('should double down bet and calculate winnings correctly', () => {
        player.placeBet(50);
        expect(player.getChips()).toBe(50);
        expect(player.doubleDown()).toBe(true);
        expect(player.getChips()).toBe(0);
        expect(player.standStatus).toBe(true);

        player.winBet();
        expect(player.getChips()).toBe(100); // default multiplier is 1
    });

    test('should not double down if not enough chips', () => {
        player.placeBet(100);
        expect(player.doubleDown()).toBe(false);
        expect(player.getChips()).toBe(0);
    });

    test('should surrender and get half of the bet amount back', () => {
        player.placeBet(100);
        expect(player.getChips()).toBe(0);
        player.surrender();
        expect(player.getChips()).toBe(50);
    });

    test('should reset hand and status', () => {
        player.placeBet(50);
        player.receiveCard(new Card(Suit.Spades, Value.Seven));
        player.receiveCard(new Card(Suit.Hearts, Value.Three));
        player.setReadyStatus(false);
        player.stand();
        
        player.resetHandAndStatus();
        
        expect(player.getHand()).toHaveLength(0);
        expect(player.getReadyStatus()).toBe(false);
        expect(player.standStatus).toBe(false);
        expect(player.getChips()).toBe(50); // Bet reset to 0
    });

});
