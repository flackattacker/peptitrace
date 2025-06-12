const express = require('express');
const VoteService = require('../services/voteService');
const { authenticateToken } = require('./middleware/auth');

const router = express.Router();

// POST /api/experiences/:experienceId/votes - Submit or update a vote
router.post('/experiences/:experienceId/votes', authenticateToken, async (req, res) => {
  try {
    console.log('POST /api/experiences/:experienceId/votes called');
    console.log('Experience ID:', req.params.experienceId);
    console.log('User ID:', req.user._id);
    console.log('Vote type:', req.body.type);

    const { type } = req.body;
    
    if (!type || !['helpful', 'detailed', 'concerning'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type. Must be helpful, detailed, or concerning.'
      });
    }

    const result = await VoteService.submitVote(req.user._id, req.params.experienceId, type);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('POST /api/experiences/:experienceId/votes error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/experiences/:experienceId/votes - Get all votes for an experience
router.get('/experiences/:experienceId/votes', async (req, res) => {
  try {
    console.log('GET /api/experiences/:experienceId/votes called');
    console.log('Experience ID:', req.params.experienceId);

    const result = await VoteService.getVotesForExperience(req.params.experienceId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('GET /api/experiences/:experienceId/votes error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/experiences/:experienceId/votes/user - Get current user's vote for an experience
router.get('/experiences/:experienceId/votes/user', authenticateToken, async (req, res) => {
  try {
    console.log('GET /api/experiences/:experienceId/votes/user called');
    console.log('Experience ID:', req.params.experienceId);
    console.log('User ID:', req.user._id);

    const result = await VoteService.getUserVoteForExperience(req.user._id, req.params.experienceId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('GET /api/experiences/:experienceId/votes/user error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/experiences/:experienceId/votes - Delete user's vote
router.delete('/experiences/:experienceId/votes', authenticateToken, async (req, res) => {
  try {
    console.log('DELETE /api/experiences/:experienceId/votes called');
    console.log('Experience ID:', req.params.experienceId);
    console.log('User ID:', req.user._id);

    const result = await VoteService.deleteVote(req.user._id, req.params.experienceId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('DELETE /api/experiences/:experienceId/votes error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;