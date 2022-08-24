const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

function checkError(err, res) {
  if (err instanceof NotFoundError) {
    res.status(404).send({ message: `Ошибка: карточка не найдена` });
    return;
  } else if (err.name === "CastError" || err.name === "ValidationError") {
    res.status(400).send({ message: `Ошибка: некорректный запрос` });
    return;
  }
  res.status(500).send({ message: `Ошибка: ${err.message}` });
  console.log(err.name, err.message);
}

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => checkError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => checkError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail((err) => {
      throw new NotFoundError(`Карточка не найдена`);
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError("Вы не можете удалить чужую карточку");
      }
      Card.findByIdAndRemove(req.params.cardId).then((card) =>
        res.send({ data: card })
      );
    })
    .catch((err) => checkError(err, res));
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail((err) => {
      throw new NotFoundError(`Карточка не найдена`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => checkError(err, res));
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail((err) => {
      throw new NotFoundError(`Карточка не найдена`);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => checkError(err, res));
};
