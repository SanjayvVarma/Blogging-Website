const express = require("express");
const { signUp, logIn, logOut } = require("../controllers");
const {passport} = require("../middlewares")

const authRouter = express.Router();

authRouter.post("/auth/SignUp",signUp);

authRouter.post("/auth/login",logIn);

authRouter.post("/auth/logout",passport.authenticate('jwt', { session: false }),logOut);

module.exports = authRouter;