import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./model";
import indexRouter from "./routes";
import swaggerDocs from "./utils/swagger";
import helmet from "helmet";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(indexRouter);

// Logic goes here

app.get("/", (req, res) => {
  res.send("Welcome to resonar api");
});

(async () => {
  await sequelize
    .sync()
    .then(() => {
      const port = process.env.PORT || "30000";
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        swaggerDocs(app, Number.parseInt(port));
      });
    })
    .catch((err) => {
      console.log("Not able to connect to database");
      console.log(err);
    });
})();
