import { Contact } from "../schemas/contact.js";

const listContacts = async () => {
  return Contact.find();
};

const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  return Contact.create({ name, email, phone });
};

const updateContact = async (contactId, fields) => {
  return Contact.findByIdAndUpdate(contactId, fields);
};

const updateStatusContact = async (contactId, fields) => {
  return Contact.findByIdAndUpdate(contactId, fields);
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
