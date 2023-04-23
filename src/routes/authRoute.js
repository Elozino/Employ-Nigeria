import express from "express";
import {
  changePassword,
  createUser,
  emailVerification,
  forgotPassword,
  loginUser,
  logoutUser,
  otpRequest,
} from "../controller/authController.js";
import { verifyAccessToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/otp_request", verifyAccessToken, otpRequest);
router.post("/signup/verify", verifyAccessToken, emailVerification);
router.post("/logout", verifyAccessToken, logoutUser);
router.post("/change_password/:email", verifyAccessToken, changePassword);
router.post("/forgot_password", verifyAccessToken, forgotPassword);

export default router;
