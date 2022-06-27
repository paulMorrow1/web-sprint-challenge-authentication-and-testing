const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

// Write your tests here
test("sanity", () => {
  expect(true).not.toBe(false);
});

const userAlreadyCreated = {
  username: "paulblart",
  password: "mallcop",
};
const userAlreadyCreatedWithIncorrectPassword = {
  username: "paulblart",
  password: "malcop",
};
const userWithUsernameAndPassword = {
  username: "a",
  password: "b",
};
const userWithUsernameNoPassword = {
  username: "c",
};
const userWithPasswordNoUsername = {
  password: "d",
};

beforeAll(async () => {
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
  await db("users").insert(userAlreadyCreated);
});
afterAll(async () => {
  await db.destroy();
});

describe("server.js", () => {
  describe("register endpoint", () => {
    test('[1] - sends back "username taken"', async () => {
      // test using 'userAlreadyCreated' user
      const res = await request(server)
        .post("/api/auth/register")
        .send(userAlreadyCreated)
        .set("Accept", "application/json");
    }, 2000);
    test('[2] - sends back "username and password required"', async () => {
      //  test using 'userWithUsernameNoPassword' or 'userWithPasswordNoUsername'
      const res = await request(server)
        .post("/api/auth/register")
        .send(userWithUsernameNoPassword)
        .set("Accept", "application/json");
    }, 2000);
  });

  describe("login endpoint", () => {
    test('[3] - sends back "invalid credentials"', async () => {
      //  test using 'userAlreadyCreatedWithIncorrectPassword'
      const res = await request(server)
        .post("/api/auth/login")
        .send(userAlreadyCreatedWithIncorrectPassword)
        .set("Accept", "application/json");
    }, 2000);
    test('[4] - sends back json response with "message" & "token"', async () => {
      // test using 'userAlreadyCreated'
      const res = await request(server)
        .post("/api/auth/login")
        .send(userAlreadyCreated)
        .set("Accept", "application/json");
    }, 2000);
  });

  describe("jokes endpoint", () => {
    test('[5] - sends back "token required"', async () => {
      // test endpoint without an authorization header
      const res = await request(server)
        .get("/api/jokes")
        .set("Accept", "application/json");
      expect(res.status).toBe(400);
      expect(res.body).toBe("token required");
    }, 2000);
    test('[6] - sends back "token invalid"', async () => {
      // test endpoint with an invalid authorization header
      const res = await request(server)
        .get("/api/jokes")
        .set("Authorization", "asdf")
        .set("Accept", "application/json");
      expect(res.status).toBe(400);
      expect(res.body).toBe("token invalid");
    }, 2000);
  });
});
