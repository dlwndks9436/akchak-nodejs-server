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
  // username:
  //   env.NODE_ENV === "development" ? env.DATABASE_USERNAME : env.RDS_USERNAME,
  // password:
  //   env.NODE_ENV === "development" ? env.DATABASE_PASSWORD : env.RDS_PASSWORD,
  // database:
  //   env.NODE_ENV === "development" ? env.DATABASE_NAME : env.RDS_DB_NAME,
  // host: env.NODE_ENV === "development" ? env.DATABASE_HOST : env.RDS_HOSTNAME,
  // dialect: env.DATABASE_DIALECT,
};
