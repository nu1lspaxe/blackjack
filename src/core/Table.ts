import { broadcast2Table } from "./Notifier";
import { ERROR, generateUUID } from "./utils";
import { Card, Value } from "./Card";
import Dealer from "./Dealer";
import Deck from "./Deck";
import Player from "./Player";
import PublishSubscribe from "./PublishSubscribe";

enum TableStatus {
    OPEN = 'open',
    GOING = 'going',
    END = 'end'
}

interface TableData {
    id: string;
    status: TableStatus;
    hands: Card[][];
    isBusted: boolean[];
    points: number[];
    playersName: string[];
    playersSeat: number[];
}


class Table {
    private pubSub = PublishSubscribe.getInstance();

    private id: string;
    public status: TableStatus = TableStatus.OPEN;
    public hands: Card[][] = [];
    public isBusted!: boolean[];
    public points!: number[];

    private code: string;
    private dealer: Dealer;
    public players: Player[] = [];
    private deck!: Deck;
    public round: number = 0;

    // 0: dealer, 1-5: players
    private currSeat: number = 0;

    constructor(code: string) {
        this.id = generateUUID();
        this.dealer = new Dealer(code);
        this.code = code;

        this.pubSub.subscribe(`table/${this.code}/player/joined/`, (data: any) => {
            const { tableCode, message } = data;
            broadcast2Table(tableCode, message);
        });
        this.pubSub.subscribe(`table/${this.code}/start/`, (data: any) => {
            const { tableCode, message } = data;
            broadcast2Table(tableCode, message);
        });
        this.pubSub.subscribe(`table/${this.code}/next/`, (data: any) => {
            const { tableCode, message } = data;
            broadcast2Table(tableCode, message);
        });
        this.pubSub.subscribe(`table/${this.code}/end/`, (data: any) => {
            const { tableCode, message } = data;
            broadcast2Table(tableCode, message);
        });
    }

    public getPlayer(i: number): Player {
        return this.players[i];
    }

    public playerInfo(i: number) {
        return this.players[i].toString();
    }

    public addPlayer(player: Player): TableData {
        if (this.players.length >= 5) {
            throw new Error(ERROR.TABLE_FULL);
        }
        this.players.push(player);
        return this.getTableData();
    }

    public startGame(): TableData {
        this.status = TableStatus.GOING;
        this.deck = new Deck();
        this.hands = [];
        this.isBusted = [false, false, false, false, false];
        this.points = [0, 0, 0, 0, 0];
        this.round = 0;

        return this.getTableData();
    }

    public nextTurn(): TableData {
        if (this.currSeat === 0 && this.round < 2) {
            this.round++;
        }

        let card: Card;

        if (this.round === 1) {

            // Deal the first card to the dealer
            if (this.currSeat === 0) {
                this.dealer.resetHand();

                card = this.deck.drawCard();
                this.dealer.receiveCard(card);
                this.hands[0] = [card];

            } else {
                // Reset the player's hand and status
                this.players[this.currSeat - 1].resetHandAndStatus();

                // Deal two cards to the player
                for (let i = 0; i < 2; i++) {
                    card = this.deck.drawCard();
                    this.players[this.currSeat - 1].receiveCard(card);
                    this.hands[this.currSeat] = [...(this.hands[this.currSeat] || []), card];
                }
            }

            this.currSeat = (this.currSeat + 1) % 6;

        } else if (this.round === 2) {

            // Dealer receives the second card in second round, and
            // receives cards until the value is at least 17s
            if (this.dealer.getHand().length === 1 || this.dealer.shouldHit()) {
                card = this.deck.drawCard();
                this.dealer.receiveCard(card);
                this.hands[0] = [...this.hands[0], card];

                this.isBusted[0] = this.dealer.isBust();
                if (!this.dealer.shouldHit()) {
                    this.status = TableStatus.END;
                    this.round++;
                }
            // } else {
            //     this.status = TableStatus.END;
            }

        } else {
            throw new Error(ERROR.INVALID_VALUE);
        }

        return this.getTableData();
    }

    public calculatePoints(): number[] {
        this.points[0] = this.dealer.calculateHand();
        this.players.forEach((player, index) => {
            this.points[index + 1] = player.calculateHand();
        });

        return this.points;
    }

    public getTableData(): TableData {
        let tableData: TableData = {
            id: this.id,
            status: this.status,
            hands: this.hands,
            isBusted: this.isBusted,
            points: this.points,
            playersName: this.players.map(player => player.name),
            playersSeat: this.players.map(player => player.getSeat()),
        };
        return tableData;
    }

    public getPlayerLen(): number {
        return this.players.length;
    }

    public getDeck(): Deck {
        return this.deck;
    }
}

export default Table;   