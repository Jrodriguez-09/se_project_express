const clothingItem = require("../models/clothingItem");
const { ServerError } = require("../utils/ServerError");
const { BadRequestError } = require("../utils/BadRequestError");
const { NotFoundError } = require("../utils/NotFoundError");
const { ForbiddenError } = require("../utils/ForbiddenError");

const getItems = (req, res, next) => {
  clothingItem.find({})
  .then((items) => res.status(200).send(items))
  .catch((err) => {
    console.error(err);
    next(new ServerError("An error has occurred on the server"));
  });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem.create({ name, weather, imageUrl, owner })
  .then((item) => res.status(201).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data"));
    }
      return next(err);
  });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const itemOwner = req.user._id;

   clothingItem.findById(itemId)
  .orFail(() => {
    throw new NotFoundError("Item ID not found");
  })
  .then((item) => {
    if (item.owner.toString() !== itemOwner) {
      throw new ForbiddenError("Not authorized to delete this item.");
    }
    return clothingItem.findByIdAndDelete(itemId)
      .then((deletedItem) => res.status(200).send(deletedItem))
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid data"))
    }
    return next(err);
  });
};

const likeItem = (req, res, next) => {
  clothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
  .orFail(() => {
    throw new NotFoundError("Item ID not found");
  })
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid data"))
    }
    return next(err);
  });
};

const dislikeItem = (req, res, next) => {
  clothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .orFail(() => {
    throw new NotFoundError("Item ID not found");
  })
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid data"))
    }
    return next(err);
});
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };