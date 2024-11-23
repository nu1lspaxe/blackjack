import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { constants } from '../config/constants';

class DBManager {
    private static instance: DBManager;
    private client: MongoClient;
    private isConnected: boolean = false;

    private constructor() {
        this.client = new MongoClient(constants.MONGO_URI, {
            tlsCertificateKeyFile: constants.MONGO_X509,
            serverApi: ServerApiVersion.v1
        });
    }

    public static getInstance(): DBManager {
        if (!DBManager.instance) {
            DBManager.instance = new DBManager();
        }
        return DBManager.instance;
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            try {
                await this.client.connect();
                this.isConnected = true;
                console.log('Connected to MongoDB');
            } catch (error) {
                console.error('Failed to connect to MongoDB:', error);
                throw error;
            }
        }
    }

    public getDatabase(dbName: string): Db {
        if (!this.isConnected) {
            throw new Error('MongoClient is not connected. Call connect() first.');
        }
        return this.client.db(dbName);
    }

    public async close(): Promise<void> {
        if (this.isConnected) {
            await this.client.close();
            this.isConnected = false;
            console.log('Disconnected from MongoDB');
        }
    }
}

export default DBManager;
