import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
app.set("view engine", "ejs");

dotenv.config();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
app.use(express.json());
app.get("/", (req, res) => res.render("index"));
app.use(UserRoute);

app.listen(5000, () => console.log("Server connected"));