const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;