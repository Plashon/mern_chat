import express from "express";
import { getUsersForSideBar,setMessage,getMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSideBar);
router.post("/send/:id",protectRoute,setMessage)
router.get("/:id",protectRoute,getMessage)

export default router;
