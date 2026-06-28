const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' && window.location.port === '3000' 
    ? 'http://localhost:5000/api' 
    : '/api');

// Helper to get auth header
function getAuthHeader() {
  const token = localStorage.getItem('svs_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Check if we are running in a static environment where the backend is not hosted (like GitHub Pages)
const isMockMode = 
  window.location.hostname.includes('github.io') || 
  (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') ||
  localStorage.getItem('svs_use_mock_api') === 'true';

if (isMockMode) {
  console.log('%c SVS Furniture Portal: Running in CLIENT-SIDE MOCK MODE (data will persist in LocalStorage) ', 'background: #5b21b6; color: #fff; padding: 4px; border-radius: 4px;');
}

// ----------------------------------------------------
// INITIAL MOCK DATA SEED
// ----------------------------------------------------
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Home Furniture', slug: 'home-furniture', description: 'Premium sofas, dining tables, beds, and wardrobes designed for modern homes.' },
  { id: 2, name: 'Office Furniture', slug: 'office-furniture', description: 'Ergonomic chairs, executive desks, conference tables, and office workstations.' },
  { id: 3, name: 'Export Furniture', slug: 'export-furniture', description: 'Handcrafted teak and rosewood furniture exported worldwide, highlighting Indian craftsmanship.' },
  { id: 4, name: 'Custom Designs', slug: 'custom-designs', description: 'Bespoke, custom-tailored furniture built exactly to client specifications and drawings.' }
];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Home Furniture',
    name: 'Royal Teak Wood Sofa Set',
    slug: 'royal-teak-sofa-set',
    material: 'Teak Wood',
    size: '3-Seater + 2-Seater (Standard)',
    price_min: 45000,
    price_max: 65000,
    availability_status: 'available',
    description: 'Hand-carved premium teak wood sofa set with velvet upholstery and royal cushions. Extremely durable and elegant.',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60',
    is_featured: 1
  },
  {
    id: 2,
    category_id: 1,
    category_name: 'Home Furniture',
    name: 'Mahogany 6-Seater Dining Table',
    slug: 'mahogany-6-seater-dining-table',
    material: 'Mahogany',
    size: '6ft x 3.5ft x 2.5ft',
    price_min: 35000,
    price_max: 52000,
    availability_status: 'available',
    description: 'Sturdy 6-seater dining table made of mahogany, complete with 6 cushioned chairs and a polished tempered glass top.',
    image_url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop&q=60',
    is_featured: 1
  },
  {
    id: 3,
    category_id: 1,
    category_name: 'Home Furniture',
    name: 'King Size Teak Wood Bed with Storage',
    slug: 'king-size-teak-wood-bed',
    material: 'Teak Wood',
    size: '72" x 78" (King Size)',
    price_min: 40000,
    price_max: 58000,
    availability_status: 'available',
    description: 'Elegant king-size bed with built-in hydraulic storage compartments. Polished in dual-tone walnut and natural wood colors.',
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=60',
    is_featured: 0
  },
  {
    id: 4,
    category_id: 2,
    category_name: 'Office Furniture',
    name: 'Executive Ergonomic Desk',
    slug: 'executive-ergonomic-desk',
    material: 'Engineered Wood',
    size: '5ft x 2.5ft x 2.5ft',
    price_min: 12000,
    price_max: 18000,
    availability_status: 'available',
    description: 'Spacious executive office desk featuring integrated wire management channels, key-lock drawers, and a clean matte finish.',
    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=60',
    is_featured: 0
  },
  {
    id: 5,
    category_id: 2,
    category_name: 'Office Furniture',
    name: 'Premium High-Back Mesh Chair',
    slug: 'premium-high-back-mesh-chair',
    material: 'Mesh',
    size: 'Adjustable (Standard)',
    price_min: 6500,
    price_max: 8500,
    availability_status: 'available',
    description: 'Ergonomic high-back office chair with adjustable lumbar support, 3D armrests, tilt-lock mechanism, and heavy-duty wheels.',
    image_url: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=60',
    is_featured: 1
  },
  {
    id: 6,
    category_id: 3,
    category_name: 'Export Furniture',
    name: 'Handcrafted Teak Wood Carved Door',
    slug: 'teak-wood-carved-door',
    material: 'Teak Wood',
    size: '80" x 36" x 1.5"',
    price_min: 25000,
    price_max: 38000,
    availability_status: 'low_stock',
    description: 'Beautifully hand-carved main door featuring traditional Indian motifs. Ideal for heritage houses and export collections.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60',
    is_featured: 1
  },
  {
    id: 7,
    category_id: 3,
    category_name: 'Export Furniture',
    name: 'Rosewood Vintage Dressing Table',
    slug: 'rosewood-vintage-dressing-table',
    material: 'Rosewood',
    size: '4ft x 1.5ft x 6ft',
    price_min: 28000,
    price_max: 42000,
    availability_status: 'available',
    description: 'Traditional vintage style dressing table made of fine rosewood with elegant brass floral inlays and an oval mirror.',
    image_url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=60',
    is_featured: 0
  },
  {
    id: 8,
    category_id: 4,
    category_name: 'Custom Designs',
    name: 'Bespoke Walnut Modular Wardrobe',
    slug: 'bespoke-walnut-modular-wardrobe',
    material: 'Walnut',
    size: 'Custom Dimensions (As per site)',
    price_min: 60000,
    price_max: 95000,
    availability_status: 'custom_order',
    description: 'Bespoke walk-in modular wardrobe system customized exactly to user space with profile lighting and glass drawers.',
    image_url: 'https://images.unsplash.com/photo-1558882224-cca166733360?w=600&auto=format&fit=crop&q=60',
    is_featured: 0
  }
];

