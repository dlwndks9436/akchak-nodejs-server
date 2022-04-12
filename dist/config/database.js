"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    HOST: process.env.RDS_HOSTNAME || process.env.DATABASE_HOST,
    USER: process.env.RDS_USERNAME || process.env.DATABASE_USERNAME,
    PASSWORD: process.env.RDS_PASSWORD || process.env.DATABASE_PASSWORD,
    DB: process.env.RDS_DB_NAME || process.env.DATABASE_NAME,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
