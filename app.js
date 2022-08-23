const express = require("express");
const mongoose = require("mongoose");
const { login, createUser } = require("./controllers/users");
// Устранение уязвимостей в http заголовках
const helmet = require("helmet");

// Защита от DoS-атак
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(limiter);
app.use(helmet());

app.post("/signin", express.json(), login);
app.post("/signup", express.json(), createUser);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("*", (req, res) => {
  res.status(404).send({ message: "Такой страницы не существует!" });
});

// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err;

//   res.status(statusCode).send({
//     message: statusCode === 500 ? "На сервере произошла ошибка" : message,
//   });
// });

async function main() {
  await mongoose.connect(
    "mongodb://localhost:27017/mestodb",
    { useNewUrlParser: true },
    (err) => {
      if (err) console.log(err.name, err.message);
      console.log("Connected to MongoDB");
    }
  );
  await app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

main();
