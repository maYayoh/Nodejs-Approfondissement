const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }

    jwt.verify(token, config.secretJwtToken, (err, user) => {
      if (err) {
        throw "invalid token";
      }
      req.user = user;
      next();
    });

  } catch (message) {
    next(new UnauthorizedError(message));
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new UnauthorizedError());
  }
}

module.exports.isAdmin = isAdmin;
