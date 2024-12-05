import { OrderedEmiiter } from "../emitter";

type GameEventMap = {
    "connect": [connection: WebSocket],
    "disconnect": [],
    "table_created": [message: { tableCode: string, seat: number }],
    "table_joined": [message: { tableCode: string, seat: number }],
    "error": [message: any],
    "opponents": [opponents: string[]],
};

export const gameAgent = new class GameAgent extends OrderedEmiiter<GameEventMap> {

    private connection: WebSocket;
    public roomCode: string | null = null;
    public seat: number | null = null;

    public opponents: string[];
    public playerName: string;

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
    }

    private send(message: any): void {
        this.connection.send(JSON.stringify(message));
    }

    public async joinRoom(tableCode: string): Promise<void> {
        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent, message: { tableCode: string, seat: number }) {
            console.log('Table joined:', message.tableCode);

            this.roomCode = message.tableCode;
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

        this.send({ type: "join_table", tableCode, chips: 1000, name: "Player" });
        return promise;
    }

    public newRoom(): Promise<void> {
        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent, message: { tableCode: string }) {
            console.log('Table created:', message.tableCode);

            this.roomCode = message.tableCode;
            this.seat = 1;
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
        // this.send({ type: "update_player", tableCode: this.roomCode, chips: 1000, name, readyStatus: false });
    }

    public changeReadyState(ready: boolean): void {
        // this.send({ type: "update_player", tableCode: this.roomCode, chips: 1000, name: this.playerName, readyStatus: ready });
    }

    public startGame(): void {
        // this.send({ type: "start_table", tableCode: this.roomCode });
    }

    public startMatch(): Promise<void> {
        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent, message: { tableCode: string, seat: number }) {
            console.log('Table joined:', message.tableCode);

            this.roomCode = message.tableCode;
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
};