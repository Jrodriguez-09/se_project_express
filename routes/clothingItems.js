const router = require("express").Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem, } = require("../controllers/clothingItems");
const authMiddleware = require("../middlewares/auth");
const { validateClothingItem, validateId } = require("../middlewares/validation");

router.get("/", getItems);
router.use(authMiddleware);

router.post("/", validateClothingItem, createItem);
router.delete("/:itemId", validateId, deleteItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;