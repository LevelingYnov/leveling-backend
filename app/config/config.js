require('dotenv').config({ path: '../.env' });

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_HOST,
    DB_DIALECT,
    DB_PORT
} = process.env;

module.exports = {
    development: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        host: DB_HOST,
        dialect: DB_DIALECT,
        storage: './leveling.sqlite',
        port: DB_PORT,
        logging: console.log 
    },
    test: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        host: DB_HOST,
        dialect: DB_DIALECT,
        storage: './leveling.sqlite',
        port: DB_PORT
    },
    production: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        host: DB_HOST,
        dialect: DB_DIALECT,
        storage: './leveling.sqlite',
        port: DB_PORT
    }
};