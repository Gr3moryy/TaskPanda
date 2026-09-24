import mongoSanitize from "express-mongo-sanitize";
import xss from "xss";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

export const mongoInjectionProtection = mongoSanitize({
  replaceWith: "_",
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] MongoDB injection attempt blocked: ${key} in ${req.path}`);
  },
});

export const xssProtection = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === "string") {
      return xss(obj, {
        whiteList: {},
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script"],
      });
    }
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === "object") {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };
  
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
};

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY] Rate limit exceeded: ${req.ip} on ${req.path}`);
    res.status(429).json({ error: "Too many requests, please try again later" });
  },
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many authentication attempts, please try again in 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.warn(`[SECURITY] Auth rate limit exceeded: ${req.ip} on ${req.path}`);
    res.status(429).json({ error: "Too many authentication attempts, please try again in 15 minutes" });
  },
});

export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many password reset requests, please try again in 1 hour" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY] Password reset rate limit exceeded: ${req.ip}`);
    res.status(429).json({ error: "Too many password reset requests, please try again in 1 hour" });
  },
});

export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: "Too many registration attempts, please try again in 1 hour" },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[SECURITY] Registration rate limit exceeded: ${req.ip}`);
    res.status(429).json({ error: "Too many registration attempts, please try again in 1 hour" });
  },
});

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn(`[SECURITY] Validation failed: ${req.ip} on ${req.path}`, errors.array());
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }
  next();
};

export const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  const maxSize = 1024 * 1024; // 1MB
  if (contentLength > maxSize) {
    return res.status(413).json({ error: "Request too large" });
  }
  next();
};

export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  next();
};

export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[SECURITY] CORS blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};