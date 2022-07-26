const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка: ${err.message}` });
      console.log(err.name, err.message);
    });
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Введены неправильные данные` });
        return;
      }
      res.status(500).send({ message: `Ошибка: ${err.message}` });
      console.log(err.name, err.message);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      throw new NotFoundError(`Карточка не найдена`);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError" || err instanceof NotFoundError) {
        res.status(404).send({ message: `Ошибка: ${err.message}` });
        return;
      } else if (err.name === "CastError") {
        res.status(400).send({ message: `Ошибка: ${err.message}` });
        return;
      }
      res.status(500).send({ message: `Ошибка: ${err.message}` });
      console.log(err.name, err.message);
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      throw new NotFoundError(`Карточка не найдена`);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Введены неправильные данные` });
        return;
      } else if (err instanceof NotFoundError) {
        res.status(404).send({ message: `Ошибка: ${err.message}` });
        return;
      } else if (err.name === "CastError") {
        res.status(400).send({ message: `Ошибка: ${err.message}` });
        return;
      }
      res.status(500).send({ message: `Ошибка: ${err.message}` });
      console.log(err.name, err.message);
    });
};
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      console.log(card);
      throw new NotFoundError(`Карточка не найдена`);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Введены неправильные данные` });
        return;
      } else if (err instanceof NotFoundError) {
        res.status(404).send({ message: `Ошибка: ${err.message}` });
        return;
      } else if (err.name === "CastError") {
        res.status(400).send({ message: `Ошибка: ${err.message}` });
        return;
      }
      res.status(500).send({ message: `Ошибка: ${err.message}` });
      console.log(err.name, err.message);
    });
};
