const User = require("../models/User");
const { generateOTP } = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res, next) => {
  try {
    let { email, name } = req.body;

    //check duplicate email
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return next({ status: 400, message: "Email already registered." });
    }

    //Create new user
    const createUser = new User({
      name,
      email,
    });

    //Generate OTP
    const otp = generateOTP(6);
    createUser.otp = otp;
    console.log(createUser);

    const user = await createUser.save();

    //Send OTP via Email
    await sendEmail({
      to: email,
      subject: `OTP Verification`,
      text: "Send an OTP.",
      html: `<h1>Your OTP Code is ${otp}</h1>`,
    });

    res.status(200).json({
      type: "success",
      message: "Account created OTP sent on mail",
      data: {
        userId: user._id,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.fetchUser = (req, res) => {};
exports.loginUser = (req, res) => {};
exports.verifyOTP = (req, res) => {};

exports.handleAdmin = (req, res) => {};
