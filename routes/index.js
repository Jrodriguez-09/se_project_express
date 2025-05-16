const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NotFoundError } = require("../utils/NotFoundError");
const { createUser, login } = require("../controllers/users");
const { validateUserBody, validateAuthentication } = require("../middlewares/validation");

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuthentication, login);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
