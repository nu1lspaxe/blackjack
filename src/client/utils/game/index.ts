import { OrderedEmiiter } from "../emitter";

interface TableInfo {
    playersName: string[];
    playersSeat: number[];
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

type GameEventMap = {
    "connect": [connection: WebSocket],
    "disconnect": [],

    "table_created": [message: TableCreateMessage],
    "table_joined": [message: TableJoinedMessage],
    "broadcast_table": [message: { message: TableInfo }],

    "table_ended": [message: { tableCode: string }],

    "error": [message: any],
    "opponents": [opponents: string[]],
    "next_turn": [tableData: any],

    "game_started": [status: boolean],
};

export const gameAgent = new class GameAgent extends OrderedEmiiter<GameEventMap> {

    private connection: WebSocket;
    public hosting: boolean = false;
    public roomCode: string | null = null;
    public seat: number | null = null;

    public opponents: string[];
    public playerName: string;

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
        this.playerName = "Player";

        this.listen("broadcast_table", message => {
            this.opponents = this.getOpponentsFromTable(message.message);
            console.log(this.opponents);
            this.emit("opponents", this.opponents);

            if (this.gameStarted != (message.message.status == "going")) {
                this.emit("game_started", message.message.status == "going");
            }
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
            if (seat !== this.seat)
                opponents[seat - Number(seat > this.seat!) - 1] = name;
        }

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
                    this.opponents[player.seat - Number(player.seat > this.seat!) - 1] = player.name;
            }

            console.log(this.opponents);

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
};