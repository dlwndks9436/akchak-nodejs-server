import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./model";
import indexRouter from "./routes";
import swaggerDocs from "./utils/swagger";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import path from "path";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", indexRouter);

// Logic goes here

app.get("/privacy-policy", function (_, res) {
  res.sendFile(path.resolve(`${__dirname}/../views/akchak-app.html`));
});

app.get("/", (_, res) => {
  res.status(StatusCodes.OK).send("악착 사이트에 오신 것을 환영합니다!");
});

(async () => {
  await sequelize
    .sync()
    .then(async () => {
      const port = process.env.PORT || "30000";
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        swaggerDocs(app, parseInt(port));
      });
    })
    .catch((err) => {
      console.log("데이터베이스 연결 실패");
      console.log(err);
    });
})();
