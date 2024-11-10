import { Card, CardValue, Suit } from '../Card';

describe('Card Class', () => {
    test('should create a card with correct suit, value, and points', () => {
        const card = new Card(Suit.Hearts, CardValue.K);
        expect(card.suit).toBe(Suit.Hearts);
        expect(card.value).toBe(CardValue.K);
        expect(card.points).toBe(10);
    });
});
