const router = require("express").Router();

const auth = require("../controllers/authControllers");
const checkAuth = require("../middlewares/checkAuth");
const checkAdmin = require("../middlewares/checkAdmin");

router.post("/register", auth.registerUser);
router.post("/verify", auth.verifyTOTP);
router.post("/validate", auth.validate);
router.post("/login", auth.loginUser);
router.get("/me", checkAuth, auth.fetchUser);
router.get("/admin", checkAuth, checkAdmin, auth.handleAdmin);

module.exports = router;
