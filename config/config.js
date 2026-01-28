module.exports = {
    development: {
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "rizurin_app",
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "postgres"
    },
    test: {
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "rizurin_app_test",
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: "postgres"
    },
    production: {
        username: "postgres",
        password: "root",
        database: "rizurin_app_production",
        host: "192.168.8.50",
        dialect: "postgres"
    }
};
