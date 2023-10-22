const jwt = require("jsonwebtoken");
const env = require("../constants") 


const {SECRET_KEY} = env;

const Auth = {
  authenticateToken: (req, res, next) => {
    const url = req.url;
    const authHeader = req.headers["authorization"];
    const token = authHeader;
    if (url.includes("/login") || url.includes("/register")) return next();
    else if (token == null) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  },
};

module.exports = Auth;
