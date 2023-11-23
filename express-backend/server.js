const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const { User } = require("./model/model.js");
const e = require("express");
const port = 8000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "*",
    crendentials: true,
  })
);

const connectedToMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Mongo Db!");
  } catch (err) {
    console.log("Error connecting to Mongo Db!", err);
  }
};

connectedToMongoDb();

app.post(
  "/api/sign-up",
  [
    body("username")
      .isLength({
        min: 2,
        max: 30,
      })
      .withMessage("Username must be atleast 2 characters long!")
      .custom(async (value) => {
        const existingUsername = await User.findOne({ username: value });

        if (existingUsername && value) {
          throw new Error("Username is already exist!");
        }

        return true;
      }),
    body("email")
      .isEmail()
      .withMessage("Invalid email format!")
      .custom(async (value) => {
        const existingEmail = await User.findOne({ email: value });

        if (existingEmail && value) {
          throw new Error("Email is already exist!");
        }

        return true;
      }),
    body("password")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be atleast 8 characters long!"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { username, email, password, submit = false } = req.body;

    if (!errors.isEmpty())
      return res.json({
        success: false,
        url: "/sign-up",
        errors: errors.array(),
      });

    const newUser = new User({
      username,
      email,
      password,
    });

    if (submit) {
      await newUser.save();
      res.json({ success: true, errors: [] });
      console.log("Sign Up Success!");
    } else {
      res.json({ success: true, url: "/sign-up", errors: [] });
    }
  }
);

app.post(
  "/api/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email format!")
      .custom(async (value) => {
        const existingEmail = await User.findOne({ email: value });
        console.log(existingEmail);
        if (!existingEmail && value) {
          throw new Error("Email doesn't exist!");
        }

        return true;
      }),
    body("password")
      .isLength({
        min: 8,
      })
      .withMessage("Password must be atleast 8 characters long!")
      .custom(async (value, { req }) => {
        const existingEmail = await User.findOne({ email: req.body.email });

        if (existingEmail) {
          if (existingEmail.password !== value && value) {
            throw new Error("Wrong password!");
          }
        }

        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    const { username, email, password, submit = false } = req.body;

    if (!errors.isEmpty())
      return res.json({
        success: false,
        url: "/login",
        errors: errors.array(),
      });

    if (submit) {
      res.json({ success: true, errors: [] });
      console.log("Login Success!");
    } else {
      res.json({ success: true, errors: [] });
    }
  }
);

app.listen(port, () => {
  console.log("Server is running on port", port);
});
