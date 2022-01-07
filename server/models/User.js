const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["Name is required.", true],
      trim: true,
    },
    email: {
      type: String,
      required: ["Email is required.", true],
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    otp: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
