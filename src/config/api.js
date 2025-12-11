const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_API_URL || 'https://sshhotels.in/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  };
  
  export default API_CONFIG;