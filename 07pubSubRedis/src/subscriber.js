import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notifications", (err) => {
  if (err) {
    console.log("Error subscribing ", err.message);
    return;
  }
  console.log("connected to notifications channel");
});

subscriber.on("message", (channel, message) => {
  console.log(`Message received in ${channel}`, message);
});
