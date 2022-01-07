const User = require("../models/User");

const { verifyToken } = require("../utils/token");

module.exports = async (req, res, next) => {
  try {
    //check for auth header
    const header = req.headers.authorization;
    if (!header) {
      next({ status: 403, message: "Authentication header missing" });
      return;
    }

    const token = header.split("Bearer ")[1];
    if (!token) {
      next({ status: 403, message: "Token missing" });
      return;
    }

    const userId = verifyToken(token, next);
    if (!userId) {
      next({ status: 403, message: "Decode Err" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      next({ status: 404, message: "User not found" });
      return;
    }
    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
