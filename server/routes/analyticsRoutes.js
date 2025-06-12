const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/analyticsService');

/**
 * @route GET /api/analytics
 * @desc Get usage analytics and peptide effectiveness data
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    console.log('analyticsRoutes: GET / endpoint hit');
    
    const usageData = await AnalyticsService.getUsageAnalytics();
    const effectivenessData = await AnalyticsService.getPeptideEffectiveness();
    
    console.log('analyticsRoutes: Usage data retrieved:', usageData);
    console.log('analyticsRoutes: Effectiveness data retrieved:', effectivenessData);

    const response = {
      success: true,
      data: {
        ...usageData,
        effectivenessData
      }
    };

    console.log('analyticsRoutes: Sending response with real data');
    res.status(200).json(response);
  } catch (error) {
    console.error('Analytics general error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/peptide-effectiveness
 * @desc Get peptide effectiveness data
 * @access Public
 */
router.get('/peptide-effectiveness', async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /peptide-effectiveness endpoint hit');
    
    const data = await AnalyticsService.getPeptideEffectiveness();
    
    console.log('analyticsRoutes: Peptide effectiveness data retrieved, count:', data.length);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics peptide effectiveness error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/peptide-trends
 * @desc Get peptide trends data
 * @access Public
 */
router.get('/peptide-trends', async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /peptide-trends endpoint hit');
    
    const { period = 'monthly', limit = 12 } = req.query;
    const data = await AnalyticsService.getPeptideTrends(period, parseInt(limit));
    
    console.log('analyticsRoutes: Peptide trends data retrieved');
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics peptide trends error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/peptide-comparison
 * @desc Compare multiple peptides
 * @access Public
 */
router.get('/peptide-comparison', async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /peptide-comparison endpoint hit');
    
    const { peptideIds } = req.query;
    
    if (!peptideIds) {
      return res.status(400).json({
        success: false,
        error: 'Peptide IDs are required'
      });
    }
    
    const ids = Array.isArray(peptideIds) ? peptideIds : peptideIds.split(',');
    const data = await AnalyticsService.getPeptideComparison(ids);
    
    console.log('analyticsRoutes: Peptide comparison data retrieved, count:', data.length);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics peptide comparison error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/analytics/trends
 * @desc Get general trends data
 * @access Public
 */
router.get('/trends', async (req, res) => {
  try {
    console.log('analyticsRoutes: GET /trends endpoint hit');
    
    const data = await AnalyticsService.getTrends();
    
    console.log('analyticsRoutes: Trends data retrieved, count:', data.length);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Analytics trends error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;