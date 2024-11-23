import { broadcast } from "./Lobby";
import { ERROR, generateUUID } from "../utils/utils";
import { Card, Value } from "./Card";
import Dealer from "./Dealer";
import Deck from "./Deck";
import Player from "./Player";

enum TableStatus {
    OPEN = 'open',
    GOING = 'going',
    CLOSED = 'closed'
}

interface TableData {
    id: string;
    status: TableStatus;
    hands: Card[][];
    isBusted: boolean[];
    points: number[];
}


class Table {
    private id: string;
    private dealer: Dealer;
    public players: Player[];
    public hands: Card[][] = [];
    public isBusted!: boolean[];
    public points!: number[];

    public status: TableStatus = TableStatus.OPEN;
    public deck!: Deck;
    public round: number = 0;

    constructor(players: Player[]) {
        this.id = generateUUID();
        this.dealer = new Dealer();
        this.players = players;
    }

    public startGame(): void {
        this.status = TableStatus.GOING;
        this.deck = new Deck();
        this.hands = [];
        this.isBusted = [false, false, false, false, false];
        this.points = [0, 0, 0, 0, 0];
        this.round = 0;

        broadcast(this.getTableData());
    }

    public nextRound(): void {
        this.round++;

        if (this.round === 1) {
            // Deal the first card to the dealer
            let card = this.deck.drawCard();
            this.dealer.receiveCard(card);
            this.hands[0] = [card];

            // Deal two cards to each player
            for (let i = 0; i < 2; i++) {
                this.players.forEach(player => {
                    card = this.deck.drawCard();
                    player.receiveCard(card);
                    this.hands[player.seat] = [...(this.hands[player.seat] || []), card];
                });
            }
            broadcast(this.getTableData());

        } else if (this.round === 2) {
            // Dealer receives the second card in second round
            let card = this.deck.drawCard()
            this.dealer.receiveCard(card);
            this.hands[0] = [...this.hands[0], card];

            // Dealer receives cards until the value is at least 17s
            if (this.dealer.shouldHit()) {
                card = this.deck.drawCard()
                this.dealer.receiveCard(card);
                this.hands[0] = [...this.hands[0], card];
            }
            broadcast(this.getTableData());

            this.calculatePoints();
            this.status = TableStatus.CLOSED;
            broadcast(this.getTableData());

        } else {
            throw new Error(ERROR.INVALID_VALUE);
        }

    }

    public calculatePoints(): number[] {
        this.points[0] = this.dealer.calculateHand();
        this.players.forEach((player, index) => {
            this.points[index + 1] = player.calculateHand();
        });
        return this.points;
    }


    public getTableData(): string {
        let tableData: TableData = {
            id: this.id,
            status: this.status,
            hands: this.hands,
            isBusted: this.isBusted,
            points: this.points
        };
        return JSON.stringify(tableData);
    }

}

export default Table;   