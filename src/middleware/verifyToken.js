import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "employNigeriaSecretKey", (err, user) => {
      if (err) {
        // logger.error(err);
        return res.status(403).send("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send("You are not authenticated");
  }
};
