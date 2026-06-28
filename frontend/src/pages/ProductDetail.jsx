import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, ShieldCheck, Truck, Ruler, Hammer } from 'lucide-react';
import { api } from '../api';

export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProductDetails() {
      setLoading(true);
      setError('');
      try {
        const data = await api.getProduct(idOrSlug);
        setProduct(data.product);
        setRelated(data.relatedProducts || []);
        // Scroll window to top on item switch
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Failed to load product details:', err);
        setError(err.message || 'Product could not be retrieved.');
      } finally {
        setLoading(false);
      }
    }
    loadProductDetails();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="container py-5" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div className="skeleton" style={{ width: '100px', height: '30px', borderRadius: '4px' }}></div>
        <div className="grid-cols-2">
          <div className="skeleton" style={{ height: '450px', borderRadius: '12px' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="skeleton" style={{ height: '40px', width: '80%' }}></div>
            <div className="skeleton" style={{ height: '20px', width: '30%' }}></div>
            <div className="skeleton" style={{ height: '100px' }}></div>
            <div className="skeleton" style={{ height: '60px', width: '50%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <h2 style={{ fontSize: '2rem' }}>Product Not Found</h2>
        <p>{error || 'The requested product listing does not exist.'}</p>
        <Link to="/catalog" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const handleEnquiryRedirect = () => {
    // Pass product_id to prefill enquiry form
    navigate(`/enquire?product_id=${product.id}`);
  };

  return (
    <div className="container py-5" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
      
      {/* Back button */}
      <div>
        <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      {/* Main product display */}
      <div className="grid-cols-2" style={{ alignItems: 'start' }}>
        
        {/* Left Pane - Large Image */}
        <div className="card" style={{ 
          overflow: 'hidden', 
          backgroundColor: 'var(--bg-card)', 
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'} 
            alt={product.name}
            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>

        {/* Right Pane - Specs & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                {product.category_name}
              </span>
              <span className={`badge badge-${product.availability_status}`}>
                {product.availability_status.replace('_', ' ')}
              </span>
            </div>
            <h1 style={{ fontSize: '3rem', lineHeight: '1.1', color: 'var(--primary-dark)', marginBottom: '8px' }}>
              {product.name}
            </h1>
            <div style={{ borderBottom: '2px solid var(--accent)', width: '60px', marginTop: '8px' }}></div>
          </div>

          {/* Pricing Box */}
          <div style={{ 
            backgroundColor: 'var(--primary-light)', 
            padding: '20px 24px', 
            borderRadius: '8px',
            borderLeft: '4px solid var(--primary)'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated Price Range</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
              ₹{product.price_min.toLocaleString()} - ₹{product.price_max.toLocaleString()}
            </span>
            <p style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-muted)' }}>
              *Price depends on custom size modifications, polish selection, and transportation costs.
            </p>
          </div>

          {/* Specification Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>Technical Specifications</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Hammer size={16} /> Material</span>
                <span style={{ fontWeight: 500 }}>{product.material}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Ruler size={16} /> Dimensions</span>
                <span style={{ fontWeight: 500 }}>{product.size}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{product.availability_status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>Product Overview</h3>
            <p style={{ lineHeight: 1.6, fontSize: '1rem', color: 'var(--text-main)' }}>
              {product.description || 'No description provided for this catalog product. Custom configurations can be drawn up based on requirements.'}
            </p>
          </div>

          {/* Features checkmarks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" /> 100% Genuine Seasoned Wood
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} color="var(--primary)" /> Termite Resistant Treatment
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Truck size={16} color="var(--primary)" /> Safe Transit Delivery
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Hammer size={16} color="var(--primary)" /> Custom Polish Options
            </div>
          </div>

          {/* Call to Action Button */}
          <button 
            onClick={handleEnquiryRedirect}
            className="btn btn-primary"
            style={{
              padding: '16px 32px',
              fontSize: '1.1rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Send size={18} /> Request Price Quote & Details
          </button>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '50px' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', marginBottom: '6px' }}>Similar Designs</h2>
            <p>Check out other products in the {product.category_name} category.</p>
          </div>

          <div className="grid-cols-4">
            {related.map(prod => (
              <Link to={`/catalog/${prod.slug}`} key={prod.id} className="card" style={{ textDecoration: 'none' }}>
                <div style={{ height: '180px', overflow: 'hidden', backgroundColor: 'var(--border-light)' }}>
                  <img 
                    src={prod.image_url || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'} 
                    alt={prod.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                  <h4 style={{ fontSize: '1.15rem', flexGrow: 1, fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--primary-dark)' }}>{prod.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      ₹{prod.price_min.toLocaleString()}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
