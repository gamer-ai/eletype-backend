const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  ninetySeconds: {
    wpm: Number,
  },
  sixtySeconds: {
    wpm: Number,
  },
  thirtySeconds: {
    wpm: Number,
  },
  fifteenSeconds: {
    wpm: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
