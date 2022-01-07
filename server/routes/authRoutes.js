const router = require("express").Router();

const auth = require("../controllers/authControllers");
const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");

router.get("/me", checkAuth, auth.fetchUser);
router.post("/register", auth.registerUser);
router.post("/login", auth.loginUser);
router.post("/verify", auth.verifyOTP);
router.get("/admin", checkAuth, checkAdmin, auth.handleAdmin);

module.exports = router;
