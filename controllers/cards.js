const Card = require("../models/card");

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
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: `Карточка не найдена` });
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
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Введены неправильные данные` });
        return;
      } else if (err.name === "CastError") {
        res.status(404).send({ message: `Пользователь не найден` });
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
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Введены неправильные данные` });
        return;
      } else if (err.name === "CastError") {
        res.status(404).send({ message: `Пользователь не найден` });
        return;
      }
      res.status(500).send({ message: `Ошибка: ${err.message}` });
      console.log(err.name, err.message);
    });
};
