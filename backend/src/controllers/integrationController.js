import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOTION_TOKEN_URL = 'https://api.notion.com/v1/oauth/token';

export const authorizeSpotify = async (req, res) => {
  console.log('Authorize Spotify hit');
  const scope = 'user-read-currently-playing user-read-playback-state user-modify-playback-state';
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  console.log('Spotify Config:', { redirectUri, clientId: clientId ? 'Present' : 'Missing' });

  // Add state=spotify to identify the source on return
  const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=spotify`;
  console.log('Generated Spotify URL:', url);
  res.json({ url });
};

export const callbackSpotify = async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  try {
    const response = await axios.post(SPOTIFY_TOKEN_URL, new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    }), {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await prisma.integration.upsert({
      where: {
        userId_provider: {
          userId,
          provider: 'SPOTIFY'
        }
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt
      },
      create: {
        userId,
        provider: 'SPOTIFY',
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Spotify Callback Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to authenticate with Spotify' });
  }
};

// Helper to refresh Spotify token
const refreshSpotifyToken = async (integration) => {
  if (!integration.refreshToken) throw new Error('No refresh token available');

  try {
    const response = await axios.post(SPOTIFY_TOKEN_URL, new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: integration.refreshToken,
    }), {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // Update in DB
    const updated = await prisma.integration.update({
      where: { id: integration.id },
      data: {
        accessToken: access_token,
        // Spotify may or may not return a new refresh token
        refreshToken: refresh_token || integration.refreshToken,
        expiresAt
      }
    });

    return updated.accessToken;
  } catch (error) {
    console.error('Spotify Refresh Error:', error.response?.data || error.message);
    throw new Error('Failed to refresh Spotify token');
  }
};

export const getSpotifyStatus = async (req, res) => {
  const userId = req.userId;
  try {
    const integration = await prisma.integration.findUnique({
      where: { userId_provider: { userId, provider: 'SPOTIFY' } }
    });

    if (!integration) {
      return res.json({ isConnected: false });
    }

    let token = integration.accessToken;

    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 204 || !response.data) {
        return res.json({ isConnected: true, isPlaying: false });
      }

      const item = response.data.item;
      res.json({
        isConnected: true,
        isPlaying: response.data.is_playing,
        track: {
          name: item.name,
          artist: item.artists.map(a => a.name).join(', '),
          albumArt: item.album.images[0]?.url,
          progress: response.data.progress_ms,
          duration: item.duration_ms
        }
      });
    } catch (apiError) {
      // If 401, try to refresh
      if (apiError.response?.status === 401) {
        console.log('Spotify token expired, refreshing...');
        try {
          token = await refreshSpotifyToken(integration);
          
          // Retry original request
          const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.status === 204 || !response.data) {
            return res.json({ isConnected: true, isPlaying: false });
          }

          const item = response.data.item;
          return res.json({
            isConnected: true,
            isPlaying: response.data.is_playing,
            track: {
              name: item.name,
              artist: item.artists.map(a => a.name).join(', '),
              albumArt: item.album.images[0]?.url,
              progress: response.data.progress_ms,
              duration: item.duration_ms
            }
          });
        } catch (refreshError) {
           throw refreshError; // Will be caught by outer catch
        }
      }
      throw apiError;
    }

  } catch (error) {
     console.error('Spotify Status Error:', error.message);
     // If refresh failed or other error, return error state but still connected true so user sees something is wrong
     res.json({ isConnected: true, isPlaying: false, error: 'Failed to fetch status' });
  }
};

const spotifyAction = async (userId, method, endpoint) => {
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: 'SPOTIFY' } }
  });
  if (!integration) throw new Error('Not connected');

  let token = integration.accessToken;

  try {
    await axios({
      method,
      url: `https://api.spotify.com/v1/me/player/${endpoint}`,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (error) {
    const status = error.response?.status;
    
    // Handle 401 Token Expiry
    if (status === 401) {
       console.log(`Spotify token expired during ${endpoint}, refreshing...`);
       token = await refreshSpotifyToken(integration);
       // Retry
       await axios({
          method,
          url: `https://api.spotify.com/v1/me/player/${endpoint}`,
          headers: { 'Authorization': `Bearer ${token}` }
       });
       return;
    }

    const message = error.response?.data?.error?.message || error.message;
    console.error(`Spotify Action ${endpoint} failed:`, message);
    
    if (status === 404) {
      throw new Error('No active Spotify device found. Please open Spotify on a device.');
    }
    if (status === 403) {
      throw new Error('Spotify Premium required for controls.');
    }
    throw error;
  }
};

