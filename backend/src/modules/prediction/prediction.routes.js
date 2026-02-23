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

router.use(protect);

router.get('/health', testMLService);

router.post('/', validate(predictionSchema), createPrediction);

router.get('/reports', validate(querySchema, 'query'), getUserReports);

router.get('/statistics', getUserStatistics);

router.get('/reports/:reportId', validate(idSchema, 'params'), getReportById);

router.delete('/reports/:reportId', validate(idSchema, 'params'), deleteReport);

export default router;
