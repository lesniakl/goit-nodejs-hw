import Joi from "joi";
const schemaReq = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).max(20).required(),
  favorite: Joi.boolean(),
});

const schema = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(5).max(20),
  favorite: Joi.boolean(),
});

const schemaUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(2).max(30).required(),
});

const schemaResend = Joi.object({
  email: Joi.string().email().required(),
});

export { schema, schemaReq, schemaUser, schemaResend };
