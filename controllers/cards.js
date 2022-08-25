const Card = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

// function checkError(err, res) {
//   if (err instanceof NotFoundError) {
//     res.status(404).send({ message: `Ошибка: карточка не найдена` });
//     return;
//   } else if (err.name === "CastError" || err.name === "ValidationError") {
//     res.status(400).send({ message: `Ошибка: некорректный запрос` });
//     return;
//   }
//   res.status(500).send({ message: `Ошибка: ${err.message}` });
//   console.log(err.name, err.message);
// }

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError(`Карточка не найдена`)))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError("Вы не можете удалить чужую карточку"));
      }
      Card.findByIdAndRemove(req.params.cardId).then((card) =>
        res.send({ data: card })
      );
    })
    .catch(next);
};

// module.exports.deleteCard = (req, res, next) => {
//   Card.findById(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         next(new NotFoundError(`Карточка не найдена`));
//       }
//       else if (!card.owner.equals(req.user._id)) {
//         next(new ForbiddenError("Вы не можете удалить чужую карточку"));
//       }
//       Card.findByIdAndRemove(req.params.cardId).then((card) =>
//         res.send({ data: card })
//       );
//     })

//     .catch(next);
// };

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => next(new NotFoundError(`Карточка не найдена`)))
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => next(new NotFoundError(`Карточка не найдена`)))
    .then((card) => res.send({ data: card }))
    .catch(next);
};
