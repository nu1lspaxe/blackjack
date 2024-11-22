import { generateUUID } from "@utils/utils";
import { Card, Value } from "./Card";

class BasePlayer {
    private id: string;
    private hand: Card[] = [];  
    public name: string;

    constructor(name: string = "NoName") {
        this.id = generateUUID();
        this.name = name;
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

    public isBust(): boolean {
        return this.calculateHand() > 21;
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