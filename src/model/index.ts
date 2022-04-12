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
    define: {
      charset: "utf8",
      collate: "utf8_general_ci",
      timestamps: true,
    },
  }
);
