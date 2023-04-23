import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.refresh_token;
  if (token) {
    jwt.verify(token, "employNigeriaRefreshSecretKey", (err, user) => {
      if (err) {
        return res.status(403).send("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).send("You are not authenticated");
  }
};
