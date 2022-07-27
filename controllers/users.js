const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");

function checkError(err, res) {
  if (err instanceof NotFoundError) {
    res.status(404).send({ message: `Ошибка: пользователь не найден` });
    return;
  } else if (err.name === "CastError" || err.name === "ValidationError") {
    res.status(400).send({ message: `Ошибка: некорректный запрос` });
    return;
  }
  res.status(500).send({ message: `Ошибка: ${err.message}` });
  console.log(err.name, err.message);
}

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => checkError(err, res));
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => checkError(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail((err) => {
      throw new NotFoundError(`Пользователь не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => checkError(err, res));
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
    .catch((err) => checkError(err, res));
};
module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => checkError(err, res));
};
