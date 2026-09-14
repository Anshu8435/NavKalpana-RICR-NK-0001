import express from 'express';
import {
  createPrediction,
  getUserReports,
  getReportById,
  getUserStatistics,
  deleteReport,
  testMLService,
} from './prediction.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  predictionSchema,
  querySchema,
  idSchema,
} from './prediction.validation.js';

const router = express.Router();

/**
 * Normalizes blood pressure if user accidentally entered them inverted
 * (e.g., entered diastolic in systolic field and vice-versa)
 */
const normalizeBloodPressure = (req, res, next) => {
  if (req.body && req.body.ap_hi != null && req.body.ap_lo != null) {
    const hi = Number(req.body.ap_hi);
    const lo = Number(req.body.ap_lo);
    if (!isNaN(hi) && !isNaN(lo) && lo > hi) {
      req.body.ap_hi = lo;
      req.body.ap_lo = hi;
    }
  }
  next();
};

router.use(protect);

router.get('/health', testMLService);

router.post('/', normalizeBloodPressure, validate(predictionSchema), createPrediction);

router.get('/reports', validate(querySchema, 'query'), getUserReports);

router.get('/statistics', getUserStatistics);

router.get('/reports/:reportId', validate(idSchema, 'params'), getReportById);

router.delete('/reports/:reportId', validate(idSchema, 'params'), deleteReport);

export default router;
