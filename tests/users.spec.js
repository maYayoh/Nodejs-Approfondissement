const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const usersService = require("../api/users/users.service");

describe("tester API users", () => {
  let token;
  const USER_ID = "fake";
  const MOCK_DATA = [
    {
      _id: USER_ID,
      name: "dummy",
      email: "mock@dummy.foo",
      password: "azerty123",
    },
  ];
  const MOCK_DATA_CREATED = {
    name: "dummy",
    email: "created@dummy.foo",
    password: "azerty123",
  };


  const ADMIN_MOCK = {
    name: "admin",
    email: "admin@dummy.foo",
    password: "loulou123",
    role: "admin",
  }

  let user

  beforeEach(async () => {
    const userData = await request(app)
      .post("/api/users")
      .send(ADMIN_MOCK)

    user = userData.body

    token = jwt.sign({ userId: user._id }, config.secretJwtToken);
    // mongoose.Query.prototype.find = jest.fn().mockResolvedValue(MOCK_DATA);
    mockingoose(User).toReturn(MOCK_DATA, "find");
    mockingoose(User).toReturn(MOCK_DATA_CREATED, "save");
  });

  test("[Users] Get All", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("[Users] Create User", async () => {
    const res = await request(app)
      .post("/api/users")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(MOCK_DATA_CREATED.name);
  });

  test("Est-ce userService.getAll", async () => {
    const spy = jest
      .spyOn(usersService, "getAll")
      .mockImplementation(() => "test");
    await request(app).get("/api/users").set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith("test");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
