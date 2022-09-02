const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Некорректные данные при редактировании профиля'),
        );
      }
      return next(err);
    });
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError('Некорректные данные при редактировании аватара'),
        );
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((createdUser) => res.status(201).send({
      email: createdUser.email,
      name: createdUser.name,
      about: createdUser.about,
      avatar: createdUser.avatar,
      _id: createdUser._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError('Пользователь с такой почтой уже существует'),
        );
      }
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        );
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      // вернём токен
      res.send({ token });
    })
    .catch(next);
};
