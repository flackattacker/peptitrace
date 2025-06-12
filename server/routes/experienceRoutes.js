const express = require('express');
const router = express.Router();
const ExperienceService = require('../services/experienceService');
const VoteService = require('../services/voteService');
const { authenticateToken } = require('./middleware/auth');

console.log('experienceRoutes.js: Loading experience routes file');

// Add logging middleware for all experience routes
router.use((req, res, next) => {
  console.log(`experienceRoutes: ${req.method} ${req.originalUrl} called`);
  console.log('experienceRoutes: Request headers:', req.headers);
  console.log('experienceRoutes: Request body:', req.body);
  console.log('experienceRoutes: Request query:', req.query);
  next();
});

/**
 * @route POST /api/experiences
 * @desc Create a new experience
 * @access Private
 */
router.post('/', authenticateToken, async (req, res) => {
  console.log('experienceRoutes: POST / endpoint hit');
  try {
    const result = await ExperienceService.create(req.user._id, req.body);
    console.log('experienceRoutes: Experience created successfully:', result);

    res.status(201).json({
      success: true,
      data: result
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
 * @route GET /api/experiences/tracking/:trackingId
 * @desc Get experience by tracking ID
 * @access Public
 */
router.get('/tracking/:trackingId', async (req, res) => {
  console.log('experienceRoutes: GET /tracking/:trackingId endpoint hit');
  try {
    const { trackingId } = req.params;
    const experience = await ExperienceService.getByTrackingId(trackingId);
    console.log('experienceRoutes: Experience found by tracking ID:', experience._id);

    res.status(200).json({
      success: true,
      experience
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /tracking/:trackingId:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences
 * @desc Get all experiences with optional filters
 * @access Public
 */
router.get('/', async (req, res) => {
  console.log('experienceRoutes: GET / endpoint hit');
  try {
    const result = await ExperienceService.getAll(req.query);
    console.log('experienceRoutes: Experiences retrieved successfully, count:', result.experiences.length);

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
 * @route GET /api/experiences/:id
 * @desc Get experience by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  console.log('experienceRoutes: GET /:id endpoint hit');
  try {
    const experience = await ExperienceService.getById(req.params.id);
    console.log('experienceRoutes: Experience retrieved successfully:', experience._id);

    res.status(200).json({
      success: true,
      experience
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /:id:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route GET /api/experiences/:id/vote
 * @desc Get user's vote for an experience
 * @access Private
 */
router.get('/:id/vote', authenticateToken, async (req, res) => {
  console.log('experienceRoutes: GET /:id/vote endpoint hit');
  try {
    const experienceId = req.params.id;
    const userId = req.user._id;

    const result = await VoteService.getUserVote(userId, experienceId);
    console.log('experienceRoutes: User vote retrieved successfully:', result);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('experienceRoutes: Error in GET /:id/vote:', error);
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route POST /api/experiences/:id/vote
 * @desc Vote on an experience
 * @access Private
 */
router.post('/:id/vote', authenticateToken, async (req, res) => {
  console.log('experienceRoutes: POST /:id/vote endpoint hit');
  try {
    const { voteType } = req.body;
    const experienceId = req.params.id;
    const userId = req.user._id;

    // Submit vote through VoteService
    const voteResult = await VoteService.submitVote(userId, experienceId, voteType);

    // Update experience vote counts
    const updateResult = await ExperienceService.updateVotes(experienceId, voteType);

    console.log('experienceRoutes: Vote submitted successfully:', voteResult);

    res.status(200).json({
      success: true,
      ...updateResult
    });
  } catch (error) {
    console.error('experienceRoutes: Error in POST /:id/vote:', error);
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
router.delete('/:id', authenticateToken, async (req, res) => {
  console.log('experienceRoutes: DELETE /:id endpoint hit');
  try {
    const result = await ExperienceService.deleteById(req.params.id, req.user._id);
    console.log('experienceRoutes: Experience deleted successfully');

    res.status(200).json(result);
  } catch (error) {
    console.error('experienceRoutes: Error in DELETE /:id:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

console.log('experienceRoutes.js: Routes defined successfully');

module.exports = router;