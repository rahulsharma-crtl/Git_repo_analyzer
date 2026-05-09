const express = require('express');
const { fetchGitHubData } = require('../services/githubService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/analytics/{username}:
 *   get:
 *     summary: Get GitHub analytics for a user
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub username
 *     responses:
 *       200:
 *         description: Successfully fetched analytics
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error or GitHub API Error
 */
router.get('/:username', authMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const data = await fetchGitHubData(username);
    res.json(data);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || 'Server error while fetching GitHub data' });
  }
});

module.exports = router;
