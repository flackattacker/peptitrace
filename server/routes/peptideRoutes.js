const express = require('express');
const router = express.Router();
const PeptideService = require('../services/peptideService');
const { authenticateToken } = require('./middleware/auth');

/**
 * @route GET /api/peptides
 * @desc Get all peptides
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    console.log('peptideRoutes: GET / endpoint hit');
    
    const peptides = await PeptideService.getAll();
    
    console.log('peptideRoutes: Peptides retrieved successfully, count:', peptides.length);
    
    res.status(200).json({
      success: true,
      data: {
        peptides
      }
    });
  } catch (error) {
    console.error('Get peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/peptides/:id
 * @desc Get peptide by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    console.log('peptideRoutes: GET /:id endpoint hit with id:', req.params.id);
    
    const peptide = await PeptideService.getById(req.params.id);
    
    console.log('peptideRoutes: Peptide retrieved successfully:', peptide._id);
    
    res.status(200).json({
      success: true,
      data: {
        peptide
      }
    });
  } catch (error) {
    console.error('Get peptide by ID error:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/peptides
 * @desc Create a new peptide
 * @access Private
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('peptideRoutes: POST / endpoint hit');
    
    const peptide = await PeptideService.create(req.body);
    
    console.log('peptideRoutes: Peptide created successfully:', peptide._id);
    
    res.status(201).json({
      success: true,
      data: {
        peptide
      }
    });
  } catch (error) {
    console.error('Create peptide error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route PUT /api/peptides/:id
 * @desc Update a peptide
 * @access Private
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('peptideRoutes: PUT /:id endpoint hit with id:', req.params.id);
    
    const peptide = await PeptideService.update(req.params.id, req.body);
    
    console.log('peptideRoutes: Peptide updated successfully:', peptide._id);
    
    res.status(200).json({
      success: true,
      data: {
        peptide
      }
    });
  } catch (error) {
    console.error('Update peptide error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/peptides/:id
 * @desc Delete a peptide
 * @access Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    console.log('peptideRoutes: DELETE /:id endpoint hit with id:', req.params.id);
    
    const result = await PeptideService.deleteById(req.params.id);
    
    console.log('peptideRoutes: Peptide deleted successfully');
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Delete peptide error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/peptides/search/:query
 * @desc Search peptides
 * @access Public
 */
router.get('/search/:query', async (req, res) => {
  try {
    console.log('peptideRoutes: GET /search/:query endpoint hit with query:', req.params.query);
    
    const peptides = await PeptideService.search(req.params.query);
    
    console.log('peptideRoutes: Peptide search completed, found:', peptides.length);
    
    res.status(200).json({
      success: true,
      data: {
        peptides
      }
    });
  } catch (error) {
    console.error('Search peptides error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;