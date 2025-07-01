# NASA Explorer

A full-stack NASA data visualization application built with React and Express.js, featuring real-time NASA API data including Astronomy Picture of the Day, Mars Rover photos, Near Earth Objects, and Earth imagery.

## 🚀 Live Demo

[View Live App](https://nasaexplorer-9c9e0929d13c.herokuapp.com/)

## ✨ Features

- **Astronomy Picture of the Day (APOD)** - Daily stunning space imagery with descriptions
- **Mars Rover Photos** - Explore photos from Curiosity, Opportunity, and Spirit rovers
- **Near Earth Objects (NEO)** - Track asteroids and comets approaching Earth
- **Earth Imagery** - View Earth from space with EPIC satellite images
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Data** - Direct integration with NASA's official APIs

## 🛠 Tech Stack

**Frontend:**
- React.js
- CSS Modules
- Recharts for data visualization

**Backend:**
- Node.js
- Express.js
- Axios for API requests
- CORS enabled

**Deployment:**
- Heroku (Platform as a Service)
- Environment-based configuration

## 📋 Prerequisites

1. **NASA API Key** - Get your free key at [api.nasa.gov](https://api.nasa.gov/)
2. **Heroku Account** - Sign up at [heroku.com](https://heroku.com)
3. **Git** - For version control and deployment

## 🚀 Heroku Deployment Guide

### Step 1: Prepare Your Environment

1. **Get NASA API Key:**
   - Visit [api.nasa.gov](https://api.nasa.gov/)
   - Sign up and generate your API key
   - Save it for later use

2. **Clone/Download this repository:**
   ```bash
   git clone <your-repo-url>
   cd nasa-explorer
   ```

### Step 2: Deploy via Heroku Console

1. **Login to Heroku Dashboard:**
   - Go to [dashboard.heroku.com](https://dashboard.heroku.com)
   - Sign in to your account

2. **Create New App:**
   - Click "New" → "Create new app"
   - Choose a unique app name (e.g., `your-nasa-explorer-2025`)
   - Select your region
   - Click "Create app"

3. **Connect to GitHub (Recommended):**
   - Go to "Deploy" tab
   - Select "GitHub" as deployment method
   - Connect your GitHub account
   - Search and connect your repository
   - Enable "Automatic deploys" from main branch

4. **Set Environment Variables:**
   - Go to "Settings" tab
   - Click "Reveal Config Vars"
   - Add: `NASA_API_KEY` = `your_actual_api_key_here`

5. **Deploy:**
   - Go back to "Deploy" tab
   - Scroll to "Manual deploy"
   - Select `main` branch
   - Click "Deploy Branch"

### Step 3: Alternative - Deploy via Heroku CLI

If you prefer command line:

```bash
# Install Heroku CLI (if not installed)
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login and create app
heroku login
heroku create your-nasa-explorer-app

# Set environment variables
heroku config:set NASA_API_KEY=your_actual_api_key_here

# Initialize git and deploy
git init
git add .
git commit -m "Deploy NASA Explorer to Heroku"
git push heroku main
```

## 🔧 How It Works

### Architecture
- **Development**: Frontend (React dev server) + Backend (Express API)
- **Production**: Single Heroku dyno serves both built React app and API

### Build Process
1. Heroku installs root dependencies
2. Runs `heroku-postbuild` script
3. Builds React frontend for production
4. Serves everything through Express server

### API Endpoints
- `/api/health` - Health check
- `/api/apod` - Astronomy Picture of the Day
- `/api/rover` - Mars Rover photos
- `/api/neo` - Near Earth Objects
- `/api/earth` - Earth imagery

## 🧪 Local Development

```bash
# Install all dependencies
npm run install-deps

# Run development servers
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
nasa-explorer/
├── package.json              # Root package with build scripts
├── Procfile                  # Heroku process configuration
├── nasa-backend/             # Express.js API server
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
├── nasa-frontend/           # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   └── config/api.js    # API configuration
│   └── package.json         # Frontend dependencies
└── README.md               # This file
```

## 🐛 Troubleshooting

### Deployment Issues

**Build fails:**
- Check Heroku logs: Go to "More" → "View logs" in Heroku Dashboard
- Verify all dependencies are in package.json files

**API not working:**
- Confirm NASA_API_KEY is set in Config Vars
- Test health endpoint: `https://your-app.herokuapp.com/api/health`

**404 Errors:**
- Wait for build to complete
- Check that React build was successful in deployment logs

### Common Solutions

1. **Clear Heroku cache:**
   ```bash
   heroku plugins:install heroku-repo
   heroku repo:purge_cache -a your-app-name
   ```

2. **Restart dynos:**
   - In Heroku Dashboard: "More" → "Restart all dynos"

3. **Check logs:**
   ```bash
   heroku logs --tail -a your-app-name
   ```

## 🧪 Testing Your Deployment

After deployment, verify these URLs work:
- `https://your-app.herokuapp.com/` - Main React app
- `https://your-app.herokuapp.com/api/health` - API health check
- `https://your-app.herokuapp.com/api/apod` - APOD data

## 📝 Environment Variables

Required on Heroku:
- `NASA_API_KEY` - Your NASA API key from api.nasa.gov

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- NASA for providing free access to their amazing APIs
- The React and Express.js communities
- Heroku for reliable hosting platform
