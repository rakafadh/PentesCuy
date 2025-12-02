import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
  // Vulnerable endpoints
  login: (username, password) => 
    axios.post(`${API_BASE_URL}/login`, { username, password }),
  
  searchUsers: (query) => 
    axios.get(`${API_BASE_URL}/search`, { params: { query } }),
  
  ping: (host) => 
    axios.post(`${API_BASE_URL}/ping`, { host }),
  
  systemInfo: (command) => 
    axios.post(`${API_BASE_URL}/system-info`, { command }),
  
  // Secure endpoints
  secureLogin: (username, password) => 
    axios.post(`${API_BASE_URL}/secure/login`, { username, password }),
  
  secureSearch: (query) => 
    axios.get(`${API_BASE_URL}/secure/search`, { params: { query } }),
  
  securePing: (host) => 
    axios.post(`${API_BASE_URL}/secure/ping`, { host }),
  
  secureSystemInfo: (infoType) => 
    axios.post(`${API_BASE_URL}/secure/system-info`, { infoType }),
};
