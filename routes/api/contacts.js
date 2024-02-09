import express from "express";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} from "../../models/contacts.js";
import { schema, schemaReq } from "../../models/validation.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({
      status: "success",
      code: 200,
      data: contacts,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Cannot get contact list`,
    });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    res.status(200).json({
      status: "success",
      code: 200,
      data: contact,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Cannot find user ID: ${contactId}`,
    });
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const validationError = schemaReq.validate({ name, email, phone }).error;
  if (validationError) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validationError.message,
    });
  }
  try {
    const newContact = await addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: newContact,
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      code: 401,
      message: `Cannot create user`,
    });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await removeContact(contactId);
    res.status(200).json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Cannot find user ID: ${contactId}`,
    });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const validationError = schema.validate({ name, email, phone }).error;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: `Missing fields`,
    });
  }
  if (validationError) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validationError.message,
    });
  }
  try {
    const result = await updateContact(contactId, { name, email, phone });
    res.status(200).json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found`,
    });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const validationError = schema.validate({ favorite }).error;
  if (!favorite) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: `Missing field favorite`,
    });
  }
  if (validationError) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validationError.message,
    });
  }
  try {
    const result = await updateStatusContact(contactId, { favorite });
    res.status(200).json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: `Not found`,
    });
  }
});

export { router };
