import express from "express";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} from "../../models/contacts.js";

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
    res.status(404).json({ status: "fail", code: 404, message: error.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    res.status(200).json({
      status: "success",
      code: 200,
      data: { contact },
    });
  } catch (error) {
    res.status(404).json({ status: "fail", code: 404, message: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json({
      status: "success",
      code: 201,
      data: newContact,
    });
  } catch (error) {
    res.status(401).json({ status: "fail", code: 401, message: error.message });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contacts = await removeContact(contactId);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "Contact deleted",
    });
  } catch (error) {
    res.status(404).json({ status: "fail", code: 404, message: error.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, req.body);
    res.status(200).json({
      status: "success",
      code: 200,
      data: updatedContact,
    });
  } catch (error) {
    let code = 401;
    if (error.message === "Not found") {
      code = 404;
    }
    res.status(code).json({ status: "fail", code, message: error.message });
  }
});

export { router };
