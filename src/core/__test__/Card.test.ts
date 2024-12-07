import { Card, Value, Suit } from '../Card';

describe('Card Class', () => {
    test('should create a card with correct suit, value, and points', () => {
        const card = new Card(Suit.Hearts, Value.King);
        expect(card.suit).toBe(Suit.Hearts);
        expect(card.value).toBe(Value.King);
        expect(card.points).toBe(10);
    });

    test('should create a card with correct points for Ace', () => {
        const card = new Card(Suit.Spades, Value.Ace);
        expect(card.suit).toBe(Suit.Spades);
        expect(card.value).toBe(Value.Ace);
        expect(card.points).toBe(11);
    });

    test('should create a card with correct points for a numbered card', () => {
        const card = new Card(Suit.Diamonds, Value.Five);
        expect(card.suit).toBe(Suit.Diamonds);
        expect(card.value).toBe(Value.Five);
        expect(card.points).toBe(5);
    });

    test('should assign correct points based on the card value', () => {
        const values: Value[] = [
            Value.Two, Value.Three, Value.Four, Value.Five, Value.Six,
            Value.Seven, Value.Eight, Value.Nine, Value.Ten, Value.Jack,
            Value.Queen, Value.King, Value.Ace
        ];
        
        values.forEach(value => {
            const card = new Card(Suit.Hearts, value);
            expect(card.points).toBe(Card.Points[value]);
        });
    });

    test('should return correct string representation of the card', () => {
        const card = new Card(Suit.Clubs, Value.Jack);
        expect(card.toString()).toBe('J Clubs');
    });

    test('should create a card with correct suit for Spades', () => {
        const card = new Card(Suit.Spades, Value.Ten);
        expect(card.suit).toBe(Suit.Spades);
    });
});
