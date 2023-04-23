import express from "express";
import { profile, updateProfile } from "../controller/profileController.js";
import { uploadAvatar } from "../controller/uploadController.js";
import { verifyAccessToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/profile", verifyAccessToken, profile);

router.patch("/profile/update", verifyAccessToken, updateProfile);

router.post("/avatar-upload", verifyAccessToken, uploadAvatar);

export default router;