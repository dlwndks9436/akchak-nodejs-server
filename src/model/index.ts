import { Dialect, Sequelize } from "sequelize";
import config from "../config/config";

type Env = "development" | "production";
const env = process.env.NODE_ENV || "development";

export const sequelize = new Sequelize(
  config[env as Env].database as string,
  config[env as Env].username as string,
  config[env as Env].password || undefined,
  {
    host: config[env as Env].host,
    dialect: config[env as Env].dialect as Dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);
