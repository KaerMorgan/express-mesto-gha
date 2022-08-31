const express = require('express');

const router = express.Router();
const { cardValidation, cardIdValidation } = require('../middlewares/joi');

const {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', cardIdValidation, deleteCard);
router.put('/:cardId/likes', cardIdValidation, putLike);
router.delete('/:cardId/likes', cardIdValidation, deleteLike);

module.exports = router;
