import express from "express";
import { login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";
import { isAuthenticated } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail)
authRouter.post('/is-auth',userAuth, isAuthenticated );
authRouter.post('/send-rest-otp', sendResetOtp);
authRouter.post('/reset-password', userAuth, resetPassword);

export default authRouter;