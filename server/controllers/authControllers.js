const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const User = require("../models/User");
// const { generateOTP } = require("../utils/otp");
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

    //Generate secret key
    const secret = speakeasy.generateSecret();
    //  console.log(secret);
    createUser.tempSecret = secret.base32;

    //Generate QR
    const generateQR = await QRCode.toDataURL(secret.otpauth_url);
    createUser.QRCode = generateQR;
    //  console.log(generateQR);

    const user = await createUser.save();

    const content = `
                  <div>
                  <h1>Your secret key is: ${user.tempSecret}</h1>
                  <img src=${generateQR} alt="QR Code">
                  </div>
                  
    
    `;
    //Send Instructions via Email
    await sendEmail({
      to: email,
      subject: `OTP Verification`,
      text: "Send an OTP.",
      html: content,
    });

    res.status(200).json({
      type: "success",
      message: "Account created. Instructions sent on mail",
      data: {
        userId: user._id,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.verifyTOTP = async (req, res, next) => {
  try {
    const { token, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next({ status: 400, message: "User not found" });

    if (!user.isTwoFAVerify) {
      const verified = speakeasy.totp.verify({
        secret: user.tempSecret,
        encoding: "base32",
        token,
      });

      if (verified) {
        user.twoFASecretKey = user.tempSecret;
        user.tempSecret = "";
        user.isTwoFAVerify = true;
        await user.save();

        return res.status(200).json({
          type: "success",
          message: "User Verified",
          data: null,
        });
      } else {
        return next({ status: 400, message: "User not verified." });
      }
    } else {
      return next({ status: 400, message: "User Already Verified" });
    }
  } catch (err) {
    next(err);
  }
};

exports.validate = async (req, res, next) => {
  try {
    const { token, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next({ status: 400, message: "User not found" });

    const validateToken = speakeasy.totp.verify({
      secret: user.twoFASecretKey,
      encoding: "base32",
      token,
      window: 1,
    });

    if (validateToken) {
      return res.status(200).json({
        type: "success",
        message: "Token Validate Sucessfully",
        data: null,
      });
    } else {
      return next({ status: 400, message: "Token not validated." });
    }
  } catch (err) {
    next(err);
  }
};

exports.fetchUser = (req, res) => {};
exports.loginUser = (req, res) => {};
exports.handleAdmin = (req, res) => {};
