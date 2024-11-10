import { Card, CardValue, Suit } from "./Card";

class Deck {
    private cards: Card[] = [];
    private deckSize: number;

    constructor(deckSize: number = 6) {
        this.deckSize = deckSize;
        this.createDeck();
        this.shuffle();
    }

    private createDeck(): void {
        for (let i = 0; i < this.deckSize; i++) {
            for (let suit of Object.keys(Suit)) {
                for (let value of Object.keys(CardValue)) {
                    this.cards.push(new Card(Suit[suit as keyof typeof Suit], CardValue[value as keyof typeof CardValue]));
                }
            }
        }
        
    }

    // from GPT
    public shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    public drawCard(): Card | undefined {
        return this.cards.pop();
    }

    public getDeck(): Card[] {
        return this.cards;
    }

    public getDeckSize(): number {
        return this.cards.length;
    }

    public resetDeck(): void {
        this.cards = [];
        this.createDeck();
        this.shuffle();
    }
}

export default Deck;