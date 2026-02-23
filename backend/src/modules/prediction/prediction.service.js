import axios from 'axios';
import Visit from './visit.model.js';
import Report from './report.model.js';
import logger from '../../config/logger.js';
import ErrorResponse from '../../shared/errorResponse.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';


const createVisit = async (userId, patientData) => {
  try {
    const visit = await Visit.create({
      userId,
      patientData,
      status: 'pending',
    });

    logger.info('Visit created successfully', { visitId: visit._id, userId });
    return visit;
  } catch (error) {
    logger.error('Error creating visit', { error: error.message, userId });
    throw new ErrorResponse('Failed to create visit record', 500);
  }
};

const getPredictionFromML = async (patientData) => {
  try {
    logger.info('Calling ML service for prediction', { mlServiceUrl: ML_SERVICE_URL });

    const response = await axios.post(`${ML_SERVICE_URL}/predict`, patientData, {
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    logger.info('ML service responded successfully', {
      riskCategory: response.data.risk_category,
    });

    return response.data;
  } catch (error) {
    logger.error('ML service error', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response) {
      throw new ErrorResponse(
        `ML Service Error: ${error.response.data?.detail || error.message}`,
        error.response.status
      );
    } else if (error.request) {
      throw new ErrorResponse('ML Service is not responding. Please try again later.', 503);
    } else {
      throw new ErrorResponse('Failed to connect to ML Service', 500);
    }
  }
};


const createReport = async (visitId, userId, predictionData) => {
  try {
    const report = await Report.create({
      visitId,
      userId,
      prediction: predictionData,
      mlResponse: predictionData,
      processedAt: new Date(),
    });

    await Visit.findByIdAndUpdate(visitId, {
      status: 'completed',
      reportId: report._id,
    });

    logger.info('Report created successfully', { reportId: report._id, visitId });
    return report;
  } catch (error) {
    logger.error('Error creating report', { error: error.message, visitId });
    throw new ErrorResponse('Failed to create prediction report', 500);
  }
};

/**
 * Complete prediction flow: Create visit -> Get prediction -> Save report
 */
const processPrediction = async (userId, patientData) => {
  let visit;

  try {
    visit = await createVisit(userId, patientData);

    const prediction = await getPredictionFromML(patientData);

    const report = await createReport(visit._id, userId, prediction);

    return {
      visit: await Visit.findById(visit._id).select('-__v'),
      report: await Report.findById(report._id)
        .populate('visitId', 'patientData createdAt')
        .select('-__v'),
    };
  } catch (error) {
    if (visit) {
      await Visit.findByIdAndUpdate(visit._id, { status: 'failed' });
    }
    throw error;
  }
};


const getUserReports = async (userId, options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      riskCategory,
    } = options;

    const query = { userId };

    if (riskCategory) {
      query['prediction.risk_category'] = riskCategory;
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('visitId', 'patientData createdAt')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Report.countDocuments(query),
    ]);

    return {
      reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReports: total,
        hasMore: page * limit < total,
      },
    };
  } catch (error) {
    logger.error('Error fetching user reports', { error: error.message, userId });
    throw new ErrorResponse('Failed to fetch reports', 500);
  }
};


const getReportById = async (reportId, userId) => {
  try {
    const report = await Report.findOne({ _id: reportId, userId })
      .populate('visitId', 'patientData createdAt')
      .select('-__v');

    if (!report) {
      throw new ErrorResponse('Report not found', 404);
    }

    return report;
  } catch (error) {
    if (error instanceof ErrorResponse) {
      throw error;
    }
    logger.error('Error fetching report', { error: error.message, reportId });
    throw new ErrorResponse('Failed to fetch report', 500);
  }
};


const getUserStatistics = async (userId) => {
  try {
    const [totalReports, riskDistribution, recentReports] = await Promise.all([
      Report.countDocuments({ userId }),
      Report.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: '$prediction.risk_category',
            count: { $sum: 1 },
          },
        },
      ]),
      Report.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('visitId', 'patientData.age patientData.gender createdAt')
        .select('prediction.risk_category prediction.risk_probability createdAt'),
    ]);

    const riskStats = {
      'Low Risk': 0,
      'Moderate Risk': 0,
      'High Risk': 0,
    };

    riskDistribution.forEach((item) => {
      riskStats[item._id] = item.count;
    });

    return {
      totalReports,
      riskDistribution: riskStats,
      recentReports,
    };
  } catch (error) {
    logger.error('Error fetching user statistics', { error: error.message, userId });
    throw new ErrorResponse('Failed to fetch statistics', 500);
  }
};


const deleteReport = async (reportId, userId) => {
  try {
    const report = await Report.findOneAndDelete({ _id: reportId, userId });

    if (!report) {
      throw new ErrorResponse('Report not found', 404);
    }

    await Visit.findByIdAndDelete(report.visitId);

    logger.info('Report deleted successfully', { reportId, userId });
    return { message: 'Report deleted successfully' };
  } catch (error) {
    if (error instanceof ErrorResponse) {
      throw error;
    }
    logger.error('Error deleting report', { error: error.message, reportId });
    throw new ErrorResponse('Failed to delete report', 500);
  }
};

export default {
  createVisit,
  getPredictionFromML,
  createReport,
  processPrediction,
  getUserReports,
  getReportById,
  getUserStatistics,
  deleteReport,
};
