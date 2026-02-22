import predictionService from './prediction.service.js';
import logger from '../../config/logger.js';
import ErrorResponse from '../../shared/errorResponse.js';

/**
 * @desc    Create new prediction and get report
 * @route   POST /api/predictions
 * @access  Private
 */
export const createPrediction = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const patientData = req.body;

    logger.info('Creating new prediction', { userId });

    // Process prediction (create visit, call ML, save report)
    const result = await predictionService.processPrediction(userId, patientData);

    res.status(201).json({
      success: true,
      message: 'Prediction completed successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error in createPrediction controller', { error: error.message });
    next(error);
  }
};

/**
 * @desc    Get all user's reports
 * @route   GET /api/predictions/reports
 * @access  Private
 */
export const getUserReports = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, limit, sortBy, order, riskCategory } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortBy: sortBy || 'createdAt',
      order: order || 'desc',
      riskCategory,
    };

    logger.info('Fetching user reports', { userId, options });

    const result = await predictionService.getUserReports(userId, options);

    res.status(200).json({
      success: true,
      message: 'Reports retrieved successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Error in getUserReports controller', { error: error.message });
    next(error);
  }
};

/**
 * @desc    Get single report by ID
 * @route   GET /api/predictions/reports/:reportId
 * @access  Private
 */
export const getReportById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { reportId } = req.params;

    logger.info('Fetching report by ID', { userId, reportId });

    const report = await predictionService.getReportById(reportId, userId);

    res.status(200).json({
      success: true,
      message: 'Report retrieved successfully',
      data: report,
    });
  } catch (error) {
    logger.error('Error in getReportById controller', { error: error.message });
    next(error);
  }
};

/**
 * @desc    Get user's prediction statistics
 * @route   GET /api/predictions/statistics
 * @access  Private
 */
export const getUserStatistics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    logger.info('Fetching user statistics', { userId });

    const statistics = await predictionService.getUserStatistics(userId);

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: statistics,
    });
  } catch (error) {
    logger.error('Error in getUserStatistics controller', { error: error.message });
    next(error);
  }
};

/**
 * @desc    Delete a report
 * @route   DELETE /api/predictions/reports/:reportId
 * @access  Private
 */
export const deleteReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { reportId } = req.params;

    logger.info('Deleting report', { userId, reportId });

    const result = await predictionService.deleteReport(reportId, userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    logger.error('Error in deleteReport controller', { error: error.message });
    next(error);
  }
};

/**
 * @desc    Test ML service connection
 * @route   GET /api/predictions/health
 * @access  Private
 */
export const testMLService = async (req, res, next) => {
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    logger.info('Testing ML service connection', { mlServiceUrl });

    const axios = (await import('axios')).default;
    const response = await axios.get(mlServiceUrl, { timeout: 5000 });

    res.status(200).json({
      success: true,
      message: 'ML service is reachable',
      mlServiceUrl,
      mlResponse: response.data,
    });
  } catch (error) {
    logger.error('ML service health check failed', { error: error.message });
    res.status(503).json({
      success: false,
      message: 'ML service is not reachable',
      error: error.message,
    });
  }
};
