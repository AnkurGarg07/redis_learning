// set is used to store single variable
//hset->used to store object
//hgetall->used to get the entire object
//hdel->to delete object
//hexists->object avaliable or not
import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/user/:id/json", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await redis.set(`user:${id}:json`, JSON.stringify(data));
  res.json({ savedAs: "json", data });
});

app.get("/user/:id/json", async (req, res) => {
  const { id } = req.params;
  const data = await redis.get(`user:${id}:json`);
  res.json({ data: data ? JSON.parse(data) : "user not found" });
});

app.post("/user/:id/hash", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  await redis.hset(`user:${id}:hash`, data);
  res.json({ savedAs: "hash", data });
});

app.get("/user/:id/hash", async (req, res) => {
  const { id } = req.params;
  const data = await redis.hgetall(`user:${id}:hash`);
  res.json({ data: data });
});

app.listen(3000, () =>
  console.log("server is running on http://localhost:3000"),
);
