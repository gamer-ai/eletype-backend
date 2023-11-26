const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const { User } = require("./model/model.js");
const e = require("express");
const session = require("express-session");
const flash = require("express-flash");
const jwt = require("jsonwebtoken");
const port = 8000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(flash());
app.use(
  session({
    secret: "myhobbyiscalisthenic",
    resave: false,
    saveUninitialized: false,
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
    const { email, password, submit = false } = req.body;

    const user = { email };

    if (!errors.isEmpty())
      return res.json({
        success: false,
        url: "/login",
        errors: errors.array(),
      });

      console.log(user)

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });

    if (submit) {
      console.log("Login successfully!");
      res.json({ success: true, errors: [], token });
    } else {
      res.json({ success: true, errors: [], token });
    }
  }
);

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

app.get('/isAuthorized', authenticateToken, (req, res, next) => {
  console.log("User is authorized!");
   res.json({authorized: true});
})

app.listen(port, () => {
  console.log("Server is running on port", port);
});
