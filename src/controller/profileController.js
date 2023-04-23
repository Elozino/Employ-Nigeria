import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";

// get profile
export const profile = (req, res) => {
  const data = req.user;
  const user = User.find({ email: data.id });
  if (user) {
    return res.status(200).send({ user });
  } else {
    return res
      .send(400)
      .send("Unable to get profile data due to Invalid token");
  }

  // const cookies = req.cookies.header;
  // if (cookies) {
  //   jwt.verify(accessToken, "employNigeriaSecretKey", (err, decoded) => {
  //     if (err) {
  //       return res.status(406).json({ message: "Unauthorized" });
  //     } else {
  //       const { id } = decoded;
  //       const user = User.find({ email: id });
  //       return res.status(200).send({ user });
  //     }
  //   });
  // }
};

// update user profile
export const updateProfile = (req, res) => {
  const data = req.user;
  const { username, avatar, dob, gender, address, telephone } = req.body;
  const user = User.findByIdAndUpdate(
    { email: data.id },
    {
      $set: {
        username,
        avatar,
        dob,
        gender,
        address,
        telephone,
      },
      $currentDate: { timeStamp: true },
    }
  );
  if (user) {
    res.status(200).send("Profile updated successfully");
  } else {
    res.status(403).send("Something went wrong");
  }
};


