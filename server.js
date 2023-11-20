const express = require("express");
const app = express();
const cors = require("cors");
const {body, validationResult} = require("express-validator");
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

app.post("/api/login", [
  body('email')
  .isEmail()
  .withMessage("Invalid email format!"),
  body('password')
  .isLength({
    min: 8
  })
  .withMessage('Password must be atleast 8 characters long!')
], (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) return res.json({ success: false, errors: errors.array()});
  
  return res.json({ success: true, errors: []});
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
