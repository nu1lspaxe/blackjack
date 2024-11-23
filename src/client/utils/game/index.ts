import { OrderedEmiiter } from "../emitter";

type GameEventMap = {
    'connect': [connection: WebSocket],
    'disconnect': [],
};

export const gameAgent = new class GameAgent extends OrderedEmiiter<GameEventMap> {
    
    private connection: WebSocket | null = null;
    
    public get isConnecting(): boolean {
        return Boolean(this.connection);
    }
    
    constructor() {
        super();
    }

    public async joinRoom(roomNumber: string): Promise<void> {
        // TODO: connect to room
    }

    public async newRoom(): Promise<void> {
        // TODO: send new room message to server and connect to room
    }

    public async leaveRoom(): Promise<void> {
        if (!this.isConnecting)
            throw new Error('There is no connection to any room.');
        
        // TODO: send leave room message to server and disconnect socket
    }
};