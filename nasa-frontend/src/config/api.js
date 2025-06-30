// API configuration for different environments
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '' // In production, API will be served from the same domain
  : 'http://localhost:5000'; // Development backend URL

export const apiEndpoints = {
  apod: (date) => `${API_BASE_URL}/api/apod${date ? `?date=${date}` : ''}`,
  rover: (earthDate, rover = 'curiosity', camera) => {
    const params = new URLSearchParams({ earth_date: earthDate, rover });
    if (camera && camera !== 'ALL') params.append('camera', camera);
    return `${API_BASE_URL}/api/rover?${params}`;
  },
  neo: (startDate, endDate) => `${API_BASE_URL}/api/neo?start_date=${startDate}&end_date=${endDate}`,
  earth: (date) => `${API_BASE_URL}/api/earth?date=${date}`
};
