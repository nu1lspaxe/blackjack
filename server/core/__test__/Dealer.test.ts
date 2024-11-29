// import Dealer from '../Dealer';
// import { Card, Suit, Value } from '../Card';
// import { generateUUID } from '../../utils/utils';

// jest.mock('../../utils/utils', () => ({
//     generateUUID: jest.fn(() => 'test-uuid'),
// }));

// describe('Dealer Class', () => {
//   let dealer: Dealer;

//   beforeEach(() => {
//     // Reset mock before each test
//     (generateUUID as jest.Mock).mockClear();
    
//     dealer = new Dealer();
//   });

//   it('should initialize with correct name and cards', () => {
//     expect(dealer.getId()).toBe('test-uuid');
//     expect(dealer.getHand()).toHaveLength(0);
//   });

//   it('should correctly calculate hand points with Ace', () => {
//     dealer.receiveCard(new Card(Suit.Diamonds, Value.Ace));
//     expect(dealer.calculateHand()).toBe(11);
//     expect(dealer.isBust()).toBe(false);
//   });


//   it('should determine to hit when hand value is less than 17', () => {
//     dealer.receiveCard(new Card(Suit.Diamonds, Value.Ace));
//     expect(dealer.shouldHit()).toBe(true);
//   });


//   it('should determine not to hit when hand value is greater than 17', () => {
//     dealer.receiveCard(new Card(Suit.Spades, Value.Ace)); 
//     dealer.receiveCard(new Card(Suit.Diamonds, Value.King));
//     expect(dealer.calculateHand()).toBe(21);
//     expect(dealer.shouldHit()).toBe(false); 
//   });
// });