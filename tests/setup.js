const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Create tables based on models
});

afterAll(async () => {
    await sequelize.close();
});

beforeEach(async () => {
    // Clean data before each test
    const models = Object.values(sequelize.models);
    for (const model of models) {
        await model.destroy({ truncate: { cascade: true }, restartIdentity: true });
    }
});
