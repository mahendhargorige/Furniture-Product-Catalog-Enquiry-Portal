const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' && window.location.port === '3000' 
    ? 'http://localhost:5000/api' 
    : '/api');

// Helper to get auth header
function getAuthHeader() {
  const token = localStorage.getItem('svs_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  
  // Categories
  getCategories: () => request('/categories'),
  getCategory: (idOrSlug) => request(`/categories/${idOrSlug}`),
  
  // Products
  getProducts: (params = {}) => {
    // Clear out empty parameters so they aren't serialized
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/products?${query}`);
  },
  getProduct: (idOrSlug) => request(`/products/${idOrSlug}`),
  createProduct: (productData) => request('/products', { method: 'POST', body: productData }),
  updateProduct: (id, productData) => request(`/products/${id}`, { method: 'PUT', body: productData }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  
  // Enquiries
  submitEnquiry: (enquiryData) => request('/enquiries', { method: 'POST', body: enquiryData }),
  getEnquiries: (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/enquiries?${query}`);
  },
  getEnquiry: (id) => request(`/enquiries/${id}`),
  updateEnquiryStatus: (id, status) => request(`/enquiries/${id}/status`, { method: 'PUT', body: { status } }),
  addEnquiryNote: (id, note) => request(`/enquiries/${id}/notes`, { method: 'POST', body: { note } }),
  deleteEnquiry: (id) => request(`/enquiries/${id}`, { method: 'DELETE' }),
  
  // Dashboard
  getDashboardSummary: () => request('/dashboard/summary')
};
