const router = require("express").Router();
const db = require("../../data/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../users/users-model");

const SALT = 4;

const SECRET = "billybobthorton";

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  // register user
  try {
    if (!username || !password) {
      res.status(400).send("username and password required");
    } else if (username) {
      const usernameExists = await Users.findBy({ username }).first();
      if (usernameExists) {
        return res.status(400).send("username taken");
      }
      const hashedPassword = await bcrypt.hash(password, SALT);
      const [newlyCreatedUserId] = await db("users").insert({
        username: username,
        password: hashedPassword,
      });
      if (newlyCreatedUserId) {
        const newUser = await db("users")
          .where("id", newlyCreatedUserId)
          .first();
        res.json(newUser);
      }
    }
  } catch (err) {
    next(err);
  }
});

/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

router.post("/login", async (req, res) => {
  const payload = req.body;
  if (!payload.username || !payload.password) {
    res.status(400).send("username and password required");
  } else if (payload) {
    // get user by username
    const user = await db("users").where("username", payload.username).first();
    // user = { username: '' , password: '' };

    if (user) {
      // check if founds user hashed password match payload password
      const match = await bcrypt.compare(payload.password, user.password);

      // if a match is found, we have the correct user and their credentials
      if (match) {
        // create token
        // resspond with a json payload with keys 'message' and 'token'
        // 'message' value being "Welcome, {users username}"
        const token = jwt.sign(
          { id: user.id, username: user.username },
          SECRET
        );
        console.log("token: ", token);
        res.json({ message: `Welcome, ${user.username}`, token: token });
      } else {
        // if no match is found, we don't have the correct users credentials
        res.status(400).send("invalid credentials");
      }
    } else {
      // no user found
      res.status(400).send("invalid credentials");
    }
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
