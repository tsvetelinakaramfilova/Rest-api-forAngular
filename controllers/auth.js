const { userModel, tokenBlacklistModel } = require("../models");

const utils = require("../utils");
const { authCookieName } = require("../app-config");

const bsonToJson = (data) => {
  return JSON.parse(JSON.stringify(data));
};
const removePassword = (data) => {
  const { password, __v, ...userData } = data;
  return userData;
};

function register(req, res, next) {
  const { email, username, img, password, repeatPassword } = req.body;

  return userModel
    .create({ email, username, img, password })
    .then((createdUser) => {
      createdUser = bsonToJson(createdUser);
      createdUser = removePassword(createdUser);

      const token = utils.jwt.createToken({ id: createdUser._id });
      if (process.env.NODE_ENV === "production") {
        res.cookie(authCookieName, token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      } else {
        res.cookie(authCookieName, token, { httpOnly: true });
      }
      res.status(200).send(createdUser);
    })
    .catch((err) => {
      if (err.name === "MongoError" && err.code === 11000) {
        let field = err.message.split("index: ")[1];
        field = field.split(" dup key")[0];
        field = field.substring(0, field.lastIndexOf("_"));

        res
          .status(409)
          .send({ message: `This ${field} is already registered!` });
        return;
      }
      next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  userModel
    .findOne({ email })
    .then((user) => {
      return Promise.all([user, user ? user.matchPassword(password) : false]);
    })
    .then(([user, match]) => {
      if (!match) {
        res.status(401).send({ message: "Wrong email or password" });
        return;
      }
      user = bsonToJson(user);
      user = removePassword(user);

      const token = utils.jwt.createToken({ id: user._id });

      if (process.env.NODE_ENV === "production") {
        res.cookie(authCookieName, token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      } else {
        res.cookie(authCookieName, token, { httpOnly: true });
      }
      res.status(200).send(user);
    })
    .catch(next);
}

function changePassword(req, res, next) {
  const { _id: userId } = req.user;
  const { password, newPassword } = req.body;

  userModel
    .findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }

      return Promise.all([user, user.matchPassword(password)]);
    })
    .then(([user, match]) => {
      if (!match) {
        res.status(401).send({ message: "Incorrect password" });
        return;
      }

      // Update the user's password
      user.password = newPassword;
      return user.save();
    })
    .then((updatedUser) => {
      res.status(200).send({ message: "Password updated successfully" });
    })
    .catch(next);
}


function logout(req, res) {
  const token = req.cookies[authCookieName];

  tokenBlacklistModel
    .create({ token })
    .then(() => {
      res
        .clearCookie(authCookieName)
        .status(204)
        .send({ message: "Logged out!" });
    })
    .catch((err) => res.send(err));
}

function getProfileInfo(req, res, next) {
  const { _id: userId } = req.user;

  userModel
    .findOne({ _id: userId }, { password: 0, __v: 0 })
    .populate("likedRecipes")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
}

function editProfileInfo(req, res, next) {
  const { _id: userId } = req.user;
  const { img, username, email } = req.body;

  userModel
    .findOneAndUpdate(
      { _id: userId },
      { img, username, email },
      { runValidators: true, new: true }
    )
    .then((x) => {
      res.status(200).json(x);
    })
    .catch(next);
}

module.exports = {
  login,
  register,
  logout,
  getProfileInfo,
  editProfileInfo,
  changePassword,
};