export const spotifyPlay = async (req, res) => {
  try { await spotifyAction(req.userId, 'put', 'play'); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message || 'Failed to play' }); }
};

export const spotifyPause = async (req, res) => {
  try { await spotifyAction(req.userId, 'put', 'pause'); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message || 'Failed to pause' }); }
};

export const spotifyNext = async (req, res) => {
  try { await spotifyAction(req.userId, 'post', 'next'); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message || 'Failed to skip' }); }
};

export const spotifyPrevious = async (req, res) => {
  try { await spotifyAction(req.userId, 'post', 'previous'); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message || 'Failed to go back' }); }
};

export const authorizeNotion = async (req, res) => {
  console.log('Authorize Notion hit');
  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = process.env.NOTION_REDIRECT_URI;
  
  console.log('Notion Config:', { redirectUri, clientId: clientId ? 'Present' : 'Missing' });

  const url = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}&state=notion`;
  res.json({ url });
};

export const callbackNotion = async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  try {
    const encoded = Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(NOTION_TOKEN_URL, {
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NOTION_REDIRECT_URI
    }, {
      headers: {
        'Authorization': `Basic ${encoded}`,
        'Content-Type': 'application/json'
      }
    });

    const { access_token, workspace_name, workspace_icon } = response.data;

    await prisma.integration.upsert({
      where: {
        userId_provider: {
          userId,
          provider: 'NOTION'
        }
      },
      update: {
        accessToken: access_token,
        metadata: { workspaceName: workspace_name, workspaceIcon: workspace_icon }
      },
      create: {
        userId,
        provider: 'NOTION',
        accessToken: access_token,
        metadata: { workspaceName: workspace_name, workspaceIcon: workspace_icon }
      }
    });

    res.json({ success: true });

  } catch (error) {
    console.error('Notion Callback Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to authenticate with Notion' });
  }
};

export const getNotionStatus = async (req, res) => {
  const userId = req.userId;
  try {
    const integration = await prisma.integration.findUnique({
      where: { userId_provider: { userId, provider: 'NOTION' } }
    });

    if (!integration) {
      return res.json({ isConnected: false });
    }

    res.json({ 
      isConnected: true, 
      workspaceName: integration.metadata?.workspaceName || 'Workspace',
      workspaceIcon: integration.metadata?.workspaceIcon
    });

  } catch (error) {
    res.status(500).json({ error: 'Error checking Notion status' });
  }
};

export const getNotionPages = async (req, res) => {
  const userId = req.userId;
  try {
    const integration = await prisma.integration.findUnique({
      where: { userId_provider: { userId, provider: 'NOTION' } }
    });

    if (!integration) return res.status(404).json({ error: 'Not connected' });

    const response = await axios.post('https://api.notion.com/v1/search', {
      filter: { value: 'page', property: 'object' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
      page_size: 3
    }, {
      headers: {
        'Authorization': `Bearer ${integration.accessToken}`,
        'Notion-Version': '2022-06-28'
      }
    });

    const pages = response.data.results.map(page => ({
      id: page.id,
      title: page.properties?.title?.title?.[0]?.plain_text || 
             page.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
      url: page.url,
      icon: page.icon?.emoji || '📄',
      lastEdited: page.last_edited_time
    }));

    res.json({ pages });
  } catch (error) {
    console.error('Notion Pages Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};
