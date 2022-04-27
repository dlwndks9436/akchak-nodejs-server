import { Dialect, Model, ModelStatic, Sequelize } from "sequelize";
import config from "../config/config";
import fs from "fs";
import path from "path";

type Env = "development" | "production";

type DB = {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
};

type Models = {
  [key: string]: ModelStatic<Model>;
};

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";

const sequelize = new Sequelize(
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

const db: DB = { sequelize, Sequelize };
const models: Models = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
    );
  })
  .forEach((file) => {
    const model: ModelStatic<Model> = require(path.join(__dirname, file))(
      sequelize
    );
    models[model.name] = model;
  });

export { db, models };
