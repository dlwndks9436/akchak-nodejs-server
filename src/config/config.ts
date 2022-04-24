import dotenv from "dotenv";
dotenv.config();
const env = process.env;

export default {
  username:
    env.NODE_ENV === "development" ? env.DATABASE_USERNAME : env.RDS_USERNAME,
  password:
    env.NODE_ENV === "development" ? env.DATABASE_PASSWORD : env.RDS_PASSWORD,
  database:
    env.NODE_ENV === "development" ? env.DATABASE_NAME : env.RDS_DB_NAME,
  host: env.NODE_ENV === "development" ? env.DATABASE_HOST : env.RDS_HOSTNAME,
  dialect: env.DATABASE_DIALECT,
};
