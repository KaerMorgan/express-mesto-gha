const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка: ${err.message}` });
      console.log(err.name, err.message);
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Введены неправильные данные` });
        return;
      }
      res.status(500).send({ message: `Ошибка: ${err.message}` });
      console.log(err.name, err.message);
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      console.log(user);
      throw new NotFoundError(`Пользователь не найден`);
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

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
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
module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
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
