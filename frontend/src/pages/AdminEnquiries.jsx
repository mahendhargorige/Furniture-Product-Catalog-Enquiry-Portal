import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Eye, Calendar, MapPin, PhoneCall, Trash2 } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function AdminEnquiries() {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // '' means all

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getEnquiries({ status: statusFilter });
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      showToast('Failed to retrieve enquiries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the enquiry from "${name}"?`)) {
      return;
    }

    try {
      await api.deleteEnquiry(id);
      showToast('Enquiry deleted successfully.', 'success');
      loadEnquiries();
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
      showToast(err.message || 'Failed to delete enquiry.', 'error');
    }
  };

  const getStatusClass = (status) => {
    return `badge badge-${status}`;
  };

  const tabs = [
    { label: 'All Inquiries', value: '' },
    { label: 'New', value: 'new' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Converted', value: 'converted' },
    { label: 'Closed / Dead', value: 'closed' }
  ];

  return (
    <div className="container py-5" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '6px' }}>Customer & Dealer Enquiries</h1>
        <p>Follow up on leads, update contact statuses, and log remarks to track conversions.</p>
      </div>

      {/* Tabs Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        borderBottom: '1px solid var(--border-color)',
        gap: '4px',
        paddingBottom: '2px'
      }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setStatusFilter(tab.value)}
            style={{
              padding: '10px 20px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: 500,
              background: statusFilter === tab.value ? 'var(--primary-light)' : 'transparent',
              color: statusFilter === tab.value ? 'var(--primary-dark)' : 'var(--text-muted)',
              border: 'none',
              borderBottom: statusFilter === tab.value ? '3px solid var(--primary)' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table grid listing */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px' }}>Fetching enquiries details...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="card text-center" style={{ padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: 'var(--text-muted)' }}><Inbox size={48} /></div>
          <p>No enquiries matching this workflow status found.</p>
        </div>
      ) : (
        <div className="table-container" style={{ margin: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Client Name</th>
                <th>Contact info</th>
                <th>Product Interest</th>
                <th>Date Logged</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map(enq => (
                <tr key={enq.id}>
                  <td><strong>#SVS-{enq.id}</strong></td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{enq.full_name}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><PhoneCall size={12} /> {enq.mobile_number}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} color="var(--text-muted)" /> {enq.location}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 500 }}>{enq.product_name || 'Deleted Product'}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty requested: {enq.quantity}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {new Date(enq.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusClass(enq.status)}>
                      {enq.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link to={`/admin/enquiries/${enq.id}`} className="btn btn-secondary btn-sm" style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={12} /> Manage Details
                      </Link>
                      <button onClick={() => handleDelete(enq.id, enq.full_name)} className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
