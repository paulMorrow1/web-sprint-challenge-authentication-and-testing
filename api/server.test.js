const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

// Write your tests here
test("sanity", () => {
  expect(true).not.toBe(false);
});

const userAlreadyCreated = {
  username: "paulblart",
  password: "$2b$04$cvCOQ2F7CQH3kWV6On6tPuB8NtlZrbjy1jpzhNRmUWY38a7TZXVj6",
};
const userAlreadyCreatedWithIncorrectPassword = {
  username: "paulblart",
  password: "mallcop",
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
  await db.migrate.rollback();
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
      const res = await request(server)
        .post("/api/auth/register")
        .send(userAlreadyCreated);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("username taken");
    }, 750);
  });
  test('[2] - sends back "username and password required"', async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send(userWithUsernameNoPassword);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("username and password required");
  }, 750);
});

describe("login endpoint", () => {
  test('[3] - sends back "invalid credentials"', async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send(userAlreadyCreatedWithIncorrectPassword);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("invalid credentials");
  }, 750);

  // const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
  test('[4] - sends back json response with "message"', async () => {
    let res = await request(server)
      .post("/api/auth/login")
      .send({ username: "daffyduck", password: "geewizz" });

    // expect(res.status).toBe(200);
    expect(res.body.message).toBe("invalid credentials");
  }, 750);
});

describe("jokes endpoint", () => {
  test('[5] - sends back "token required"', async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("token required");
  }, 750);
  test('[6] - sends back "token invalid"', async () => {
    const res = await request(server)
      .get("/api/jokes")
      .set("Authorization", "asdf");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("token invalid");
  }, 750);
});
