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
router.post("/login", verifyAccessToken, loginUser);
router.post("/signup/verify", emailVerification);
router.post("/otp_request", otpRequest);
router.post("/logout", verifyAccessToken, logoutUser);
router.post("/forgot_password", forgotPassword);
router.post("/change_password", changePassword);

export default router;
