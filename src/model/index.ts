import { Dialect, Sequelize } from "sequelize";
import config from "../config/config";

type env = "development" | "production";

export const sequelize = new Sequelize(
  config[process.env.NODE_ENV as env].database as string,
  config[process.env.NODE_ENV as env].username as string,
  config[process.env.NODE_ENV as env].password,
  {
    host: config[process.env.NODE_ENV as env].host,
    dialect: config[process.env.NODE_ENV as env].dialect as Dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+09:00",
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    },
  }
);
