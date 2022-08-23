const express = require("express");
const { celebrate, Joi } = require("celebrate");
const { avatarValidation, userInfoValidation } = require("../middlewares/joi");

const router = express.Router();
const {
  getMe,
  getAllUsers,
  createUser,
  getUserById,
  changeUserInfo,
  changeAvatar,
} = require("../controllers/users");

router.get("/", getAllUsers); // get all users
router.get("/me", getMe); // get info about me
router.get("/:id", getUserById); // get user by id
router.patch("/me", userInfoValidation, changeUserInfo); // change user name and occupation
router.patch("/me/avatar", avatarValidation, changeAvatar); // change user avatar

module.exports = router;
