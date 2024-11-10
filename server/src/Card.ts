enum Suit {
    Hearts = 'Hearts',
    Diamonds = 'Diamonds',
    Clubs = 'Clubs',
    Spades = 'Spades'
}

enum Value {
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K',
    Ace = 'A'
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
}

export { Card, Suit, Value as Value };