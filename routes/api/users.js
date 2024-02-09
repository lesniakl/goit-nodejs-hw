import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  currentUser,
} from "../../controllers/userControllers.js";
import { auth } from "../../auth/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/logout", auth, logoutUser);

router.get("/current", auth, currentUser);

export { router };
