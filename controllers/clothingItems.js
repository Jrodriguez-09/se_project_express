const clothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem.find({})
  .then((items) => res.status(200).send(items))
  .catch((err) => {
    console.error(err);
    return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem.create({ name, weather, imageUrl, owner })
  .then((item) => res.status(201).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
  });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem.findByIdAndDelete(itemId)
  .orFail()
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: err.message });
    } if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    } else {
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    }
  });
};

const likeItem = (req, res) => {
  clothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .orFail(() => {
    const error = new Error("Item ID not found");
    error.statusCode = NOT_FOUND;
    throw error;
  })
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: err.message });
    } if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    } else {
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    }
  });
};

const dislikeItem = (req, res) => {
  clothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .orFail(() => {
    const error = new Error("Item ID not found");
    error.statusCode = NOT_FOUND;
    throw error;
  })
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: err.message });
    } if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    } else {
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    }
});
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };