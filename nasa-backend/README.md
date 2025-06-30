# NASA API Proxy Backend

This Express.js backend serves as a proxy for NASA API calls, providing centralized error handling and hiding API keys from the frontend.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env .env
   ```
   Then edit `.env` and add your NASA API key:
   ```
   NASA_API_KEY=your_actual_nasa_api_key_here
   ```

3. **Start the server:**
   ```bash
   # Development (with auto-restart)
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

All endpoints return JSON responses and include proper error handling.

### 🌟 APOD (Astronomy Picture of the Day)
```
GET /api/apod?date=YYYY-MM-DD
```
- `date` (optional): Specific date for APOD

### 🚀 Mars Rover Photos
```
GET /api/rover?earth_date=YYYY-MM-DD&rover=curiosity&camera=FHAZ
```
- `earth_date` (required): Date for rover photos
- `rover` (optional): Rover name (default: curiosity)
- `camera` (optional): Camera type (omit for all cameras)

### 🌍 Earth Imagery
```
GET /api/earth?date=YYYY-MM-DD
```
- `date` (required): Date for Earth imagery

### ☄️ Near Earth Objects
```
GET /api/neo?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```
- `start_date` (required): Start date for NEO data
- `end_date` (required): End date for NEO data

### 🏥 Health Check
```
GET /api/health
```
Returns server status and timestamp.

## Error Handling

All endpoints include comprehensive error handling:
- **400**: Invalid parameters or bad requests
- **500**: Server errors or NASA API issues

Example error response:
```json
{
  "error": "Invalid date range or request parameters",
  "details": "Date must be in YYYY-MM-DD format"
}
```

## Development

- Uses `nodemon` for auto-restart during development
- CORS enabled for frontend integration
- Environment variables for configuration
- Axios for robust HTTP requests to NASA APIs
