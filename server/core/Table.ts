import { broadcast2TablePlayers, broadcast2All } from "@event/Notifier";
import { ERROR, generateUUID } from "@utils/utils";
import { Card, Value } from "./Card";
import Dealer from "./Dealer";
import Deck from "./Deck";
import Player from "./Player";
import PublishSubscribe from "@event/PublishSubscribe";

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
    

    constructor(code: string) {
        this.id = generateUUID();
        this.dealer = new Dealer(code);
        this.code = code;

        this.pubSub.subscribe(`table/:tableCode/player/joined/`, (data: any) => {
            const { tableCode, message } = data;
            broadcast2TablePlayers(tableCode, message);
        });
        this.pubSub.subscribe(`table/:tableCode/start/`, (data: any) => {
            const { tableCode, message } = data;
            broadcast2TablePlayers(tableCode, message);
        });
    }

    public getPlayer(i: number): Player {
        return this.players[i];
    }

    public playerInfo(i: number) {
        return this.players[i].toString();
    }

    public addPlayer(player: Player): void {
        if (this.players.length >= 5) {
            throw new Error(ERROR.ROOM_FULL);
        }
        this.players.push(player);

        // Subscribe to the player's events
        this.pubSub.publish(`table/${this.code}/player/joined/`, {
            tableCode: this.code, 
            message: player.name,
        });
    }

    public startGame(): void {
        this.status = TableStatus.GOING;
        this.deck = new Deck();
        this.hands = [];
        this.isBusted = [false, false, false, false, false];
        this.points = [0, 0, 0, 0, 0];
        this.round = 0;

        this.pubSub.publish(`table/${this.code}/start/`, {
            tableCode: this.code,
            message: this.getTableData(),
        });
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

        } else if (this.round === 2) {
            // Dealer receives the second card in second round
            let card = this.deck.drawCard()
            this.dealer.receiveCard(card);
            this.hands[0] = [...this.hands[0], card];


            // Dealer receives cards until the value is at least 17s
            while (this.dealer.shouldHit()) {
                card = this.deck.drawCard()
                this.dealer.receiveCard(card);
                this.hands[0] = [...this.hands[0], card];

            }

            this.calculatePoints();
            this.status = TableStatus.CLOSED;
            
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