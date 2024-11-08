import DBManager from '../mongo';

let dbManager: DBManager;

beforeAll(async () => {
    dbManager = DBManager.getInstance();
});

afterAll(async () => {
    if (dbManager) {
        await dbManager.close();
    }
});

describe('DBManager', () => {
    test('should connect to MongoDB without error', async () => {
        await expect(dbManager.connect()).resolves.toBeUndefined();
    });

    test('should disconnect from MongoDB without error', async () => {
        await dbManager.connect(); 
        await expect(dbManager.close()).resolves.toBeUndefined();
    });
});
