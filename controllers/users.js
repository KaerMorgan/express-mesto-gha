const User = require("../models/user");

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
  const { id } = req.params;
  User.findById(id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: `Пользователь не найден` });
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
