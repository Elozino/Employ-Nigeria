import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  // const authHeader = req.headers.authorization;
  const token = req.cookies.access_token;
  if (token) {
    // const token = authHeader.split(" ")[1];
    jwt.verify(token, "employNigeriaSecretKey", (err, user) => {
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
