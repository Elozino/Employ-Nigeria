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
// import sendEmail from "../utils/mailer.js";

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
    return res.status(401).send({
      error:
        "Password must contain at least 8 characters including uppercase, lowercase and special characters",
    });
  }

  //Hashing password with argon2
  const hashedPassword = await argon2.hash(password);

  const payload = { email, userType };

  // Generate tokens
  const accessToken = generateAccessToken(payload);

  const newUser = new User({
    fullname,
    email,
    password: hashedPassword,
    telephone,
    userType,
    otp: null,
    verified: false,
  });

  newUser
    .save()
    .then((result) => {
      return res
        .cookie("token", accessToken, {
          httpOnly: true,
          sameSite: "none",
          secure: false, // change to true
        })
        .status(200)
        .send({
          message: "User successfully created",
          user: newUser,
          accessToken,
        });
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500).send({ message: err });
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
    const { email, userType } = user;
    const payload = { email, userType };
    const accessToken = generateAccessToken(payload);

    // remove password from the user data to be sent (security purpose)
    const { password, ...others } = user;
    return res
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({ user: others, accessToken });
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
    const payload = {
      from: `employnigeria@email.com`,
      to: user.email,
      subject: "OTP Successful ✔",
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Hello there,</h2>
        <h4 style="margin-top: 30px;">Here is your OTP code: ${otp} ✔</h4>
        <p style="margin-top: 30px;">Please enter the sign up OTP to get started</p>
      </div>
    `,
    };
    // await sendEmail(payload);
    res.status(200).send({
      otp,
      user: userData,
    });
  } else {
    return res.status(400).send("Email not found");
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
    const payload = { email: user.email, userType: user.userType };

    // Generate tokens
    const accessToken = generateAccessToken(payload);
    return res.status(200).send({ user: userData, accessToken });
  } else {
    return res.status(400).send({
      error: "Invalid OTP / Wrong verification code, could not verify user",
    });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  const cookie = req.cookies.token;

  if (cookie) {
    return res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send("User has been logged out");
  } else {
    return res.status(402).send("Something went wrong, Please try again.");
  }
};

//Change Password
export const changePassword = async (req, res) => {
  const { email } = req.params;
  const { password, confirmPassword } = req.body;
  const user = User.findOne({ email });
  if (!user) {
    return res.status(400).json("User is not valid");
  }
  if (password !== confirmPassword) {
    return res.status(400).json("Password confirmation not the same");
  }
  try {
    const hashedPassword = await argon2.hash(password);
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

// Forgot Password
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
    from: "employnigeria@email.com",
    to: user.email,
    subject: "Reset your password",
    text: `Password reset code: ${passwordResetCode}`,
  });

  logger.debug(`Password reset email sent to ${email}`);

  return res.status(200).send({ data: message });
};

// Refresh tokens
export const refresh = async (req, res) => {
  if (req.cookies?.token) {
    // Verifying access token
    const accessToken = req.cookies.token;
    jwt.verify(accessToken, "employNigeriaSecretKey", (err, decoded) => {
      if (err) {
        // Wrong Token
        return res.status(406).json({ message: "Unauthorized" });
      } else {
        // Correct token we send a new access token
        const accessToken = jwt.sign(
          {
            id: decoded.email,
            userType: decoded.userType,
          },
          "employNigeriaSecretKey"
        );
        return res
          .cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
          })
          .status(200)
          .send({ accessToken });
      }
    });
  } else {
    return res.status(406).json({ message: "Unauthorized! No Token" });
  }
};

// Get Current User
