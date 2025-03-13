import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import authRouter from "./router/auth.route.js";
import messageRouter from "./router/message.route.js";

//cerate variable
const FRONT_URL = process.env.FRONT_URL;
const PORT = process.env.PORT;

//allow web can connect app
app.use(cors({ origin: FRONT_URL, credentials: true }));

app.use(cookieParser());
app.use(
  express.json({
    limit: "50mb",
  })
);
app.get("/", (req, res) => {
  res.send("<h1>welcome to se npru mern-chat restful api</h1>");
});

//routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);
//show port in console
server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
