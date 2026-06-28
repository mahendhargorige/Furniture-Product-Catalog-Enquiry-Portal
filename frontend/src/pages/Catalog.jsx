import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, RotateCcw, ChevronRight, Inbox, Eye } from 'lucide-react';
import { api } from '../api';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get('material') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('availability') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default');

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch Products based on URL query parameters
  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const params = {
          search: searchParams.get('search') || '',
          category: searchParams.get('category') || '',
          material: searchParams.get('material') || '',
          availability: searchParams.get('availability') || '',
          price_min: searchParams.get('price_min') || '',
          price_max: searchParams.get('price_max') || '',
          sort: searchParams.get('sort') || ''
        };
        const data = await api.getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredProducts();
  }, [searchParams]);

  // Sync category change if URL parameter changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Apply filters by updating Search Parameters in URL
  const applyFilters = (e) => {
    if (e) e.preventDefault();
    
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedMaterial) params.material = selectedMaterial;
    if (selectedStatus) params.availability = selectedStatus;
    if (priceMin) params.price_min = priceMin;
    if (priceMax) params.price_max = priceMax;
    if (sortBy && sortBy !== 'default') params.sort = sortBy;

    setSearchParams(params);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedMaterial('');
    setSelectedStatus('');
    setPriceMin('');
    setPriceMax('');
    setSortBy('default');
    setSearchParams({});
  };

  const materials = [
    { label: 'All Materials', value: '' },
    { label: 'Teak Wood', value: 'Teak' },
    { label: 'Mahogany Wood', value: 'Mahogany' },
    { label: 'Walnut Wood', value: 'Walnut' },
    { label: 'Rosewood', value: 'Rosewood' },
    { label: 'Mesh & Steel', value: 'Mesh' }
  ];

  const statuses = [
    { label: 'All Availability', value: '' },
    { label: 'Available', value: 'available' },
    { label: 'Low Stock', value: 'low_stock' },
    { label: 'Out of Stock', value: 'out_of_stock' },
    { label: 'Custom Order Only', value: 'custom_order' }
  ];

  return (
    <div className="container py-5">
      
      {/* Page Title Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>Furniture Collection Catalog</h1>
        <p style={{ fontSize: '1.1rem' }}>Browse SVS Furniture premium collections, filter by specifications, and request immediate quotes.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '40px',
        alignItems: 'flex-start'
      }} className="catalog-layout">
        
        {/* Sidebar Filters */}
        <aside className="card glass" style={{
          padding: '24px',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          position: 'sticky',
          top: '100px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>
              <SlidersHorizontal size={18} /> Filters
            </span>
            <button 
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Reset All
            </button>
          </div>

          <form onSubmit={applyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Search Input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Search Keywords</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Sofa, Dining, Teak..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingRight: '40px' }}
                />
                <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Category selection */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <select 
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Material selector */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Material</label>
              <select 
                className="form-select"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                {materials.map((mat, i) => (
                  <option key={i} value={mat.value}>{mat.label}</option>
                ))}
              </select>
            </div>

            {/* Availability filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Availability</label>
              <select 
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statuses.map((st, i) => (
                  <option key={i} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>

            {/* Price Range inputs */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Price Range (₹)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <span style={{ color: 'var(--text-muted)' }}>-</span>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Sort By</label>
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  // Apply sort instantly on selection
                  const params = {};
                  if (searchTerm) params.search = searchTerm;
                  if (selectedCategory) params.category = selectedCategory;
                  if (selectedMaterial) params.material = selectedMaterial;
                  if (selectedStatus) params.availability = selectedStatus;
                  if (priceMin) params.price_min = priceMin;
                  if (priceMax) params.price_max = priceMax;
                  if (e.target.value && e.target.value !== 'default') params.sort = e.target.value;
                  setSearchParams(params);
                }}
              >
                <option value="default">Featured First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Product Catalog Grid view */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Showing <strong>{products.length}</strong> products
            </span>
          </div>

          {loading ? (
            <div className="grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="card skeleton" style={{ height: '380px' }}></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card text-center" style={{ padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ backgroundColor: 'var(--primary-light)', padding: '24px', borderRadius: '50%', color: 'var(--primary-dark)' }}>
                <Inbox size={48} />
              </div>
              <h2 style={{ fontSize: '2rem' }}>No Products Found</h2>
              <p style={{ maxWidth: '400px' }}>
                We couldn't find any products matching your current combination of filters. Try updating keywords or adjusting your price limits.
              </p>
              <button onClick={handleReset} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid-cols-3">
              {products.map(prod => (
                <Link to={`/catalog/${prod.slug}`} key={prod.id} className="card" style={{ textDecoration: 'none' }}>
                  <div style={{ height: '220px', overflow: 'hidden', backgroundColor: 'var(--border-light)' }}>
                    <img 
                      src={prod.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'} 
                      alt={prod.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)' }}>
                        {prod.category_name}
                      </span>
                      <span className={`badge badge-${prod.availability_status}`}>
                        {prod.availability_status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', flexGrow: 1 }}>{prod.name}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0' }}>
                      <span><strong>Material:</strong> {prod.material}</span>
                      <span><strong>Size:</strong> {prod.size}</span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}>Price Range</span>
                        <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                          ₹{prod.price_min.toLocaleString()} - ₹{prod.price_max.toLocaleString()}
                        </span>
                      </div>
                      <span style={{
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-dark)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        View Details <Eye size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid structure custom overrides */}
      <style>{`
        @media (min-width: 992px) {
          .catalog-layout {
            grid-template-columns: 280px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
