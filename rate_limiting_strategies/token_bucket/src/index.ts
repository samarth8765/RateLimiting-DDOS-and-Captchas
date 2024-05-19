import express from "express";
import { tokenBucketRateLimiting } from "./token_bucket";

const app = express();
const PORT = process.env.PORT || 3001;
const bucketCapacity = 3;
const rateLimit = 1;

app.use(tokenBucketRateLimiting(bucketCapacity, rateLimit));

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Hola Amigos",
  });
});

app.listen(PORT, () => {
  console.log(`Listening at PORT ${PORT}`);
});
