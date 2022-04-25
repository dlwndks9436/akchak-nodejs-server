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
  res.send("악착 api에 오신 것을 환영합니다!");
});

(async () => {
  await sequelize
    .sync()
    .then(async () => {
      await sequelize.query("SET GLOBAL event_scheduler = ON");
      const port = process.env.PORT || "30000";
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        swaggerDocs(app, Number.parseInt(port));
      });
    })
    .catch((err) => {
      console.log("데이터베이스 연결 실패");
      console.log(err);
    });
})();
