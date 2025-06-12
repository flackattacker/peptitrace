const express = require('express');
const router = express.Router();
const SeedService = require('../services/seedService');

/**
 * @route POST /api/seed/peptides
 * @desc Seed the database with initial peptide data
 * @access Public
 */
router.post('/peptides', async (req, res) => {
  try {
    const result = await SeedService.seedPeptides();
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        count: result.count,
        peptides: result.peptides || []
      }
    });
  } catch (error) {
    console.error('Seed peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/seed/peptides
 * @desc Clear all peptide data from the database
 * @access Public
 */
router.delete('/peptides', async (req, res) => {
  try {
    const result = await SeedService.clearPeptides();
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Clear peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/seed/effects
 * @desc Seed the database with initial effects and side effects data
 * @access Public
 */
router.post('/effects', async (req, res) => {
  try {
    const result = await SeedService.seedEffects();

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        count: result.count,
        effects: result.effects || []
      }
    });
  } catch (error) {
    console.error('Seed effects error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/seed/effects
 * @desc Clear all effects data from the database
 * @access Public
 */
router.delete('/effects', async (req, res) => {
  try {
    const result = await SeedService.clearEffects();

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Clear effects error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;