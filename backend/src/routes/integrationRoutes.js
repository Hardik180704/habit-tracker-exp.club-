import express from 'express';
import * as integrationController from '../controllers/integrationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Spotify
router.get('/spotify/auth', authMiddleware, integrationController.authorizeSpotify);
router.post('/spotify/callback', authMiddleware, integrationController.callbackSpotify);
router.get('/spotify/status', authMiddleware, integrationController.getSpotifyStatus);
router.post('/spotify/play', authMiddleware, integrationController.spotifyPlay);
router.post('/spotify/pause', authMiddleware, integrationController.spotifyPause);
router.post('/spotify/next', authMiddleware, integrationController.spotifyNext);
router.post('/spotify/previous', authMiddleware, integrationController.spotifyPrevious);

// Notion
router.get('/notion/auth', authMiddleware, integrationController.authorizeNotion);
router.post('/notion/callback', authMiddleware, integrationController.callbackNotion);
router.get('/notion/status', authMiddleware, integrationController.getNotionStatus);
router.get('/notion/pages', authMiddleware, integrationController.getNotionPages);

export default router;
