import { Card } from '../Card';
import Deck from '../Deck';

describe('Deck Class', () => {
    let deck: Deck;

    beforeEach(() => {
        deck = new Deck(); // Create a deck with the default of 6 sets of 52 cards each
    });

    test('should create a deck with 312 cards for the default 6 decks', () => {
        expect(deck.getDeckSize()).toBe(312);
    });

    test('should shuffle the deck', () => {
        const initialDeck = [...deck.getDeck()];
        deck.shuffle();
        const shuffledDeck = deck.getDeck();
        expect(shuffledDeck).not.toEqual(initialDeck);
    });

    test('should draw a card and decrease deck size', () => {
        const initialSize = deck.getDeckSize();
        const drawnCard = deck.drawCard();
        expect(drawnCard).toBeInstanceOf(Card);
        expect(deck.getDeckSize()).toBe(initialSize - 1);
    });

    test('should reset the deck to the original size (312 cards)', () => {
        deck.drawCard();
        deck.resetDeck();
        expect(deck.getDeckSize()).toBe(312);
    });
});
