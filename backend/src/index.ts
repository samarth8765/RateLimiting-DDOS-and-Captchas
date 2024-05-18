import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "SECRET_KEY";
app.use(cors());
app.use(express.json());

import { rateLimit } from "express-rate-limit";

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 4,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const otpService: Record<string, string> = {};

app.post("/generate-otp", otpLimiter, (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(404).json({
      error: "Please send the email",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpService[email] = otp;

  console.log(`OTP for ${email} is ${otp}`);
  res.status(201).json({
    message: "OTP gen and logged",
  });
});

app.post("/reset-password", passwordLimiter, async (req, res) => {
  const { email, password, otp, token } = req.body;
  if (!email || !password || !otp || !token) {
    return res.status(404).json({
      error: "Email, password, otp required",
    });
  }

  // verifying token
  let formData = new FormData();
  formData.append("secret", SECRET_KEY);
  formData.append("response", token);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });

  const outcome = await result.json();
  if (!outcome.success) {
    return res.json("Invalid Captcha");
  }

  if (otpService[email] == otp) {
    console.log(`Password of ${email} is reset to ${password}`);
    return res.status(200).json({
      message: "Password reset succesfully",
    });
  } else {
    return res.status(404).json({
      error: "Invalid OTP",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
