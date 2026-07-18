import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpKey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(otpKey(phone), otp, "EX", 30); //valid only for 30 second
  res.json({ success: true, message: "OTP sent successfully", otp });
});

app.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  const exists = await redis.exists(otpKey(phone));
  if (exists) {
    const actualOtp = await redis.get(otpKey(phone));
    if (actualOtp === otp) {
      await redis.del(otpKey(phone));
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      res.json({ success: false, message: "Invalid OTP" });
    }
  } else {
    res.json({ success: false, message: "OTP expired" });
  }
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const exists = await redis.exists(otpKey(phone));
  if (exists) {
    const ttl = await redis.ttl(otpKey(phone));
    res.json({ ttl });
  } else {
    res.json({ message: "OTP does not exists" });
  }
});

app.listen(3000, () =>
  console.log("server is running on http://localhost:3000"),
);
