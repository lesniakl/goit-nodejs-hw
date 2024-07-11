import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import path from "path";
import { schema, schemaReq } from "./validation.js";
const contactsPath = path.join(process.cwd(), "models", "contacts.json");

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath);
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((e) => e.id === contactId);
  if (!contact) {
    throw new Error("Not found");
  }
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const newContacts = contacts.filter((e) => e.id !== contactId);
  if (contacts.length === newContacts.length) {
    throw new Error("Not found");
  }
  fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  if (schemaReq.validate({ name, email, phone }).error) {
    throw new Error(schemaReq.validate({ name, email, phone }).error.message);
  }
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  if (Object.keys(body).length === 0) {
    throw new Error("Missing fields");
  }
  if (schema.validate({ name, email, phone }).error) {
    throw new Error(schema.validate({ name, email, phone }).error.message);
  }
  const contacts = await listContacts();
  const contact = contacts.find((e) => e.id === contactId);
  if (!contact) {
    throw new Error("Not found");
  }
  contact.name = name ? name : contact.name;
  contact.email = email ? email : contact.email;
  contact.phone = phone ? phone : contact.phone;
  const newContacts = contacts.map((e) => {
    if (e.id === contactId) {
      return contact;
    }
    return e;
  });
  fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  return contact;
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
