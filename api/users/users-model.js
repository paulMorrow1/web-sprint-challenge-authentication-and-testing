const db = require("../../data/dbConfig.js");

function findBy(filter) {
  return db("users").select("id", "username", "password").where(filter);
}

module.exports = {
  findBy,
};
