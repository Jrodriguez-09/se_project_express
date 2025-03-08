const User = require("../models/user");
const { BAD_REQUEST, UNAUTHORIZED_ERROR, NOT_FOUND, CONFLICT_ERROR, SERVER_ERROR } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  const { userId } = req.user;

  User.findById(userId)
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
  const { userId } = req.user;

  User.findByIdAndUpdate(userId, { name, avatar }, { new: true, runValidators: true })
  .then((updateUser) => {
    if (!updateUser) {
      return res.status(NOT_FOUND).send({ message: err.message });
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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

}

module.exports = { getCurrentUser, updateUser, createUser, login };