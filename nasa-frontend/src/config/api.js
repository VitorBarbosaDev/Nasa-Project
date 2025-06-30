// API configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export const apiEndpoints = {
  apod: (date) => `${API_BASE_URL}/api/apod${date ? `?date=${date}` : ''}`,
  rover: (earthDate, rover = 'curiosity', camera) => {
    let url = `${API_BASE_URL}/api/rover?earth_date=${earthDate}&rover=${rover}`;
    if (camera && camera !== 'ALL') {
      url += `&camera=${camera}`;
    }
    return url;
  },
  neo: (startDate, endDate) => `${API_BASE_URL}/api/neo?start_date=${startDate}&end_date=${endDate}`,
  earth: (date) => `${API_BASE_URL}/api/earth?date=${date}`,
  earthImage: (date, filename) => `${API_BASE_URL}/api/earth/image/${date}/${filename}`,
  health: () => `${API_BASE_URL}/api/health`
};

export default API_BASE_URL;
