import Joi from "joi";
const schemaReq = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(5).max(20).required(),
});

const schema = Joi.object({
  name: Joi.string().alphanum().min(2).max(30),
  email: Joi.string().email(),
  phone: Joi.string().min(5).max(20),
});

export { schema, schemaReq };
