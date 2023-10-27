const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
