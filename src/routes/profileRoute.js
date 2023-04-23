import express from "express";
import { profile, updateProfile } from "../controller/profileController.js";
import verifyAccessToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/profile", verifyAccessToken, profile);

router.patch("/profile/update", verifyAccessToken, updateProfile);
