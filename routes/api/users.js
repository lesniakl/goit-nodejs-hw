import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  currentUser,
  updateAvatar,
} from "../../controllers/userControllers.js";
import { auth } from "../../auth/authMiddleware.js";
import { upload } from "../../controllers/avatarMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.get("/logout", auth, logoutUser);

router.get("/current", auth, currentUser);

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export { router };
