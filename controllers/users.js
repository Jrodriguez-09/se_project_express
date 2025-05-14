const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { NotFoundError, BadRequestError, ConflictError, UnauthorizedError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    } if (err.name === "CastError") {
      return next(new BadRequestError("Invalid data"));
    }
    return next(err);
  });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, avatar }, { new: true, runValidators: true })
  .then((updatedUser) => {
    if (!updatedUser) {
      return next(new NotFoundError("User not found."));
    }
      return res.status(200).send(updatedUser);
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    return next(err);
  });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => User.create({ name, avatar, email, password: hash }))
  .then((user) => {
    res.status(201).send({ name: user.name, avatar: user.avatar, email: user.email });
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
    if (err.code === 11000) {
      return next(new ConflictError("This email already exist"));
    }
    return next(err);
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and Password required"));
  }

   return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.status(200).send({ token });
  })
  .catch((err) => {
    console.error(err);
    if (err.message === "Invalid email or password.") {
      return next(new UnauthorizedError(err.message));
    }
    return next(err);
  });
};

module.exports = { getCurrentUser, updateUser, createUser, login };