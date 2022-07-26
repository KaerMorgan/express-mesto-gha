const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "62dd54d46524ffde64695dab",
  };

  next();
});
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.use("*", (req, res) => {
  res.status(404).send({ message: "Такой страницы не существует!" });
});

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
