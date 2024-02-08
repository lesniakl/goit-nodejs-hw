import { User } from "../schemas/user.js";
import { schemaUser } from "../validation/validation.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

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
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        email,
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
  console.log("tutaj");
  try {
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, { token: null });
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
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Not authorized",
    });
  }
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

export { registerUser, loginUser, logoutUser, currentUser };
