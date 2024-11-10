import { Card, Value, Suit } from '../Card';

describe('Card Class', () => {
    test('should create a card with correct suit, value, and points', () => {
        const card = new Card(Suit.Hearts, Value.King);
        expect(card.suit).toBe(Suit.Hearts);
        expect(card.value).toBe(Value.King);
        expect(card.points).toBe(10);
    });
});
