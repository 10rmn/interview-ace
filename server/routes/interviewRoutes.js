const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const authMiddleware = require('../middleware/auth');
const { interviewLimiter } = require('../middleware/rateLimiter');

/**
 * All routes require authentication
 */
router.use(authMiddleware);

/**
 * Interview routes
 */
router.post('/start', interviewLimiter, interviewController.startInterview);
router.post('/answer', interviewController.submitAnswer);
router.get('/history', interviewController.getHistory);
router.get('/analytics/performance', interviewController.getAnalytics);
router.get('/:id', interviewController.getSessionDetail);

module.exports = router;
