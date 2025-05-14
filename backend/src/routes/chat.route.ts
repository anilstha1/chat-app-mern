import express from "express";
const {
  accessChat,
  getChats,
  addToGroup,
  createGroupChat,
  removeFromGroup,
  renameGroup,
  leaveFromGroup,
  deleteGroup,
} = require("../controllers/chat.controller");
const {authenticate} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authenticate, getChats);
router.post("/", authenticate, accessChat);

router.post("/group", authenticate, createGroupChat);
router.put("/group/rename", authenticate, renameGroup);
router.put("/group/add", authenticate, addToGroup);
router.put("/group/remove", authenticate, removeFromGroup);
router.put("/group/leave", authenticate, leaveFromGroup);
router.delete("/group", authenticate, deleteGroup);

export default router;
