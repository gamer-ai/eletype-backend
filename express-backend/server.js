const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const { User } = require("./model/model.js");
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
      .withMessage("Email should be like user@gmail.com!")
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
    const { username, email, password } = req.body;

    if (!errors.isEmpty())
      return res.json({
        success: false,
        url: "/sign-up",
        errors: errors.array(),
      });

    await new User({
      username,
      email,
      password,
      token: "",
      ninetySeconds: { score: 0 },
      sixtySeconds: { score: 0 },
      thirtySeconds: { score: 0 },
      fifteenSeconds: { score: 0 },
    }).save();

    res.json({ success: true, url: "/login", errors: [], action: "sign-up" });
    console.log("Sign Up Success!");
  }
);

app.post(
  "/api/login",
  [
    body("email")
      .isEmail()
      .withMessage("Email should be like user@gmail.com!")
      .custom(async (value) => {
        const existingEmail = await User.findOne({ email: value });

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
  async (req, res) => {
    const errors = validationResult(req);
    const { email, password, submit = false } = req.body;

    const user = { email };

    if (!errors.isEmpty())
      return res.json({
        success: false,
        url: "/login",
        errors: errors.array(),
      });

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    console.log("Login successfully!");
    await User.updateOne(
      { email },
      {
        $set: {
          token,
        },
      }
    );

    res.json({ success: true, url: "/", errors: [], token, action: "login" });
  }
);

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
};

const getUSers = () => {
  return User.find();
};

app.get("/isAuthorized", authenticateToken, (req, res) => {
  console.log("User is authorized!");
  res.json({ authorized: true });
});

app.get("/user-by-token/:token", async (req, res) => {
  const token = req.params.token;

  console.log(token)

  if (token === "" || token == null) return res.json({ payload: {} });

  const { username, email } = await User.findOne({ token });

  res.json({ payload: { username, email } });
});

app.get("/ranking", async (req, res) => {
  const usersWithPassword = await getUSers();
  const usersWithoutPassword = usersWithPassword.map(
    ({
      username,
      email,
      ninetySeconds,
      sixtySeconds,
      thirtySeconds,
      fifteenSeconds,
    }) => ({
      username,
      email,
      ninetySeconds,
      sixtySeconds,
      thirtySeconds,
      fifteenSeconds,
    })
  );

  return res.json({ payload: usersWithoutPassword || [] });
});

app.post("/ranking", async (req, res) => {
  const { score, time, token } = req.body;
  let timeName;

  if (time === 90) {
    timeName = "ninetySeconds";
  }

  if (time === 60) {
    timeName = "sixtySeconds";
  }

  if (time === 30) {
    timeName = "thirtySeconds";
  }

  if (time === 15) {
    timeName = "fifteenSeconds";
  }

  const selectedUser = await User.findOne({ token });

  const oldUserScore = selectedUser[timeName].score;
  console.log(oldUserScore);
  console.log(score);

  await User.updateOne(
    { token },
    {
      $set: {
        [timeName]: {
          score: oldUserScore + score,
        },
      },
    }
  );

  res.json({ message: "Ranking!!" });
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
