import { generateUUID } from "../utils/utils";
import { Card, Value } from "./Card";

class BasePlayer {
    private id: string;
    private hand: Card[] = [];  
    private name: string;

    public isBusted: boolean = false;

    constructor(name: string, cards: Card[]) {
        this.id = generateUUID();
        this.name = name;
        this.hand = cards;
    }

    public getHand(): Card[] {
        return this.hand;
    }

    public getId(): string {
        return this.id;
    }

    public resetHand(): void {
        this.hand = [];
    }

    public receiveCard(card: Card): void {
        this.hand.push(card);
    }

    public checkBust(): boolean {
        this.isBusted = this.calculateHand() > 21;
        return this.isBusted;
    }

    public calculateHand(): number {
        let totalPoints = 0;
        let aceCount = 0;

        this.hand.forEach(card => {
            if (card.value === Value.Ace) {
                aceCount++;
            }
            totalPoints += card.points;
        });

        while (totalPoints > 21 && aceCount > 0) {
            totalPoints -= 10;
            aceCount--;
        }

        return totalPoints;
    }
}

export default BasePlayer;