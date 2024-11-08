import dotenv from 'dotenv';

dotenv.config();

export const constants = {
    PORT: process.env.PORT || 5555,
};