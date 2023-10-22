const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../constants");
const userController = require("../db/models/user");
const {
  sendResponse,
  sendErrorResponse,
} = require("../helper/response.helper");

const { SECRET_KEY, EXPIRY_SECONDS } = env;

const User = {
  register: async (req, res) => {
    try {
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new userController({
        username,
        password: hashedPassword,
        role,
      });
      await user.save();
      sendResponse(res, { message: "User registered successfully" });
    } catch (error) {
      if (error.code === 11000) {
        sendErrorResponse(res, { message: "User already registered" }, 409);
      } else {
        sendErrorResponse(res, { error });
      }
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userController.findOne({ username });

      if (!user) {
        throw { data: { message: "User not found" }, statusCode: 404 };
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw { data: { message: "Invalid password" }, statusCode: 401 };
      }

      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: EXPIRY_SECONDS,
      });
      sendResponse(res, { token });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  },
};
module.exports = User;
