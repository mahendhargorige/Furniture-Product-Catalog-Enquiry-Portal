import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Inbox, Database, AlertCircle, CheckCircle, 
  Plus, ExternalLink, Calendar, User, Eye, PhoneCall 
} from 'lucide-react';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await api.getDashboardSummary();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        showToast('Failed to load dashboard statistics.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [showToast]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner" style={{ margin: '80px auto' }}></div>
        <p>Loading administrative dashboard metrics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container py-5 text-center">
        <h2 style={{ color: 'red' }}>Error loading data</h2>
        <p>Could not connect to backend server. Please verify the API is running.</p>
      </div>
    );
  }

  // Helper status color mapping
  const getStatusClass = (status) => {
    return `badge badge-${status}`;
  };

  return (
    <div className="container py-5" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '6px' }}>Dashboard Overview</h1>
          <p>Real-time updates of Sri Venkata Sai product inventory and customer inquiries.</p>
        </div>
        
        {/* Quick action triggers */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/products?add=true" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Product
          </Link>
          <Link to="/admin/enquiries" className="btn btn-secondary btn-sm">
            <Inbox size={16} /> View Enquiries
          </Link>
        </div>
      </div>

      {/* Overview Cards Widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Card 1: Total Products */}
        <div className="card" style={{ padding: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Catalog</span>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '8px', borderRadius: '8px', color: 'var(--primary-dark)' }}>
              <Database size={20} />
            </div>
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-dark)', lineHeight: 1 }}>{stats.totalProducts}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Products registered</span>
        </div>

        {/* Card 2: Total Enquiries */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Enquiries</span>
            <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#1e3a8a' }}>
              <Inbox size={20} />
            </div>
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1e3a8a', lineHeight: 1 }}>{stats.totalEnquiries}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Form submissions</span>
        </div>

        {/* Card 3: Pending Enquiries */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Pending</span>
            <div style={{ backgroundColor: '#fffbeb', padding: '8px', borderRadius: '8px', color: '#b45309' }}>
              <AlertCircle size={20} />
            </div>
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#b45309', lineHeight: 1 }}>{stats.pendingEnquiries}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>New or In-Progress</span>
        </div>

        {/* Card 4: Converted Sales */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Converted</span>
            <div style={{ backgroundColor: '#f0fdf4', padding: '8px', borderRadius: '8px', color: '#15803d' }}>
              <CheckCircle size={20} />
            </div>
          </div>
          <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#15803d', lineHeight: 1 }}>{stats.convertedEnquiries}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>Successfully closed deals</span>
        </div>

      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px'
      }} className="dashboard-grid-layout">
        
        {/* Left Side: Recent Enquiries list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)' }}>Recent Enquiries</h2>
            <Link to="/admin/enquiries" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
              View All Enquiries
            </Link>
          </div>

          {stats.recentEnquiries.length === 0 ? (
            <div className="card text-center" style={{ padding: '40px' }}>
              <p>No enquiries received yet. Form submissions will appear here.</p>
            </div>
          ) : (
            <div className="table-container" style={{ margin: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Customer Details</th>
                    <th>Product Interest</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEnquiries.map(enq => (
                    <tr key={enq.id}>
                      <td><strong>#SVS-{enq.id}</strong></td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500, color: 'var(--primary-dark)' }}>{enq.full_name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{enq.mobile_number} | {enq.location}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 500 }}>{enq.product_name || 'Deleted Product'}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {enq.quantity}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <Calendar size={12} />
                          {new Date(enq.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <span className={getStatusClass(enq.status)}>
                          {enq.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/enquiries/${enq.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={12} /> Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Charts & Inventory breakdown */}
        <div className="card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            Catalog Distribution
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.categoryDistribution.map((dist, i) => {
              const maxVal = Math.max(...stats.categoryDistribution.map(d => d.product_count), 1);
              const percentage = (dist.product_count / maxVal) * 100;

              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                    <span>{dist.category_name}</span>
                    <span style={{ color: 'var(--primary)' }}>{dist.product_count} items</span>
                  </div>
                  {/* CSS Bar Chart */}
                  <div style={{
                    width: '100%',
                    height: '12px',
                    backgroundColor: 'var(--border-light)',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary)',
                      borderRadius: '6px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            backgroundColor: 'var(--bg-main)',
            padding: '16px',
            borderRadius: '8px',
            marginTop: 'auto',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5
          }}>
            <strong>Dashboard Instructions:</strong><br />
            - Click <strong>Manage</strong> next to any enquiry to check notes, add comments, or update its follow-up status.<br />
            - Use <strong>Add Product</strong> to insert new catalog specs.
          </div>
        </div>

      </div>

      <style>{`
        @media (min-width: 992px) {
          .dashboard-grid-layout {
            grid-template-columns: 2fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
