import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/post/:id/view", async (req, res) => {
  const { id } = req.params;

  // Increase the view count by 1
  const totalViews = await redis.incr(`post:${id}:views`);

  res.json({
    message: "View Added",
    postId: id,
    totalViews,
  });
});
app.post("/leaderboard/score", async (req, res) => {
  const { userId, score } = req.body;
  const result = await redis.zincrby("leaderboard", score, userId);

  res.json({
    message: "Score Added",
  });
});
app.get("/leaderboard", async (req, res) => {
  const leaderboard = await redis.zrevrange("leaderboard", 0, 9, "WITHSCORES");
  const result = [];
  for (let i = 0; i < leaderboard.length; i += 2) {
    result.push({
      userId: leaderboard[i],
      score: leaderboard[i + 1],
    });
  }
  res.json({ leaderboard: result });
});

app.get("/leaderBoard/:userId/rank", async (req, res) => {
  const { userId } = req.params;
  const rank = await redis.zrevrank("leaderboard", userId);
  if (rank == null) {
    res.json({ message: "User Not Found" });
  } else {
    res.json({ rank });
  }
});

app.listen(3000, () =>
  console.log("server is running on http://localhost:3000"),
);
