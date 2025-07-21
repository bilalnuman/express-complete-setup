import rateLimit from 'express-rate-limit';
import { toManyAttempts } from '../utils/responseMessages';

export const RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"

export const updateProfileRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: toManyAttempts,
    error: RATE_LIMIT_EXCEEDED
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});


export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: toManyAttempts,
    error: RATE_LIMIT_EXCEEDED
  },
  standardHeaders: true,
  legacyHeaders: false,
});


export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: toManyAttempts,
    error: 'STRICT_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});