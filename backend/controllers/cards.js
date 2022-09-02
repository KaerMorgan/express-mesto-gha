const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Некорректные данные при создании карточки'),
        );
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  Card.findById(id)
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return Card.findByIdAndRemove(id).then((deletedCard) => res.send(deletedCard));
    })
    .catch(next);
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Карточка не найдена')))
    .then((card) => res.send(card))
    .catch(next);
};
