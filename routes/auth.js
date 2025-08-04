const express = require("express");
const {
  renderLogin,
  varifyLogin,
  renderRegister,
  registerUser,
  resetPassword,
  resetPass,
  renderReset,
  updatePassword,
} = require("../controllers/auth.controller");
const router = express.Router();

router.get("/login", renderLogin);
router.post("/login", varifyLogin);
router.get("/register", renderRegister);
router.post("/register", registerUser);
router.get("/reset", resetPassword);
router.post("/reset", resetPass);

router.get("/resetpage/:token", renderReset);
router.post("/update-password", updatePassword);
module.exports = router;
