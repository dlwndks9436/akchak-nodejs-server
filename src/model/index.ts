import dbConfig from "../config/database";
import { Sequelize } from "sequelize";

console.log(dbConfig.DB);

export const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
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
