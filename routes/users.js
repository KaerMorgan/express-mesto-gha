const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  changeUserInfo,
  changeAvatar,
} = require("../controllers/users");

router.get("/", getAllUsers); // get all users
router.get("/:id", getUserById); // get user by id
router.post("/", express.json(), createUser); // create new user
router.patch("/me", express.json(), changeUserInfo); // change user name and occupation
router.patch("/me/avatar", express.json(), changeAvatar); // change user avatar

module.exports = router;
