import { OrderedEmiiter } from "../emitter";

type GameEventMap = {
    "connect": [connection: WebSocket],
    "disconnect": [],
    "table_created": [message: { tableCode: string }],
    "table_joined": [message: { tableCode: string }],
    "error": [message: any],
};

export const gameAgent = new class GameAgent extends OrderedEmiiter<GameEventMap> {

    private connection: WebSocket;
    private roomCode: string | null = null;

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
    }

    private send(message: any): void {
        this.connection.send(JSON.stringify(message));
    }

    public async joinRoom(tableCode: string): Promise<void> {
        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent, message: { tableCode: string }) {
            console.log('Table joined:', message.tableCode);

            this.roomCode = message.tableCode;
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

        this.send({ type: "join_table", tableCode, chips: 1000, name: "Player1" });
        return promise;
    }

    public newRoom(): Promise<void> {
        const { promise, resolve, reject } = Promise.withResolvers<void>();

        function handle(this: GameAgent, message: { tableCode: string }) {
            console.log('Table created:', message.tableCode);

            this.roomCode = message.tableCode;
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

        this.send({ type: "create_table", chips: 1000, name: "Player1" });

        return promise;
    }

    public async leaveRoom(): Promise<void> {
        if (!this.isConnecting)
            throw new Error('There is no connection to any room.');

        // TODO: send leave room message to server and disconnect socket
    }
};