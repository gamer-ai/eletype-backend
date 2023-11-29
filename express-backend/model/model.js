const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  ninetySeconds: {
    score: Number,
  },
  sixtySeconds: {
    score: Number,
  },
  thirtySeconds: {
    score: Number,
  },
  fifteenSeconds: {
    score: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
