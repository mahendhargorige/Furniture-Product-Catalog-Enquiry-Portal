import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock, Sofa } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#2b231c', /* Dark Espresso Wood */
      color: '#eae5df',
      padding: '60px 0 24px 0',
      borderTop: '3px solid var(--accent)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="grid-cols-3" style={{ marginBottom: '40px' }}>
          {/* Company Brief */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sofa size={32} color="var(--accent)" />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px' }}>
                  SRI VENKATA SAI
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--accent)', letterSpacing: '1px' }}>
                  FURNITURE WORKS
                </span>
              </div>
            </div>
            <p style={{ color: '#c4bbae', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Crafting premium wood furniture for over a decade. We specialize in custom-tailored designs, home, office, and export quality woodwork. Your dream furniture, crafted with precision.
            </p>
          </div>

          {/* Quick Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.1rem', borderBottom: '1px solid #473d34', paddingBottom: '8px', letterSpacing: '0.5px' }}>
              Contact Us
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#c4bbae' }}>
                  Sri Venkata Sai Furniture Works, Industrial Area, Hyderabad, Telangana - 500090, India
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--accent)" />
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 500 }}>
                  +91 98765 43210 (WhatsApp Available)
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="var(--accent)" />
                <a href="mailto:info@svsfurniture.com" style={{ color: '#c4bbae' }}>
                  info@svsfurniture.com
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ color: '#ffffff', fontSize: '1.1rem', borderBottom: '1px solid #473d34', paddingBottom: '8px', letterSpacing: '0.5px' }}>
              Business Hours
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#c4bbae' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="var(--accent)" />
                <span>Monday - Saturday: 9:00 AM - 7:00 PM</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="#8a7e72" />
                <span>Sunday: Closed (Available for custom appointments)</span>
              </li>
              <li style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                <Link to="/enquire" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', padding: '8px 16px' }}>
                  Get Free Consultation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div style={{
          borderTop: '1px solid #473d34',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          fontSize: '0.85rem',
          color: '#8a7e72'
        }}>
          <p>© {currentYear} Sri Venkata Sai Furniture Works. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/catalog" style={{ color: '#8a7e72' }}>Our Catalog</Link>
            <Link to="/login" style={{ color: '#8a7e72' }}>Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
