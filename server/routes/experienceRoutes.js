const express = require('express');
const router = express.Router();
const ExperienceService = require('../services/experienceService');
const VoteService = require('../services/voteService');
const { authenticateToken, requireAuth } = require('./middleware/auth');

console.log('experienceRoutes.js: Loading experience routes file');

// Apply authenticateToken middleware to all routes
router.use(authenticateToken);

/**
 * @route GET /api/experiences
 * @desc Get all experiences with optional filters
 * @access Public
 */
router.get('/', async (req, res) => {
  console.log('experienceRoutes: GET / endpoint hit');
  try {
    const result = await ExperienceService.getAll(req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/:id
 * @desc Get a single experience by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  console.log('experienceRoutes: GET /:id endpoint hit');
  try {
    const experience = await ExperienceService.getById(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /:id:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/experiences
 * @desc Create a new experience
 * @access Public
 */
router.post('/', async (req, res) => {
  console.log('experienceRoutes: POST / endpoint hit');
  try {
    const experience = await ExperienceService.create(req.user?._id, req.body);
    res.status(201).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('experienceRoutes: Error in POST /:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route PUT /api/experiences/:id
 * @desc Update an experience
 * @access Private
 */
router.put('/:id', requireAuth, async (req, res) => {
  console.log('experienceRoutes: PUT /:id endpoint hit');
  try {
    const experience = await ExperienceService.update(req.params.id, req.user._id, req.body);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('experienceRoutes: Error in PUT /:id:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/experiences/:id
 * @desc Delete an experience
 * @access Private
 */
router.delete('/:id', requireAuth, async (req, res) => {
  console.log('experienceRoutes: DELETE /:id endpoint hit');
  try {
    const result = await ExperienceService.deleteById(req.params.id, req.user._id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('experienceRoutes: Error in DELETE /:id:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/:id/votes
 * @desc Get votes for an experience
 * @access Public
 */
router.get('/:id/votes', async (req, res) => {
  console.log('experienceRoutes: GET /:id/votes endpoint hit');
  try {
    const votes = await VoteService.getVotesForExperience(req.params.id);
    res.status(200).json({
      success: true,
      data: votes
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /:id/votes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/experiences/:id/votes
 * @desc Submit a vote on an experience
 * @access Private
 */
router.post('/:id/votes', requireAuth, async (req, res) => {
  console.log('experienceRoutes: POST /:id/votes endpoint hit');
  try {
    const vote = await VoteService.submitVote(req.user._id, req.params.id, req.body.type);
    res.status(200).json({
      success: true,
      data: vote
    });
  } catch (error) {
    console.error('experienceRoutes: Error in POST /:id/votes:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/peptide/:peptideId
 * @desc Get experiences for a specific peptide
 * @access Public
 */
router.get('/peptide/:peptideId', async (req, res) => {
  console.log('experienceRoutes: GET /peptide/:peptideId endpoint hit');
  try {
    const { peptideId } = req.params;
    const result = await ExperienceService.getByPeptideId(peptideId, req.query);
    console.log('experienceRoutes: Experiences for peptide retrieved successfully, count:', result.experiences.length);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /peptide/:peptideId:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/tracking/:trackingId
 * @desc Get an experience by tracking ID
 * @access Public
 */
router.get('/tracking/:trackingId', async (req, res) => {
  console.log('experienceRoutes: GET /tracking/:trackingId endpoint hit');
  try {
    const experience = await ExperienceService.getByTrackingId(req.params.trackingId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    res.status(200).json({
      success: true,
      data: { experience }
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /tracking/:trackingId:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

console.log('experienceRoutes.js: Routes defined successfully');

module.exports = router;