import express from "express";
const {
  getAllMessages,
  sendMessage,
} = require("../controllers/message.controller");
const {authenticate} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:chatId", authenticate, getAllMessages);

router.post("/", authenticate, sendMessage);

export default router;
