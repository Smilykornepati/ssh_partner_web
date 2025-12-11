import API_CONFIG from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  async refreshAuthToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.token);
        return data.token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      window.location.href = '/login';
    }
    return null;
  }

  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle token expiration
      if (response.status === 401 && retryCount < API_CONFIG.RETRY_ATTEMPTS) {
        const newToken = await this.refreshAuthToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          return this.request(endpoint, options, retryCount + 1);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }

      if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
        await new Promise(resolve => 
          setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1))
        );
        return this.request(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  async uploadFile(endpoint, formData, onProgress) {
    const url = `${this.baseURL}${endpoint}`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', url);
      
      if (this.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (onProgress && event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Upload timeout'));

      xhr.send(formData);
    });
  }

  // Auth endpoints
  async checkHotel(phone) {
    return this.request('/auth/check-hotel', {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  }

  async setPassword(phone, password) {
    return this.request('/auth/set-password', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    });
  }

  async login(phone, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password })
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
      if (response.refreshToken) {
        this.setRefreshToken(response.refreshToken);
      }
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  // Hotel endpoints
  async registerHotel(data) {
    return this.request('/hotels/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async uploadHotelRegistration(formData, onProgress) {
    return this.uploadFile('/hotels/register', formData, onProgress);
  }

  async getHotelSettings(hotelId) {
    return this.request(`/hotel-operations/${hotelId}`);
  }

  async updateHotelStatus(hotelId, hotelStatus) {
    return this.request(`/hotel-operations/${hotelId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ hotelStatus })
    });
  }

  async addRoomType(hotelId, formData, onProgress) {
    return this.uploadFile(`/hotel-operations/${hotelId}/room-types`, formData, onProgress);
  }

  async updateRoomStatus(hotelId, roomNumber, status) {
    return this.request(`/hotel-operations/${hotelId}/rooms/${roomNumber}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async bulkUpdateRoomStatus(hotelId, roomUpdates) {
    return this.request(`/hotel-operations/${hotelId}/rooms/bulk-status`, {
      method: 'PUT',
      body: JSON.stringify({ roomUpdates })
    });
  }

  async deleteRoomType(hotelId, roomTypeName) {
    return this.request(`/hotel-operations/${hotelId}/room-types/${roomTypeName}`, {
      method: 'DELETE'
    });
  }
}

export default new ApiService();