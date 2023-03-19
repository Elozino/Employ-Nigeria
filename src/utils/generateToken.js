import jwt from "jsonwebtoken";
import logger from "./logger.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.email, userType: user.userType },
    "employNigeriaSecretKey"
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.email, userType: user.userType },
    "employNigeriaRefreshSecretKey"
  );
};

export const verifyToken = (token) => {
  jwt.verify(token, "employNigeriaSecretKey", (err, user) => {
    err && logger.error(err);
  });
};
