import { Request, Response, NextFunction } from "express";

class TokenBucket {
  bucketCapacity: number;
  tokens: number;
  refillRate: number;
  lastRefillTimeStamp: number;

  constructor(bucketCapacity: number, refillRate: number) {
    this.bucketCapacity = bucketCapacity;
    this.tokens = bucketCapacity;
    this.refillRate = refillRate;
    this.lastRefillTimeStamp = Date.now();
  }

  refillTokens(): void {
    const currentTime = Date.now();
    const timeelapsed = Math.floor(
      (currentTime - this.lastRefillTimeStamp) / 1000
    );
    this.tokens = Math.min(
      this.bucketCapacity,
      this.tokens + timeelapsed * this.refillRate
    );
    this.lastRefillTimeStamp = currentTime;
  }

  consumeTokens(): boolean {
    this.refillTokens();
    console.log(`Number of tokens is ${this.tokens}`);
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

const TokenBuckets: Record<string, TokenBucket> = {};

export const tokenBucketRateLimiting = (
  bucketCapacity: number,
  rateLimit: number
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    if (!ip) {
      return res.status(404).json({
        error: "IP NOT FOUND",
      });
    }

    if (!TokenBuckets[ip]) {
      TokenBuckets[ip] = new TokenBucket(bucketCapacity, rateLimit);
    }

    const bucket = TokenBuckets[ip];
    if (bucket.consumeTokens()) {
      return next();
    }

    return res.status(429).json({
      error: "Too many request",
    });
  };
};
