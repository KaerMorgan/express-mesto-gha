const AuthorizationError = require("../errors/AuthorizationError");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthorizationError("Неправильные почта или пароль");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      "cbf66f1d02fceddb90e1e080cfcf7fbcb6810b596a5dbec3f4d8abf323a9240d"
    );
  } catch (err) {
    console.log("Ошибка функции аутентификации", err);
    return res.status(401).send({ message: "Необходима авторизация" });
  }
  req.user = payload;
  next();
};
