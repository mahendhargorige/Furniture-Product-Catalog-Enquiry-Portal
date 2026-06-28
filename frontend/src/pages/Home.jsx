import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, Hammer, Sparkles, ChevronRight } from 'lucide-react';
import { api } from '../api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await api.getProducts({ featured: 'true' });
        setFeaturedProducts(data.slice(0, 4)); // Show top 4 featured
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const categories = [
    { id: 1, name: 'Home Furniture', slug: 'home-furniture', desc: 'Custom sofas, beds, cabinets, and premium wooden dining tables.', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Office Furniture', slug: 'office-furniture', desc: 'Ergonomic chairs, desks, drawers, and professional conference tables.', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Export Furniture', slug: 'export-furniture', desc: 'Traditional teak wood carving main doors and heritage dressing panels.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Custom Designs', slug: 'custom-designs', desc: 'Made-to-order cabinets, walk-in closets, and customized site drawings.', img: 'https://images.unsplash.com/photo-1558882224-cca166733360?w=500&auto=format&fit=crop&q=60' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>
      
      {/* 1. Hero Section */}
      <section style={{
        background: 'linear-gradient(rgba(43, 37, 33, 0.65), rgba(43, 37, 33, 0.85)), url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '120px 0',
        color: '#ffffff',
        textAlign: 'center',
        borderBottom: '4px solid var(--accent)'
      }}>
        <div className="container" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.9rem',
            letterSpacing: '3px',
            color: 'var(--accent)',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}>
            Established in 2012
          </span>
          <h1 style={{ 
            color: '#ffffff', 
            fontSize: '4rem', 
            fontFamily: 'var(--font-serif)', 
            fontWeight: 700, 
            letterSpacing: '1px',
            lineHeight: '1.15'
          }}>
            Exquisite Woodwork & Bespoke Furniture
          </h1>
          <p style={{ color: '#eae5df', fontSize: '1.25rem', fontWeight: 300, lineHeight: 1.5 }}>
            Premium craftsmanship for residential, commercial, and export clients. Handcrafted from fine teak, mahogany, and walnut wood.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/catalog" className="btn btn-primary" style={{ padding: '14px 32px' }}>
              Explore Catalog <ArrowRight size={18} />
            </Link>
            <Link to="/enquire" className="btn btn-secondary" style={{ 
              borderColor: '#ffffff', 
              color: '#ffffff',
              padding: '14px 32px'
            }}>
              Request Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Core Strengths Section */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Why Choose Sri Venkata Sai?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>Over 14 years of design excellence and reliability in local and export furniture production.</p>
        </div>
        
        <div className="grid-cols-3">
          <div className="card text-center" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '16px', borderRadius: '50%', color: 'var(--primary)' }}>
              <Award size={32} />
            </div>
            <h3>Premium Materials</h3>
            <p>We source only high-grade A-class teak wood, seasoned mahogany, and premium walnut veneer for lasting durability.</p>
          </div>
          <div className="card text-center" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '16px', borderRadius: '50%', color: 'var(--primary)' }}>
              <Hammer size={32} />
            </div>
            <h3>Expert Craftsmanship</h3>
            <p>Our experienced artisans combine traditional hand-carving techniques with modern modular precision fittings.</p>
          </div>
          <div className="card text-center" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '16px', borderRadius: '50%', color: 'var(--primary)' }}>
              <ShieldCheck size={32} />
            </div>
            <h3>Reliable Service</h3>
            <p>From site measurement and CAD design to final installation, we keep transparent pricing and on-time delivery.</p>
          </div>
        </div>
      </section>

      {/* 3. Categories Browse Section */}
      <section style={{ backgroundColor: 'var(--primary-light)', padding: '80px 0', borderY: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Browse Categories</h2>
            <p>Select a category to view specialized furniture designs and specifications.</p>
          </div>

          <div className="grid-cols-4">
            {categories.map(cat => (
              <Link to={`/catalog?category=${cat.slug}`} key={cat.id} className="card" style={{ textDecoration: 'none' }}>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                  />
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.4rem' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.85rem', flexGrow: 1 }}>{cat.desc}</p>
                  <span style={{ 
                    color: 'var(--primary)', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '8px'
                  }}>
                    Browse Items <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Featured Collection</h2>
            <p>Discover some of our client-favorite premium designs.</p>
          </div>
          <Link to="/catalog" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            View Full Catalog <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid-cols-4">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="card skeleton" style={{ height: '380px' }}></div>
            ))}
          </div>
        ) : (
          <div className="grid-cols-4">
            {featuredProducts.map(prod => (
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
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', lineHeight: 1 }}>Price Range</span>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                        ₹{prod.price_min.toLocaleString()} - ₹{prod.price_max.toLocaleString()}
                      </span>
                    </div>
                    <span style={{
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary-dark)',
                      padding: '6px',
                      borderRadius: '50%'
                    }}>
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      
    </div>
  );
}
