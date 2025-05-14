const router = require("express").Router();
const { getItems, createItem, deleteItem, likeItem, dislikeItem, } = require("../controllers/clothingItems");
const authMiddleware = require("../middlewares/auth");
//const { validateClothingItem, validateId } = require("../middlewares/validation");

router.get("/", getItems);
router.use(authMiddleware);

router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;