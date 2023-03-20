import argon2 from "argon2";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import { validatePassword } from "../utils/validatePassword.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import logger from "../utils/logger.js";

// Signup
export const createUser = async (req, res) => {
  const { email, password, fullname, telephone, userType } = req.body;
  // check if user already exists
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).send({ data: "Email already exist" });
  }

  // validate password to make sure user sends a strong password
  if (!validatePassword(password)) {
    return res.status(400).send({
      error:
        "Password must contain at least 8 characters including uppercase, lowercase and special characters",
    });
  }

  //Hashing password with argon2
  const hashedPassword = await argon2.hash(password);

  const payload = { email, userType };

  // Generate access token
  const accessToken = generateAccessToken(payload);

  const newUser = new User({
    fullname,
    email,
    password: hashedPassword,
    telephone,
    userType,
    accessToken,
    otp: null,
    verified: false,
  });

  newUser
    .save()
    .then((result) =>
      res
        .cookie("access_token", accessToken, {
          httpOnly: true,
        })
        .status(200)
        .send({
          message: "User successfully created",
          user: newUser,
          accessToken,
        })
    )
    .catch((err) => {
      logger.error(err);
      res.status(500).send({ message: err });
    });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // check if user does not exist
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send("Email not found");
  }

  // Verify password
  const verifyPassword = await argon2.verify(user.password, password);

  if (!verifyPassword) {
    return res.status(400).send("Incorrect Password");
  } else {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    // remove password from the user data to be sent (security purpose)
    const { password, ...others } = user;
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
      })
      .status(200)
      .send({ user: others, accessToken, refreshToken });
  }
};

// OTP
export const otpRequest = async (req, res) => {
  const { email } = req.body;
  // Find user
  const user = await User.findOne({ email });
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  if (user) {
    const userData = await User.findByIdAndUpdate(
      { _id: user.id },
      {
        $set: { otp },
      },
      { new: true }
    );
    res.status(200).send({
      otp,
      user: userData,
    });
  } else {
    res.status(400).send("Email not found");
  }
};

// Email verification
export const emailVerification = async (req, res) => {
  const { email, otp } = req.body;
  // Find user by email (checking if user registration was done to proceed to authentication)
  const user = await findOne({ email });

  // check if otp is the same
  if (user.otp === otp) {
    const userData = await User.findByIdAndUpdate(
      { _id: user.id },
      {
        $set: { verified: true },
      },
      { new: true }
    );
    res.status(200).send({ user: userData });
  } else {
    res.status(400).send({
      error: "Invalid OTP / Wrong verification code, could not verify user",
    });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const newRefreshToken = generateRefreshToken(user);
  const removeToken = await User.findByIdAndUpdate(
    { _id: user.id },
    {
      $set: { accessToken: newRefreshToken },
    },
    { new: true }
  );
  if (!removeToken) {
    throw new Error("Sorry something went wrong");
  }
  return res.status(200).send({ msg: "You logged out successfully" });
};

// Refresh tokens
export const refresh = async (req, res) => {
  // Take the refresh token from the user
  const { token, email } = req.body;
  const user = await User.findOne({ email });

  // Send error if there ios not token or token is invalid
  if (!token) {
    return res.status(401).send("You are not authenticated");
  }

  if (!user.accessToken || user.accessToken !== token) {
    return res.status(403).send("Refresh token is not valid");
  }

  // Create a new access token and refresh token and send to user
  jwt.verify(token, "employNigeriaSecretKey", async (err, user) => {
    if (err) {
      logger.error(err);
    } else {
      const newRefreshToken = generateRefreshToken(user);

      const updateToken = await User.findByIdAndUpdate(
        { _id: user.id },
        {
          $set: { accessToken: newRefreshToken },
        },
        { new: true }
      );
      if (!updateToken) {
        throw new Error("Sorry something went wrong");
      }
      return res.status(200).json({ msg: "Token have been updated" });
    }
  });
};

export const changePassword = async (req, res) => {
  const user = User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json("User is not valid");
  } else if (req.body.newPassword !== req.body.confirm) {
    return res.status(400).json("Password confirmation not the same");
  }
  try {
    const hashedPassword = await argon2.hash(req.body.password);
    const updatePassword = await User.findByIdAndUpdate(
      { _id: user.id },
      {
        $set: { password: hashedPassword },
      },
      { new: true }
    );
    if (!updatePassword) {
      throw new Error("Sorry something went wrong");
    }
    return res.status(200).send({ msg: "Password have been updated" });
  } catch (error) {
    if (error) return res.status(500).send({ msg: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const user = User.findOne({ email: req.body.email });
  const message =
    " If a user with the email is registered, you will a password reset email";

  if (!user) {
    logger.debug(`User with email ${email} does not exist`);
    return res.send("Email does not exist");
  }

  // Unverified user won't be able to reset password
  if (!user.verified) {
    return res.send("User is not verified");
  }

  const passwordResetCode = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    from: "employapp@email.com",
    to: user.email,
    subject: "Reset your password",
    text: `Password reset code: ${passwordResetCode}, Id: ${user._id}`,
  });

  logger.debug(`Password reset email sent to ${email}`);

  return res.status(200).send({ data: message });
};
