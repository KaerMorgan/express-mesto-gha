const express = require("express");
const router = express.Router();
const { cardValidation, userIdValidation } = require("../middlewares/joi");

const {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require("../controllers/cards");

router.get("/", getAllCards);
router.post("/", cardValidation, createCard);
router.delete("/:cardId", userIdValidation, deleteCard);
router.put("/:cardId/likes", userIdValidation, putLike);
router.delete("/:cardId/likes", userIdValidation, deleteLike);

module.exports = router;
