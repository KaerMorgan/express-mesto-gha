const User = require("../models/user");
const bcrypt = require("bcryptjs");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const jwt = require("jsonwebtoken");

// function checkError(err, res) {
//   if (err instanceof NotFoundError) {
//     res.status(404).send({ message: `Ошибка: пользователь не найден` });
//     return;
//   } else if (err.name === "CastError" || err.name === "ValidationError") {
//     res.status(400).send({ message: `Ошибка: некорректный запрос` });
//     return;
//   }
//   res.status(500).send({ message: `Ошибка: ${err.message}` });
//   console.log(err.name, err.message);
// }

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError(`Пользователь не найден`)))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => next(new NotFoundError(`Пользователь не найден`)))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictError("Пользователь с такой почтой уже существует"));
    }
    bcrypt
      .hash(password, 10)
      .then((hash) =>
        User.create({ name, about, avatar, email, password: hash })
      )
      .then((user) =>
        res.send({
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        })
      )
      .catch(next);
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        "cbf66f1d02fceddb90e1e080cfcf7fbcb6810b596a5dbec3f4d8abf323a9240d",
        {
          expiresIn: "7d",
        }
      );
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};
