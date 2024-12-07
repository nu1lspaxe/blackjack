import { OrderedEmiiter } from "../emitter";

interface TableInfo {
    playersName: string[];
    playersSeat: number[];
    hands: Card[][];
    status: "going" | "end" | "open";
}

interface Player {
    name: string;
    seat: number;
    readyStatus: boolean;
}

interface TableCreateMessage {
    tableCode: string;
}

interface TableJoinedMessage {
    tableCode: string;
    seat: number;
    table: { code: string, players: Player[] };
}

export interface Opponent {
    name: string;
    seat: number;
    hands: Card[];
}

export interface Card {
    suit: string;
    value: string;
    point: number;
}

type GameEventMap = {
    "connect": [connection: WebSocket],
    "disconnect": [],

    "table_created": [message: TableCreateMessage],
    "table_joined": [message: TableJoinedMessage],
    "broadcast_table": [message: { message: TableInfo }],

    "table_ended": [message: { tableCode: string }],

    "error": [message: any],
    "opponents": [opponents: Opponent[]],
    "next_turn": [tableData: any],

    "game_started": [status: boolean],
};

export const gameAgent = new class GameAgent extends OrderedEmiiter<GameEventMap> {

    private connection: WebSocket;
    public hosting: boolean = false;
    public roomCode: string | null = null;
    public playerName: string;
    public seat: number = -1;
    public hands: Card[] = [];

    public opponents: Opponent[];
    public dealer: Opponent;
    

    public readyStatus: boolean = false;

    public gameStarted: boolean = false;

    public get isConnecting(): boolean {
        return Boolean(this.connection);
    }

    constructor() {
        super();
        this.connection = new WebSocket('ws://localhost:5000');

        this.connection.addEventListener('message', event => {
            const message = JSON.parse(event.data);
            const { type } = message;

            console.log('Message from server:', message);
            this.emit(type, message);
        });

        this.opponents = [];
        this.dealer = { name: "Dealer", seat: 0, hands: [] };
        this.playerName = "Player";

        this.listen("broadcast_table", message => {
            this.opponents = this.getOpponentsFromTable(message.message);
            this.emit("opponents", this.opponents);
            if (this.gameStarted != (message.message.status == "going"))
                this.emit("game_started", message.message.status == "going");
        });
    }

    private send(message: any): void {
        this.connection.send(JSON.stringify(message));
    }

    private getOpponentsFromTable(table: TableInfo) {
        const opponents = [];
        const { playersName, playersSeat } = table;

        for (let i = 0; i < playersName.length; i++) {
            const name = playersName[i];
            const seat = playersSeat[i];
            const hands = table.hands[seat] ?? [];
            if (seat !== this.seat)
                opponents[seat - Number(seat > this.seat) - 1] = { name, seat, hands };
        }

        this.dealer.hands = table.hands[0] ?? [];
        this.hands = table.hands[this.seat] ?? [];

        return opponents;
    }

    public async joinRoom(tableCode: string): Promise<void> {
        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent, message: TableJoinedMessage) {
            console.log('Table joined:', message.table.code);

            this.roomCode = message.table.code;
            this.seat = message.seat;
            this.gameStarted = false;
            this.opponents = [];
            this.hosting = false;
            for (const player of message.table.players) {
                if (player.seat != this.seat)
                    this.opponents[player.seat - Number(player.seat > this.seat) - 1] = { name: player.name, seat: player.seat, hands: [] };
            }

            resolve();

            this.unlisten('error', errorHandle);
            this.unlisten('disconnect', errorHandle);
            this.unlisten('table_joined', handle);
        };

        function errorHandle(this: GameAgent, error?: any) {
            if (error)
                console.error("Error creating table:", error);
            reject(error);

            this.unlisten("error", errorHandle);
            this.unlisten("disconnect", errorHandle);
            this.unlisten("table_joined", handle);
        }

        this.listen("table_joined", handle);
        this.listen("disconnect", errorHandle);
        this.listen("error", errorHandle);

        this.send({ type: "join_table", tableCode, chips: 1000, name: "Player" });
        return promise;
    }

    public newRoom(): Promise<void> {
        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent, message: { tableCode: string }) {
            console.log('Table created:', message.tableCode);

            this.roomCode = message.tableCode;
            this.seat = 1;
            this.gameStarted = false;
            this.hosting = true;
            resolve();

            this.unlisten('error', errorHandle);
            this.unlisten('disconnect', errorHandle);
            this.unlisten('table_created', handle);
        };

        function errorHandle(this: GameAgent, error?: any) {
            if (error)
                console.error("Error creating table:", error);
            reject(error);

            this.unlisten("error", errorHandle);
            this.unlisten("disconnect", errorHandle);
            this.unlisten("table_created", handle);
        }

        this.listen("table_created", handle);
        this.listen("disconnect", errorHandle);
        this.listen("error", errorHandle);

        this.send({ type: "create_table", chips: 1000, name: "Player" });

        return promise;
    }

    public async leaveRoom(): Promise<void> {
        if (!this.isConnecting)
            throw new Error('There is no connection to any room.');

        // TODO: send leave room message to server and disconnect socket
    }

    public changeName(name: string): void {
        this.playerName = name;
        this.send({ type: "update_player", tableCode: this.roomCode, seat: this.seat, chip: 1000, name, readyStatus: this.readyStatus });
    }

    public changeReadyState(readyStatus: boolean): void {
        this.send({ type: "update_player", tableCode: this.roomCode, seat: this.seat, chip: 1000, name: this.playerName, readyStatus });
    }

    public startGame(): Promise<void> {
        if (this.gameStarted)
            return Promise.reject();

        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent) {
            resolve();

            this.unlisten('error', errorHandle);
            this.unlisten('disconnect', errorHandle);
            this.unlisten('game_started', handle);

            if (this.hosting)
                this.runGame();
        };

        function errorHandle(this: GameAgent, error?: any) {
            if (error)
                console.error("Error creating table:", error);
            reject(error);

            this.unlisten("error", errorHandle);
            this.unlisten("disconnect", errorHandle);
            this.unlisten('game_started', handle);
        }

        this.listen('game_started', handle);
        this.listen("disconnect", errorHandle);
        this.listen("error", errorHandle);

        this.send({ type: "start_table", tableCode: this.roomCode });
        return promise;
    }

    public startMatch(): Promise<void> {
        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent, message: TableJoinedMessage) {
            console.log('Table joined:', message.table.code);

            this.roomCode = message.table.code;
            this.seat = message.seat;
            resolve();

            this.unlisten('error', errorHandle);
            this.unlisten('disconnect', errorHandle);
            this.unlisten('table_joined', handle);
        };

        function errorHandle(this: GameAgent, error?: any) {
            if (error)
                console.error("Error creating table:", error);
            reject(error);

            this.unlisten("error", errorHandle);
            this.unlisten("disconnect", errorHandle);
            this.unlisten("table_joined", handle);
        }

        this.listen("table_joined", handle);
        this.listen("disconnect", errorHandle);
        this.listen("error", errorHandle);

        this.send({ type: "random_table", chips: 1000, name: "Player" });
        return promise;
    }

    public hit(): void {
        this.send({ type: "player_action", action: "hit", tableCode: this.roomCode, seat: this.seat });
    }

    public stand(): void {
        this.send({ type: "player_action", action: "stand", tableCode: this.roomCode, seat: this.seat });
    }

    public double(): void {
        this.send({ type: "player_action", action: "double", tableCode: this.roomCode, seat: this.seat });
    }

    public split(): void {
        this.send({ type: "player_action", action: "split", tableCode: this.roomCode, seat: this.seat });
    }

    public surrender(): void {
        this.send({ type: "player_action", action: "surrender", tableCode: this.roomCode, seat: this.seat });
    }

    public nextTurn(): void {
        this.send({ type: "next_turn", tableCode: this.roomCode });
    }

    public runGame(): void {

        // Start the game

        let turn = 0;
        // 1. Dealer's turn
        // 2. Every Players' turn
        // 3. Dealer's turn
        // 4. Check for winners
        const total = 1 + this.opponents.length + 1 + 1;
        const interval = setInterval(() => {
            this.nextTurn();
            if (++turn >= total)
                clearInterval(interval);
        }, 500);
    }
};