import { Dialect, Sequelize } from "sequelize";
import config from "../config/config";

export const sequelize = new Sequelize(
  config.database as string,
  config.username as string,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as Dialect,
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
