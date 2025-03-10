const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { BAD_REQUEST, UNAUTHORIZED_ERROR, NOT_FOUND, CONFLICT_ERROR, SERVER_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: err.message });
    } if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, avatar }, { new: true, runValidators: true })
  .then((updatedUser) => {
    if (!updatedUser) {
      return res.status(NOT_FOUND).send({ message: "User not found." });
    }
      return res.status(200).send(updateUser);
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
      return res.status(SERVER_ERROR).send({ message: "An error has occured on the server" });
  });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => User.create({ name, avatar, email, password: hash }))
  .then((user) => {
    res.status(201).send({ name: user.name, avatar: user.avatar, email: user.email });
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(CONFLICT_ERROR).send({ message: "This email already exist" });
    }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).send({ message: "Email and Password required" });
  }

   return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.status(200).send({ token });
  })
  .catch((err) => {
    console.error(err);
    if (err.message === "Invalid email or password.") {
      return res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
    }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
};

module.exports = { getCurrentUser, updateUser, createUser, login };