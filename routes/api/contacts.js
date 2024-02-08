import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
  getOneContact,
  updateFavorite,
  updateOneContact,
} from "../../controllers/contactControllers.js";
import { auth } from "../../auth/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getAllContacts);

router.get("/:contactId", auth, getOneContact);

router.post("/", auth, createContact);

router.delete("/:contactId", auth, deleteContact);

router.put("/:contactId", auth, updateOneContact);

router.patch("/:contactId/favorite", auth, updateFavorite);

export { router };
