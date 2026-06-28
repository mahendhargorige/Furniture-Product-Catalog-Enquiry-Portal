import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sofa, LogOut, User, Menu, X, LayoutDashboard, Database, Inbox } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');

  // Check login status on render and location change
  useEffect(() => {
    const token = localStorage.getItem('svs_admin_token');
    const userJson = localStorage.getItem('svs_admin_user');
    if (token && userJson) {
      setIsAdmin(true);
      try {
        const user = JSON.parse(userJson);
        setAdminName(user.name || 'Admin');
      } catch (_) {
        setAdminName('Admin');
      }
    } else {
      setIsAdmin(false);
      setAdminName('');
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('svs_admin_token');
    localStorage.removeItem('svs_admin_user');
    setIsAdmin(false);
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 0',
      marginBottom: '0px'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 700,
          fontSize: '1.4rem',
          fontFamily: 'var(--font-serif)',
          color: 'var(--primary-dark)',
          textDecoration: 'none'
        }} onClick={() => setIsOpen(false)}>
          <Sofa size={28} color="var(--primary)" strokeWidth={1.8} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.25rem', letterSpacing: '0.5px' }}>SRI VENKATA SAI</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--primary)', letterSpacing: '1px' }}>FURNITURE WORKS</span>
          </div>
        </Link>

        {/* Hamburger Menu Toggle (Mobile) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary-dark)',
            cursor: 'pointer',
            display: 'none', // Overridden in media queries
          }}
          className="menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-menu ${isOpen ? 'open' : ''}`} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px'
        }}>
          <Link 
            to="/" 
            className="nav-link"
            style={{
              fontWeight: isActive('/') ? 600 : 400,
              color: isActive('/') ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.95rem'
            }}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/catalog" 
            className="nav-link"
            style={{
              fontWeight: isActive('/catalog') ? 600 : 400,
              color: isActive('/catalog') ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.95rem'
            }}
            onClick={() => setIsOpen(false)}
          >
            Product Catalog
          </Link>
          <Link 
            to="/enquire" 
            className="nav-link"
            style={{
              fontWeight: isActive('/enquire') ? 600 : 400,
              color: isActive('/enquire') ? 'var(--primary)' : 'var(--text-main)',
              fontSize: '0.95rem'
            }}
            onClick={() => setIsOpen(false)}
          >
            Submit Enquiry
          </Link>

          {/* Admin Navigation */}
          {isAdmin ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              borderLeft: '1px solid var(--border-color)',
              paddingLeft: '20px'
            }} className="admin-nav-section">
              <Link 
                to="/admin" 
                className="nav-link-admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: isActive('/admin') ? 600 : 500,
                  color: isActive('/admin') ? 'var(--primary)' : 'var(--primary-dark)',
                  fontSize: '0.9rem'
                }}
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link 
                to="/admin/products" 
                className="nav-link-admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: isActive('/admin/products') ? 600 : 500,
                  color: isActive('/admin/products') ? 'var(--primary)' : 'var(--primary-dark)',
                  fontSize: '0.9rem'
                }}
                onClick={() => setIsOpen(false)}
              >
                <Database size={16} /> Products
              </Link>
              <Link 
                to="/admin/enquiries" 
                className="nav-link-admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: isActive('/admin/enquiries') ? 600 : 500,
                  color: isActive('/admin/enquiries') ? 'var(--primary)' : 'var(--primary-dark)',
                  fontSize: '0.9rem'
                }}
                onClick={() => setIsOpen(false)}
              >
                <Inbox size={16} /> Enquiries
              </Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hi, <strong>{adminName}</strong></span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-secondary btn-sm"
              style={{
                padding: '8px 18px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => setIsOpen(false)}
            >
              <User size={14} /> Admin Login
            </Link>
          )}
        </div>
      </div>

      {/* Inline styles for responsive hamburger */}
      <style>{`
        @media (max-width: 991px) {
          .menu-toggle {
            display: block !important;
          }
          .nav-menu {
            display: none !important;
            flex-direction: column;
            width: 100%;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .nav-menu.open {
            display: flex !important;
          }
          .admin-nav-section {
            border-left: none !important;
            padding-left: 0 !important;
            flex-direction: column;
            align-items: flex-start !important;
            width: 100%;
            gap: 16px !important;
            border-top: 1px solid var(--border-color);
            padding-top: 16px;
          }
        }
      `}</style>
    </nav>
  );
}
