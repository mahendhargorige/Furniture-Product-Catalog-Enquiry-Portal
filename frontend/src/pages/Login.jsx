import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve previous redirect path, default to /admin
  const fromPath = location.state?.from?.pathname || '/admin';

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return showToast('Please fill in all credentials.', 'error');
    }

    setLoading(true);

    try {
      const response = await api.login({ email, password });
      
      // Store JWT token and details
      localStorage.setItem('svs_admin_token', response.token);
      localStorage.setItem('svs_admin_user', JSON.stringify(response.user));

      showToast('Logged in successfully.', 'success');
      navigate(fromPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      showToast(err.message || 'Authentication failed. Please verify email and password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: '40px 0'
    }}>
      <div className="card glass" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px 32px',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)' }}>Admin Portal</h2>
          <p style={{ fontSize: '0.9rem' }}>Sign in to manage catalog items and check customer enquiries.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-input" 
                placeholder="admin@svsfurniture.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Mail size={16} />
              </span>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={16} />
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ 
              marginTop: '12px',
              padding: '12px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={loading}
          >
            <LogIn size={16} /> {loading ? 'Signing in...' : 'Access Dashboard'}
          </button>
        </form>

        <div style={{ 
          backgroundColor: 'var(--primary-light)', 
          padding: '12px', 
          borderRadius: '6px', 
          fontSize: '0.8rem', 
          color: 'var(--primary-dark)',
          textAlign: 'center',
          borderLeft: '3px solid var(--accent)'
        }}>
          <strong>Demo Credentials:</strong><br />
          Email: <code>admin@svsfurniture.com</code><br />
          Password: <code>admin123</code>
        </div>

      </div>
    </div>
  );
}
