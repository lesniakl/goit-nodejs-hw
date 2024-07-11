import { User } from "../schemas/user.js";
import { schemaResend, schemaUser } from "../validation/validation.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { promises as fs } from "fs";
import path from "path";
import gravatar from "gravatar";
import jimp from "jimp";
import { nanoid } from "nanoid";
import { sendToken } from "./emails.js";

const secret = process.env.SECRET;

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email in use",
    });
  }
  const validationError = schemaUser.validate({ email, password }).error;
  if (validationError) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validationError.message,
    });
  }
  try {
    const avatarURL = gravatar.url(email, { s: "250" });
    const verificationToken = nanoid();
    const newUser = new User({ email, avatarURL, verificationToken });
    newUser.setPassword(password);
    await newUser.save();
    await sendToken(email, verificationToken);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        email,
        avatarURL,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: error.message,
    });
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const validationError = schemaUser.validate({ email, password }).error;
  if (validationError) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validationError.message,
    });
  }
  const user = await User.findOne({ email });
  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Email or password is wrong",
    });
  }
  if (!user.verify) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Please verify your account first",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user.id, { token });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      email,
      subscription: user.subscription,
    },
  });
};

const logoutUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { token: null });
    req.user = null;
    return res.status(204).end();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
    });
  }
};

const currentUser = async (req, res, next) => {
  const { email, subscription } = req.user;
  return res.status(200).json({
    status: "success",
    code: 200,
    data: {
      email,
      subscription,
    },
  });
};

const updateAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "No file attached",
    });
  }
  try {
    const { id } = req.user;
    const { filename, path: tmpPath } = req.file;
    const avatar = await jimp.read(tmpPath);
    const fullName = `${filename}.${avatar.getExtension()}`;
    const newPath = path.join(process.cwd(), "public/avatars", fullName);
    await avatar.resize(250, 250);
    await fs.rename(tmpPath, newPath);
    const avatarURL = `/avatars/${fullName}`;
    await User.findByIdAndUpdate(id, { avatarURL });
    return res.status(201).json({
      status: "success",
      code: 200,
      data: { avatarURL },
    });
  } catch (error) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
    });
  }
};

const verifyToken = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Verification successful",
  });
};

const resendToken = async (req, res, next) => {
  const { email } = req.body;
  const validationError = schemaResend.validate({ email }).error;
  if (validationError) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: validationError.message,
    });
  }
  const user = await User.findOne({ email });
  if (!user || user.verify) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message:
        "Verification has already been passed or no account with this email exists",
    });
  }
  await sendToken(email, user.verificationToken);
  return res.status(200).json({
    status: "success",
    code: 200,
    message: "Verification email sent",
  });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateAvatar,
  verifyToken,
  resendToken,
};