import { Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Job details", job.data);
    console.log("job id:", job.id);
    //simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Email sent successfully");
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.log(`Job ${job.id} failed with error: ${error}`);
});

worker.run();
export { worker };
