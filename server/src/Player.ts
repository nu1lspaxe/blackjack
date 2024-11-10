import { Card, CardValue } from './Card';

class Player {
    static readonly MAX_APPERANCE_ID = 2;

    public name: string;
    public appearanceID: number;
    public position: number;
    public readyStatus: boolean = false;
    public standStatus: boolean = false;

    private cards: Card[] = [];
    private chips: number;
    private currentBet: number;

    constructor(name: string, appearanceID: number, position: number, chips: number) {
        this.name = name;
        this.appearanceID = appearanceID;
        this.position = position;
        this.chips = chips;
        this.currentBet = 0;
    }

    public getChips(): number {
        return this.chips;
    }

    public placeBet(bet: number): void {
        if (bet <= 0) {
            throw new Error('Invalid bet amount');
        }
        if (bet > this.chips) {
            throw new Error('Chips not enough');
        }
        this.chips -= bet;
        this.currentBet = bet;
    }

    public winBet(odds: number): void {
        this.chips += this.currentBet * odds;
    }

    public loseBet(): void {
        this.chips -= this.currentBet;
    }

    public getPoints(): number {
        if (this.cards.length === 0) {
            return 0;
        }
        let points = 0;
        let aces = 0;

        for (let card of this.cards) {
            if (card.value === CardValue.A) {
                aces++;
            }
            points += card.points;
        }

        // count for aces
        while (points + 10 <= 21 && aces > 0) {
            points += 10;
            aces--;
        }

        return points;
    }

    public takeCard(card: Card): void {
        this.cards.push(card);
    }

    public isBusted(): boolean {
        return this.getPoints() > 21;
    }

    public changeAppearance(id: number): void {
        if (id < 0 || id >= Player.MAX_APPERANCE_ID) {
            throw new Error('Invalid appearance ID');
        }
        this.appearanceID = id;
    }

    public getReadyStatus(): boolean {
        return this.readyStatus;
    }

    public setReadyStatus(status: boolean): void {
        this.readyStatus = status;
    }

    public getPosition(): number {
        return this.position;
    }

    public setPosition(position: number): void {
        if (position < 0 || position >= 4) {
            throw new Error('Invalid position');
        }

        // TODO: check position empty
        if (false) {
            throw new Error('Position is already taken');
        }

        this.position = position;
    }

    public getStandStatus(): boolean {
        return this.standStatus;
    }

    public setStandStatus(status: boolean): void {
        this.standStatus = status;
    }
}


export default Player;