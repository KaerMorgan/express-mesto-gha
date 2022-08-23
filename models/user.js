const mongoose = require("mongoose");
const validator = require("validator");
const AuthorizationError = require("../errors/AuthorizationError");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Исследователь",
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { versionKey: false }
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      throw new AuthorizationError("Неправильные почта или пароль");
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new AuthorizationError("Неправильные почта или пароль");
      }

      return user;
    });
  });
};

module.exports = mongoose.model("user", userSchema);
