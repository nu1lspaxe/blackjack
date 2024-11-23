import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const constants = {
    PORT: process.env.PORT || 5555,
    WS_PORT: parseInt(process.env.WS_PORT || "8888", 10),
    MONGO_URI: process.env.MONGO_URI || '',
    MONGO_X509: path.resolve(__dirname, process.env.MONGO_X509 || ''),
    MONGO_DB: process.env.MONGO_DB || 'test',
};