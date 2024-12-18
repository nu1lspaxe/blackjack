enum Suit {
    Hearts = 'heart',
    Diamonds = 'diamond',
    Clubs = 'club',
    Spades = 'spade'
}

enum Value {
    Two = 'two',
    Three = 'three',
    Four = 'four',
    Five = 'five',
    Six = 'six',
    Seven = 'seven',
    Eight = 'eight',
    Nine = 'nine',
    Ten = 'ten',
    Jack = 'jack',
    Queen = 'queen',
    King = 'king',
    Ace = 'ace'
}

class Card {
    public suit: Suit;
    public value: Value;
    public points: number;
    static readonly Points: { [key in Value]: number } = {
        [Value.Two]: 2,
        [Value.Three]: 3,
        [Value.Four]: 4,
        [Value.Five]: 5,
        [Value.Six]: 6,
        [Value.Seven]: 7,
        [Value.Eight]: 8,
        [Value.Nine]: 9,
        [Value.Ten]: 10,
        [Value.Jack]: 10,
        [Value.Queen]: 10,
        [Value.King]: 10,
        [Value.Ace]: 11,
    };

    constructor(suit: Suit, value: Value) {
        this.suit = suit;
        this.value = value;
        this.points = Card.Points[value];
    }

    public toString(): string {
        return `${this.value} ${this.suit}`;
    }
}

export { Card, Suit, Value as Value };