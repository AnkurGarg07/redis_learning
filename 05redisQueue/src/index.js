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

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject,
    body: req.body.body,
    id: Date.now(),
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(job));
  res.json({ data: job });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(QUEUE_KEY);
  if (!rawJob) {
    return res.json({ data: "no job found" });
  }

  const job = JSON.parse(rawJob);
  //simulate email sending
  res.json({ data: "Email sent successfully" });
});

app.listen(3000, () =>
  console.log("server is running on http://localhost:3000"),
);
