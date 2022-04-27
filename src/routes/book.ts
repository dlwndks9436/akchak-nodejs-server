import { Router } from "express";
import { addBook, getBooks } from "../controllers/book";
import { verifyAccessToken, bookInputValidator } from "../middleware";

export const bookRouter = Router();

bookRouter.post("/", verifyAccessToken, bookInputValidator, addBook);

bookRouter.get("/", verifyAccessToken, getBooks);
