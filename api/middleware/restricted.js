const jwt = require("jsonwebtoken");

const SECRET = "billybobthorton";

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

  // if token exists in the Authorization header
  if (req.headers.authorization) {
    // if token is valid from the Authorization header call next
    try {
      const decodedToken = jwt.verify(req.headers.authorization, SECRET);
      console.log("decodedToken: ", decodedToken);
      next();
    } catch {
      res.status(400).json({ message: "token invalid" });
    }
  } else {
    // response saying 'token required'
    res.status(400).json({ message: "token required" });
  }
};
