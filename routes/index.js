const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NotFoundError } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
//const { validateUserBody, validateAuthentication } = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
