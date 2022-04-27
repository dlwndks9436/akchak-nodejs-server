require("dotenv").config();
const env = process.env;

module.exports = {
  development: {
    username: env.DATABASE_USERNAME || "root",
    password: env.DATABASE_PASSWORD || null,
    database: env.DATABASE_NAME || "database_development",
    host: env.DATABASE_HOST || "localhost",
    dialect: env.DATABASE_DIALECT || "mysql",
  },
  production: {
    username: env.RDS_USERNAME || "root",
    password: env.RDS_PASSWORD || null,
    database: env.RDS_DB_NAME || "database_production",
    host: env.RDS_HOSTNAME || "localhost",
    dialect: env.DATABASE_DIALECT || "mysql",
  },
};
