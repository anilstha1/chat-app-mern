import express from "express";
import {upload} from "../utils/multer";

const {
  createUser,
  getAllUsers,
  getUserById,
  loginUser,
} = require("../controllers/user.controller");
const {authenticate} = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.post("/signup", upload.single("image"), createUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", authenticate, getAllUsers);
router.get("/current-user", authenticate, getUserById);

export default router;
