import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js";

import authRouter from "./router/auth.route.js"


//cerate variable
const FRONT_URL = process.env.FRONT_URL;
const PORT = process.env.PORT;

//create app
const app = express();

connectDB();
//allow web can connect app
app.use(cors({ origin: FRONT_URL, credentials: true }));

app.use(cookieParser())
app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>welcome to se npru mern-chat restful api</h1>");
});

//routers
app.use("/api/v1/auth", authRouter)

//show port in console
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
