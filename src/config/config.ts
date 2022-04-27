import dotenv from "dotenv";
dotenv.config();
const env = process.env;

export default {
  development: {
    username: env.DATABASE_USERNAME || "root",
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST || "localhost",
    dialect: env.DATABASE_DIALECT || "mysql",
  },
  production: {
    username: env.RDS_USERNAME || "root",
    password: env.RDS_PASSWORD,
    database: env.RDS_DB_NAME,
    host: env.RDS_HOSTNAME || "localhost",
    dialect: env.DATABASE_DIALECT || "mysql",
  },
};
