// import BasePlayer from '../BasePlayer';
// import { Card, Suit, Value } from '../Card';

// // Mock generateUUID to have predictable results for testing
// jest.mock('../../utils/utils', () => ({
//     generateUUID: jest.fn(() => 'test-uuid'),
// }));

// describe('BasePlayer', () => {
//     let player: BasePlayer;

//     beforeEach(() => {
//         player = new BasePlayer();
//     });

//     it('should initialize with the correct attributes', () => {
//         expect(player.getId()).toBe('test-uuid'); // UUID is mocked
//         expect(player.getHand()).toHaveLength(0);
//         expect(player.isBust()).toBe(false);
//     });

//     it('should add a card to the hand', () => {
//         const newCard = new Card(Suit.Diamonds, Value.Seven);
//         player.receiveCard(newCard);
//         expect(player.getHand()).toHaveLength(1);
//         expect(player.getHand()).toContain(newCard);
//     });

//     it('should reset the hand', () => {
//         player.resetHand();
//         expect(player.getHand()).toHaveLength(0);
//     });

//     it('should calculate hand points correctly', () => {
//         player.receiveCard(new Card(Suit.Spades, Value.Seven));
//         player.receiveCard(new Card(Suit.Spades, Value.Three));
//         const points = player.calculateHand();
//         expect(points).toBe(10); 
//     });

//     it('should calculate hand with Aces correctly', () => {
//         player.receiveCard(new Card(Suit.Spades, Value.Seven));
//         player.receiveCard(new Card(Suit.Spades, Value.Three));
//         player.receiveCard(new Card(Suit.Clubs, Value.Ace)); 
//         const points = player.calculateHand();
//         expect(points).toBe(21); 
//     });

//     it('should correctly identify a bust', () => {
//         player.receiveCard(new Card(Suit.Spades, Value.Seven));
//         player.receiveCard(new Card(Suit.Spades, Value.Five));
//         player.receiveCard(new Card(Suit.Clubs, Value.King)); 
//         expect( player.isBust()).toBe(true);
//     });

//     it('should not bust with a safe hand', () => {
//         player.receiveCard(new Card(Suit.Spades, Value.Eight));
//         player.receiveCard(new Card(Suit.Hearts, Value.Seven));
//         expect(player.isBust()).toBe(false);
//     });
// });
