const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirecturl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const router = express.Router();
User = require("../models/user.js");

router.get("/signup", userController.renderSignupForm);

router.post(
  "/signup",
  wrapAsync(userController.signup)
);

router.get("/login", userController.rednerLoginForm);

router.post(
  "/login",
  saveRedirecturl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get('/logout',isLoggedIn, userController.logout)
module.exports = router;
