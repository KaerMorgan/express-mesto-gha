const AuthorizationError = require("../errors/AuthorizationError");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new AuthorizationError("Необходима авторизация"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      "cbf66f1d02fceddb90e1e080cfcf7fbcb6810b596a5dbec3f4d8abf323a9240d"
    );
  } catch (err) {
    next(new AuthorizationError("Неправильные почта или пароль"));
  }
  req.user = payload;
  next();
};
