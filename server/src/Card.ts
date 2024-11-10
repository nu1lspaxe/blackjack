enum Suit {
    Hearts = 'Hearts',
    Diamonds = 'Diamonds',
    Clubs = 'Clubs',
    Spades = 'Spades'
}

enum CardValue {
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    J = 'J',
    Q = 'Q',
    K = 'K',
    A = 'A'
}

class Card {
    public suit: Suit;
    public value: CardValue;
    public points: number;
    static readonly CardValuePoints: { [key in CardValue]: number } = {
        [CardValue.Two]: 2,
        [CardValue.Three]: 3,
        [CardValue.Four]: 4,
        [CardValue.Five]: 5,
        [CardValue.Six]: 6,
        [CardValue.Seven]: 7,
        [CardValue.Eight]: 8,
        [CardValue.Nine]: 9,
        [CardValue.Ten]: 10,
        [CardValue.J]: 10,
        [CardValue.Q]: 10,
        [CardValue.K]: 10,
        [CardValue.A]: 1, // Ace is initially to 1, deal with in getPoints() in Player
    };

    constructor(suit: Suit, value: CardValue) {
        this.suit = suit;
        this.value = value;
        this.points = Card.CardValuePoints[value];
    }
}

export { Card, Suit, CardValue };