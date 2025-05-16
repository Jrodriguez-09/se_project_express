const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, updateUser);

module.exports = router;