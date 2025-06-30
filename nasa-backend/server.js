const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// NASA API base URL and key
const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_BASE_URL = 'https://api.nasa.gov';

// Error handler middleware
const handleError = (res, error, message = 'An error occurred') => {
  console.error(`Error: ${message}`, error.message);
  res.status(500).json({
    error: message,
    details: error.message
  });
};

// Validate API key middleware
const validateApiKey = (req, res, next) => {
  if (!NASA_API_KEY) {
    return res.status(500).json({
      error: 'NASA API key not configured',
      details: 'Please set NASA_API_KEY in your environment variables'
    });
  }
  next();
};

// APOD endpoint
app.get('/api/apod', validateApiKey, async (req, res) => {
  try {
    const { date } = req.query;
    const url = `${NASA_BASE_URL}/planetary/apod`;
    const params = {
      api_key: NASA_API_KEY,
      ...(date && { date })
    };

    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 400) {
      res.status(400).json({
        error: 'Invalid date or request parameters',
        details: error.response.data?.msg || error.message
      });
    } else {
      handleError(res, error, 'Failed to fetch APOD data');
    }
  }
});

// Mars Rover Photos endpoint
app.get('/api/rover', validateApiKey, async (req, res) => {
  try {
    const { earth_date, rover = 'curiosity', camera } = req.query;

    if (!earth_date) {
      return res.status(400).json({
        error: 'Missing required parameter',
        details: 'earth_date parameter is required'
      });
    }

    const url = `${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`;
    const params = {
      api_key: NASA_API_KEY,
      earth_date,
      ...(camera && camera !== 'ALL' && { camera })
    };

    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 400) {
      res.status(400).json({
        error: 'Invalid rover parameters',
        details: error.response.data?.errors || error.message
      });
    } else {
      handleError(res, error, 'Failed to fetch rover photos');
    }
  }
});

// Near Earth Objects endpoint
app.get('/api/neo', validateApiKey, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: 'Both start_date and end_date parameters are required'
      });
    }

    const url = `${NASA_BASE_URL}/neo/rest/v1/feed`;
    const params = {
      api_key: NASA_API_KEY,
      start_date,
      end_date
    };

    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 400) {
      res.status(400).json({
        error: 'Invalid date range or request parameters',
        details: error.response.data?.error_message || error.message
      });
    } else {
      handleError(res, error, 'Failed to fetch NEO data');
    }
  }
});

// Earth Imagery endpoint
app.get('/api/earth', validateApiKey, async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Missing required parameter',
        details: 'date parameter is required'
      });
    }

    const url = `${NASA_BASE_URL}/EPIC/api/natural/date/${date}`;
    const params = {
      api_key: NASA_API_KEY
    };

    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 400) {
      res.status(400).json({
        error: 'Invalid date or no images available',
        details: error.response.data?.msg || error.message
      });
    } else {
      handleError(res, error, 'Failed to fetch Earth imagery');
    }
  }
});

// Earth Image proxy endpoint (for actual image files)
app.get('/api/earth/image/:date/:filename', validateApiKey, async (req, res) => {
  try {
    const { date, filename } = req.params;

    // Convert date format: YYYY-MM-DD to YYYY/MM/DD
    const [year, month, day] = date.split('-');
    const imagePath = `${year}/${month}/${day}`;

    const imageUrl = `${NASA_BASE_URL}/EPIC/archive/natural/${imagePath}/png/${filename}.png`;
    const params = { api_key: NASA_API_KEY };

    const response = await axios.get(imageUrl, {
      params,
      responseType: 'stream'
    });

    // Forward the image content-type and stream the image
    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    handleError(res, error, 'Failed to fetch Earth image');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'NASA API Proxy'
  });
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    details: `${req.method} ${req.originalUrl} is not a valid endpoint`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NASA API Proxy server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);

  if (!NASA_API_KEY) {
    console.warn('⚠️  WARNING: NASA_API_KEY environment variable not set!');
  } else {
    console.log('✅ NASA API key configured');
  }
});

module.exports = app;
