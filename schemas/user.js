import { Schema, model } from "mongoose";
import bCrypt from "bcrypt";

const users = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  avatarURL: {
    type: String,
    default: null,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

users.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

users.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

const User = model("user", users);
export { User };