const DEFAULT_ENQUIRIES = [
  {
    id: 1,
    full_name: 'Rajesh Kumar',
    mobile_number: '9876543210',
    email: 'rajesh.k@gmail.com',
    location: 'Hyderabad, Telangana',
    product_id: 1,
    product_name: 'Royal Teak Wood Sofa Set',
    quantity: 1,
    message: 'I am looking for a 5-seater teak wood sofa set. Can you deliver to Gachibowli? What is the final price?',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 2,
    full_name: 'Ananya Sharma',
    mobile_number: '9123456789',
    email: 'ananya.sharma@yahoo.com',
    location: 'Bangalore, Karnataka',
    product_id: 6,
    product_name: 'Handcrafted Teak Wood Carved Door',
    quantity: 2,
    message: 'Interested in ordering 2 carved main doors for my new house project. Do you support custom designs?',
    status: 'in_progress',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

const DEFAULT_NOTES = [
  {
    id: 1,
    enquiry_id: 2,
    note: 'Called Ananya, she sent the CAD drawings for the doors. Teak wood required. Quote in progress.',
    created_by: 'SVS Admin',
    created_at: new Date(Date.now() - 3600000 * 5.5).toISOString()
  }
];

// Helper to load/save from localStorage
function getStorage(key, defaultValue) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data);
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ----------------------------------------------------
// MOCK CLIENT IMPLEMENTATION
// ----------------------------------------------------
const mockApi = {
  login: async (credentials) => {
    // Artificial delay
    await new Promise(r => setTimeout(r, 600));
    if (credentials.email === 'admin@svsfurniture.com' && credentials.password === 'admin123') {
      const token = 'mock_jwt_session_token_' + Date.now();
      const user = { id: 1, name: 'SVS Admin', email: 'admin@svsfurniture.com', role: 'admin' };
      localStorage.setItem('svs_admin_token', token);
      localStorage.setItem('svs_admin_user', JSON.stringify(user));
      return { message: 'Login successful', token, user };
    }
    throw new Error('Invalid email or password');
  },

  getCategories: async () => {
    return getStorage('svs_mock_categories', DEFAULT_CATEGORIES);
  },

  getCategory: async (idOrSlug) => {
    const categories = getStorage('svs_mock_categories', DEFAULT_CATEGORIES);
    const cat = categories.find(c => c.id == idOrSlug || c.slug === idOrSlug);
    if (!cat) throw new Error('Category not found');
    return cat;
  },

  getProducts: async (params = {}) => {
    let products = getStorage('svs_mock_products', DEFAULT_PRODUCTS);
    const categories = getStorage('svs_mock_categories', DEFAULT_CATEGORIES);

    // Apply Search
    if (params.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.material.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Filter Category
    if (params.category) {
      const category = categories.find(c => c.slug === params.category || c.id == params.category);
      if (category) {
        products = products.filter(p => p.category_id == category.id);
      }
    }

    // Filter Material
    if (params.material) {
      const m = params.material.toLowerCase();
      products = products.filter(p => p.material.toLowerCase().includes(m));
    }

    // Filter Availability
    if (params.availability) {
      products = products.filter(p => p.availability_status === params.availability);
    }

    // Filter Price Min
    if (params.price_min) {
      products = products.filter(p => p.price_max >= Number(params.price_min));
    }

    // Filter Price Max
    if (params.price_max) {
      products = products.filter(p => p.price_min <= Number(params.price_max));
    }

    // Filter Featured
    if (params.featured) {
      products = products.filter(p => p.is_featured == 1);
    }

    // Sorting
    if (params.sort) {
      if (params.sort === 'price_low') {
        products.sort((a, b) => a.price_min - b.price_min);
      } else if (params.sort === 'price_high') {
        products.sort((a, b) => b.price_max - a.price_max);
      } else if (params.sort === 'name_asc') {
        products.sort((a, b) => a.name.localeCompare(b.name));
      } else if (params.sort === 'newest') {
        products.sort((a, b) => b.id - a.id);
      }
    }

    return products;
  },

  getProduct: async (idOrSlug) => {
    const products = getStorage('svs_mock_products', DEFAULT_PRODUCTS);
    const product = products.find(p => p.id == idOrSlug || p.slug === idOrSlug);
    if (!product) throw new Error('Product not found');
    
    // Find related products
    const relatedProducts = products.filter(p => p.category_id === product.category_id && p.id !== product.id).slice(0, 3);
    return { product, relatedProducts };
  },

  createProduct: async (productData) => {
    const products = getStorage('svs_mock_products', DEFAULT_PRODUCTS);
    const categories = getStorage('svs_mock_categories', DEFAULT_CATEGORIES);
    
    const cat = categories.find(c => c.id == productData.category_id);
    const newProduct = {
      ...productData,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      category_name: cat ? cat.name : 'Uncategorized',
      price_min: Number(productData.price_min),
      price_max: Number(productData.price_max),
      is_featured: productData.is_featured ? 1 : 0
    };

    products.push(newProduct);
    setStorage('svs_mock_products', products);
    return newProduct;
  },

  updateProduct: async (id, productData) => {
    const products = getStorage('svs_mock_products', DEFAULT_PRODUCTS);
    const categories = getStorage('svs_mock_categories', DEFAULT_CATEGORIES);
    const index = products.findIndex(p => p.id == id);
    if (index === -1) throw new Error('Product not found');

    const cat = categories.find(c => c.id == productData.category_id);
    const updated = {
      ...products[index],
      ...productData,
      category_name: cat ? cat.name : products[index].category_name,
      price_min: Number(productData.price_min),
      price_max: Number(productData.price_max),
      is_featured: productData.is_featured ? 1 : 0
    };

    products[index] = updated;
    setStorage('svs_mock_products', products);
    return updated;
  },

  deleteProduct: async (id) => {
    let products = getStorage('svs_mock_products', DEFAULT_PRODUCTS);
    products = products.filter(p => p.id != id);
    setStorage('svs_mock_products', products);
    return { message: 'Product deleted successfully', id };
  },

  submitEnquiry: async (enquiryData) => {
    const enquiries = getStorage('svs_mock_enquiries', DEFAULT_ENQUIRIES);
    const products = getStorage('svs_mock_products', DEFAULT_PRODUCTS);

    const product = products.find(p => p.id == enquiryData.product_id);
    const newId = enquiries.length > 0 ? Math.max(...enquiries.map(e => e.id)) + 1 : 1;
    
    const newEnquiry = {
      ...enquiryData,
      id: newId,
      product_name: product ? product.name : 'General Enquiry',
      status: 'new',
      created_at: new Date().toISOString()
    };

    enquiries.unshift(newEnquiry);
    setStorage('svs_mock_enquiries', enquiries);

    return {
      message: 'Enquiry submitted successfully! Our team will contact you shortly.',
      enquiryId: newId,
      enquiry: newEnquiry
    };
  },

  getEnquiries: async (params = {}) => {
    let enquiries = getStorage('svs_mock_enquiries', DEFAULT_ENQUIRIES);
    if (params.status) {
      enquiries = enquiries.filter(e => e.status === params.status);
    }
    return enquiries;
  },

  getEnquiry: async (id) => {
    const enquiries = getStorage('svs_mock_enquiries', DEFAULT_ENQUIRIES);
    const notes = getStorage('svs_mock_notes', DEFAULT_NOTES);

    const enquiry = enquiries.find(e => e.id == id);
    if (!enquiry) throw new Error('Enquiry not found');

    const enquiryNotes = notes.filter(n => n.enquiry_id == id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { enquiry, notes: enquiryNotes };
  },

  updateEnquiryStatus: async (id, { status }) => {
    const enquiries = getStorage('svs_mock_enquiries', DEFAULT_ENQUIRIES);
    const notes = getStorage('svs_mock_notes', DEFAULT_NOTES);
    
    const index = enquiries.findIndex(e => e.id == id);
    if (index === -1) throw new Error('Enquiry not found');

    const oldStatus = enquiries[index].status;
    enquiries[index].status = status;
    setStorage('svs_mock_enquiries', enquiries);

    // Create system audit note
    const newNote = {
      id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      enquiry_id: Number(id),
      note: `System: Status updated from '${oldStatus}' to '${status}'.`,
      created_by: 'SVS Admin',
      created_at: new Date().toISOString()
    };

    notes.push(newNote);
    setStorage('svs_mock_notes', notes);

    return { enquiry: enquiries[index], notes: notes.filter(n => n.enquiry_id == id) };
  },

  addEnquiryNote: async (id, { note }) => {
    const notes = getStorage('svs_mock_notes', DEFAULT_NOTES);
    
    const newNote = {
      id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      enquiry_id: Number(id),
      note,
      created_by: 'SVS Admin',
      created_at: new Date().toISOString()
    };

    notes.push(newNote);
    setStorage('svs_mock_notes', notes);

    return notes.filter(n => n.enquiry_id == id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  deleteEnquiry: async (id) => {
    let enquiries = getStorage('svs_mock_enquiries', DEFAULT_ENQUIRIES);
    enquiries = enquiries.filter(e => e.id != id);
    setStorage('svs_mock_enquiries', enquiries);
    return { message: 'Enquiry deleted successfully', id };
  },

  getDashboardSummary: async () => {
    const products = getStorage('svs_mock_products', DEFAULT_PRODUCTS);
    const enquiries = getStorage('svs_mock_enquiries', DEFAULT_ENQUIRIES);
    
    const pendingEnquiries = enquiries.filter(e => e.status !== 'converted' && e.status !== 'cancelled').length;
    const convertedEnquiries = enquiries.filter(e => e.status === 'converted').length;
    
    // Status Breakdown
    const statusBreakdown = { new: 0, in_progress: 0, contacted: 0, converted: 0, cancelled: 0 };
    enquiries.forEach(e => {
      if (statusBreakdown[e.status] !== undefined) {
        statusBreakdown[e.status]++;
      }
    });

    // Category Distribution
    const categoryDistributionMap = {};
    products.forEach(p => {
      const cName = p.category_name || 'Other';
      categoryDistributionMap[cName] = (categoryDistributionMap[cName] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryDistributionMap).map(name => ({
      category_name: name,
      product_count: categoryDistributionMap[name]
    }));

    return {
      totalProducts: products.length,
      totalEnquiries: enquiries.length,
      pendingEnquiries,
      convertedEnquiries,
      statusBreakdown,
      categoryDistribution,
      recentEnquiries: enquiries.slice(0, 5)
    };
  }
};

// ----------------------------------------------------
// REAL SERVER IMPLEMENTATION (DELEGATOR)
// ----------------------------------------------------
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

const realApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  getCategories: () => request('/categories'),
  getCategory: (idOrSlug) => request(`/categories/${idOrSlug}`),
  getProducts: (params = {}) => {
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
  getDashboardSummary: () => request('/dashboard/summary')
};

// ----------------------------------------------------
// EXPORTED ACTIVE API (FALLBACK ENABLED)
// ----------------------------------------------------
export const api = new Proxy({}, {
  get: function(target, prop) {
    return async function(...args) {
      if (isMockMode) {
        return mockApi[prop](...args);
      }
      try {
        return await realApi[prop](...args);
      } catch (err) {
        // Automatically switch to mock mode on first failure if server is unreachable
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          console.warn(`SVS Furniture Portal: API Connection failed. Switching to LocalStorage Mock Mode for ${prop}.`);
          localStorage.setItem('svs_use_mock_api', 'true');
          // Reload page to align app state
          window.location.reload();
        }
        throw err;
      }
    };
  }
});
