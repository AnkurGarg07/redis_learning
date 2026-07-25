import express from "express";
import Redis from "ioredis";
import { emailQueue } from "./queue.js";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/welcome-email", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name)
    return res.status(400).json({ message: "Email and name are required" });

  const job = await emailQueue.add(
    "welcome",
    {
      email,
      name,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );
  res.json({ jobId: job.id });
});

app.listen(3000, () =>
  console.log("server is running on http://localhost:3000"),
);
