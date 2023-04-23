import express from "express";
import { upload } from "../controller/uploadController";

const router = express.Router();

router.post("/avatar-upload", verifyAccessToken, upload);
