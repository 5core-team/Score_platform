import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.15:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/score/login/', credentials),
  refreshToken: (refreshToken: string) =>
    api.post('/score/refresh-token/', { refresh_token: refreshToken }),
};

// Country endpoints
export const countryAPI = {
  create: (countryData: {
    name: string;
    country_code: string;
    phone_code: string;
    email: string;
  }) => api.post('/users/new-country/', countryData),
  
  getAll: () => api.get('/users/country-data/'),
  
  updateStatus: (id: number, status: 'active' | 'inactive') =>
    api.put(`/users/update-country-status/${id}/`, { status }),
  
  subscribe: (data: { name: string; plan: 'monthly' | 'annual' }) =>
    api.post('/users/country-subscribe/', data),
  
  getData: (countryName: string) =>
    api.get(`/users/country-data/${countryName}/`),
};

// Front Office endpoints
export const frontOfficeAPI = {
  getAll: () => api.get('/country/front-offices/'),
  
  create: (data: {
    front_office_name: string;
    username: string;
    npi: string;
    phone: string;
    email: string;
    localisation: string;
  }) => api.post('/country/create-front-office/', data),
  
  update: (id: number, data: {
    front_office_name?: string;
    username?: string;
    npi?: string;
    phone?: string;
    email?: string;
    localisation?: string;
  }) => api.put(`/country/update-front-office/${id}/`, data),
  
  delete: (id: number) => api.delete(`/country/delete-front-office/${id}/`),
  
  updateStatus: (id: number, status: 'active' | 'inactive') =>
    api.put(`/country/update-front-office-status/${id}/`, { status }),
};

// Customer endpoints
export const customerAPI = {
  create: (data: {
    uuid: string;
    first_name: string;
    last_name: string;
    mail: string;
    npi: string;
    phone_number: string;
  }) => api.post('/customer/new/', data),
  
  verify: (data: {
    nom: string;
    prenom: string;
    npi: string;
    numero: string;
    docNumber: string;
  }) => api.post('/customer/verify/', data),
  
  validateCode: (code: string) => api.post('/customer/validate-code/', { code }),
};

export default api;