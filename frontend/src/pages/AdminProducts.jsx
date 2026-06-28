import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, X, Check, Eye } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function AdminProducts() {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Inventory list states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form states (Add / Edit panel)
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // null if adding, number ID if editing
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    material: '',
    size: '',
    price_min: '',
    price_max: '',
    availability_status: 'available',
    description: '',
    image_url: '',
    is_featured: false
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch products and categories
  const loadInventory = async () => {
    setLoading(true);
    try {
      const prodsData = await api.getProducts({
        search: searchTerm,
        category: categoryFilter
      });
      setProducts(prodsData);
    } catch (err) {
      console.error('Failed to load products:', err);
      showToast('Failed to retrieve product list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadCategoriesList() {
      try {
        const catsData = await api.getCategories();
        setCategories(catsData);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategoriesList();
  }, []);

  useEffect(() => {
    loadInventory();
  }, [searchTerm, categoryFilter]);

  // Open "Add Product" form if URL contains add=true shortcut
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleOpenAddForm();
      // Clear URL parameter so modal doesn't re-trigger
      setSearchParams({});
    }
  }, [searchParams]);

  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category_id: categories.length > 0 ? categories[0].id.toString() : '',
      material: '',
      size: '',
      price_min: '',
      price_max: '',
      availability_status: 'available',
      description: '',
      image_url: '',
      is_featured: false
    });
    setShowFormModal(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      category_id: prod.category_id.toString(),
      material: prod.material,
      size: prod.size,
      price_min: prod.price_min.toString(),
      price_max: prod.price_max.toString(),
      availability_status: prod.availability_status,
      description: prod.description || '',
      image_url: prod.image_url || '',
      is_featured: prod.is_featured === 1
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the product catalog?`)) {
      return;
    }

    try {
      await api.deleteProduct(id);
      showToast('Product deleted successfully.', 'success');
      loadInventory();
    } catch (err) {
      console.error('Failed to delete product:', err);
      showToast(err.message || 'Failed to delete product.', 'error');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Field validations
    if (!formData.name.trim()) return showToast('Product Name is required.', 'error');
    if (!formData.category_id) return showToast('Please select a category.', 'error');
    if (!formData.material.trim()) return showToast('Material is required.', 'error');
    if (!formData.size.trim()) return showToast('Dimensions are required.', 'error');
    if (formData.price_min === '' || formData.price_max === '') {
      return showToast('Price ranges are required.', 'error');
    }
    const minVal = parseFloat(formData.price_min);
    const maxVal = parseFloat(formData.price_max);
    if (isNaN(minVal) || isNaN(maxVal) || minVal < 0 || maxVal < 0) {
      return showToast('Prices must be valid positive numbers.', 'error');
    }
    if (minVal > maxVal) {
      return showToast('Minimum price cannot exceed maximum price.', 'error');
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id, 10),
        price_min: minVal,
        price_max: maxVal
      };

      if (editingId) {
        await api.updateProduct(editingId, payload);
        showToast('Product specifications updated successfully.', 'success');
      } else {
        await api.createProduct(payload);
        showToast('Product added to catalog.', 'success');
      }
      setShowFormModal(false);
      loadInventory();
    } catch (err) {
      console.error('Failed to save product:', err);
      showToast(err.message || 'Failed to save product details.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '6px' }}>Manage Products</h1>
          <p>Configure product details, dimensions, materials, pricing estimates, and catalog visibility.</p>
        </div>
        <button onClick={handleOpenAddForm} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Filter panel */}
      <div className="card glass" style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search items by name, material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={16} />
          </span>
        </div>

        {/* Category */}
        <div style={{ width: '200px' }}>
          <select 
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        {(searchTerm || categoryFilter) && (
          <button 
            onClick={() => { setSearchTerm(''); setCategoryFilter(''); }} 
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <X size={12} /> Clear Filter
          </button>
        )}
      </div>

      {/* Products table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px' }}>Fetching current products list...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center" style={{ padding: '80px 24px' }}>
          <p>No products match your search keywords. Add a new item to get started.</p>
        </div>
      ) : (
        <div className="table-container" style={{ margin: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Preview</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Material</th>
                <th>Estimated Price Range</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod.id}>
                  <td><strong>#{prod.id}</strong></td>
                  <td>
                    <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'var(--border-light)' }}>
                      <img 
                        src={prod.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80'} 
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{prod.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{prod.size}</span>
                    </div>
                  </td>
                  <td>{prod.category_name}</td>
                  <td>{prod.material}</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>
                      ₹{prod.price_min.toLocaleString()} - ₹{prod.price_max.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <span className={`badge badge-${prod.availability_status}`}>
                        {prod.availability_status.replace('_', ' ')}
                      </span>
                      {prod.is_featured === 1 && (
                        <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--primary)', fontWeight: 600 }}>
                          <Check size={10} /> Featured Item
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link to={`/catalog/${prod.slug}`} target="_blank" className="btn btn-secondary btn-sm" style={{ padding: '6px 10px' }} title="Preview client page">
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => handleOpenEditForm(prod)} className="btn btn-tertiary btn-sm" style={{ padding: '6px 10px' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(prod.id, prod.name)} className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Edit/Add Product Popup Dialog (Modal) */}
      {showFormModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(43, 37, 33, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>
                {editingId ? 'Edit Product Specifications' : 'Register New Furniture Product'}
              </h2>
              <button 
                onClick={() => setShowFormModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Product Name *</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input" 
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Royal Teak 3-Seater Sofa"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Category *</label>
                  <select 
                    name="category_id"
                    className="form-select"
                    value={formData.category_id}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Availability Status</label>
                  <select 
                    name="availability_status"
                    className="form-select"
                    value={formData.availability_status}
                    onChange={handleFormChange}
                  >
                    <option value="available">Available (In Stock)</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="custom_order">Custom Order Only</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Material Specs *</label>
                  <input 
                    type="text" 
                    name="material"
                    className="form-input" 
                    value={formData.material}
                    onChange={handleFormChange}
                    placeholder="e.g. Solid Teak Wood"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Dimensions / Size *</label>
                  <input 
                    type="text" 
                    name="size"
                    className="form-input" 
                    value={formData.size}
                    onChange={handleFormChange}
                    placeholder="e.g. 78in x 36in x 30in"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Estimated Min Price (₹) *</label>
                  <input 
                    type="number" 
                    name="price_min"
                    className="form-input" 
                    value={formData.price_min}
                    onChange={handleFormChange}
                    placeholder="e.g. 25000"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Estimated Max Price (₹) *</label>
                  <input 
                    type="number" 
                    name="price_max"
                    className="form-input" 
                    value={formData.price_max}
                    onChange={handleFormChange}
                    placeholder="e.g. 35000"
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Image URL</label>
                <input 
                  type="url" 
                  name="image_url"
                  className="form-input" 
                  value={formData.image_url}
                  onChange={handleFormChange}
                  placeholder="https://example.com/furniture-image.jpg"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Product Description</label>
                <textarea 
                  name="description"
                  className="form-textarea" 
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Write details about the craftsmanship, polish type, foam thickness, cushion fabric..."
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                <input 
                  type="checkbox" 
                  name="is_featured"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={handleFormChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="is_featured" style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: 500, cursor: 'pointer' }}>
                  Pin to Featured Collection (Displays on Homepage)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowFormModal(false)} className="btn btn-secondary btn-sm" disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Saving changes...' : (editingId ? 'Save Specs' : 'Register Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
