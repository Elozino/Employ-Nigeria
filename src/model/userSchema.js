import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    avatar: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
    },
    address: {
      type: String,
    },
    otp: {
      type: String,
    },
    verified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

export default User;
