const express = require("express");
const app = express();
const cors = require("cors")
const port = 8000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors({
  origin: '*',
  crendentials: true
}));

app.post("/api/login", (req, res) => {
  const {email, password} = req.body;

  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
