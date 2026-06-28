import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, PhoneCall, Mail, MapPin, Calendar, Send, ExternalLink } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function AdminEnquiryDetail() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [enqDetails, setEnqDetails] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Input states
  const [newStatus, setNewStatus] = useState('');
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchEnquiryDetails = async () => {
    try {
      const data = await api.getEnquiry(id);
      setEnqDetails(data.enquiry);
      setNotes(data.notes || []);
      setNewStatus(data.enquiry.status);
    } catch (err) {
      console.error('Failed to load enquiry details:', err);
      showToast('Failed to load enquiry information.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiryDetails();
  }, [id]);

  const handleStatusChange = async (e) => {
    const statusVal = e.target.value;
    setNewStatus(statusVal);
    setUpdatingStatus(true);
    try {
      await api.updateEnquiryStatus(id, statusVal);
      showToast('Status updated successfully.', 'success');
      fetchEnquiryDetails(); // refresh timeline notes and status logs
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setSavingNote(true);
    try {
      await api.addEnquiryNote(id, noteText);
      showToast('Remarks logged successfully.', 'success');
      setNoteText('');
      fetchEnquiryDetails(); // reload timeline notes
    } catch (err) {
      console.error('Failed to save remarks:', err);
      showToast(err.message || 'Failed to save remarks.', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner" style={{ margin: '80px auto' }}></div>
        <p>Loading enquiry transaction history...</p>
      </div>
    );
  }

  if (!enqDetails) {
    return (
      <div className="container py-5 text-center">
        <h2 style={{ color: 'red' }}>Enquiry Not Found</h2>
        <p>Could not retrieve record details for ID #{id}.</p>
        <Link to="/admin/enquiries" className="btn btn-primary mt-4">
          <ArrowLeft size={16} /> Back to Enquiries
        </Link>
      </div>
    );
  }

  // Format WhatsApp message text
  const cleanMobile = enqDetails.mobile_number.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/91${cleanMobile}?text=Hi%20${encodeURIComponent(enqDetails.full_name)},%20this%20is%20Sri%20Venkata%20Sai%20Furniture%20Works%20regarding%20your%20enquiry%20for%20${encodeURIComponent(enqDetails.product_name || 'custom furniture')}.`;

  const getStatusClass = (status) => {
    return `badge badge-${status}`;
  };

  return (
    <div className="container py-5" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Navigation */}
      <div>
        <Link to="/admin/enquiries" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Enquiries List
        </Link>
      </div>

      {/* Header title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enquiry Reference Log</span>
          <h1 style={{ fontSize: '2.8rem', marginTop: '4px', marginBottom: '4px' }}>Enquiry #SVS-{enqDetails.id}</h1>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} /> Logged: {new Date(enqDetails.created_at).toLocaleString()}
          </span>
        </div>

        {/* Quick status dropdown */}
        <div className="card glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)' }}>Update Status:</span>
          <select 
            className="form-select"
            value={newStatus}
            onChange={handleStatusChange}
            disabled={updatingStatus}
            style={{ width: '160px', padding: '8px 12px' }}
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted (Sale)</option>
            <option value="closed">Closed / Dead</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px'
      }} className="enquiry-detail-layout">
        
        {/* Left Side: Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Client details */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '16px' }}>
              Customer Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Full Name</span>
                <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{enqDetails.full_name}</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="enq-grid-cols">
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Mobile Number</span>
                  <a href={`tel:${enqDetails.mobile_number}`} style={{ color: 'var(--primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {enqDetails.mobile_number}
                  </a>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>Email Address</span>
                  <a href={`mailto:${enqDetails.email}`} style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>
                    {enqDetails.email}
                  </a>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Location</span>
                <span>{enqDetails.location}</span>
              </div>

              {/* Instant Communication channels */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }} className="comm-buttons-row">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1, backgroundColor: '#25D366', borderColor: '#25D366', color: '#fff' }}>
                  <MessageSquare size={14} /> WhatsApp Client
                </a>
                <a href={`mailto:${enqDetails.email}?subject=SRI%20VENKATA%20SAI%20FURNITURE%20-%20Enquiry%20%23SVS-${enqDetails.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Mail size={14} /> Send Email
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Product specification requirements */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '16px' }}>
              Enquired Product
            </h3>

            {enqDetails.product_name ? (
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} className="product-enq-row">
                <div style={{ width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--border-light)' }}>
                  <img 
                    src={enqDetails.product_image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100'} 
                    alt="" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flexGrow: 1, fontSize: '0.95rem' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{enqDetails.product_name}</h4>
                  <p style={{ fontSize: '0.85rem' }}>Category: <strong>{enqDetails.category_name}</strong></p>
                  <p style={{ fontSize: '0.85rem' }}>Quantity Interest: <strong style={{ color: 'var(--primary)' }}>{enqDetails.quantity} unit(s)</strong></p>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Est. Catalog Price: ₹{enqDetails.price_min?.toLocaleString()} - ₹{enqDetails.price_max?.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: 'red' }}>The product associated with this enquiry has been deleted from catalog.</p>
            )}

            {/* Custom customer message */}
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              backgroundColor: 'var(--bg-main)', 
              borderRadius: '6px',
              borderLeft: '4px solid var(--accent)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Client Message</span>
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                {enqDetails.message ? `"${enqDetails.message}"` : 'No custom requirements submitted.'}
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Follow-up Timeline logs & remarks entry */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
            Follow-up Timeline Log
          </h3>

          {/* Remark entry form */}
          <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label className="form-label">Add Note / Follow-up remarks</label>
            <textarea 
              className="form-textarea"
              placeholder="e.g. Spoke to Rajesh. Wants dual-tone walnut finish, needs delivery in Gachibowli by next Friday. Quote sent ₹48k."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              style={{ minHeight: '80px' }}
              required
            />
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '4px' }}
              disabled={savingNote}
            >
              <Send size={12} /> Log Note
            </button>
          </form>

          {/* Timeline listing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', fontWeight: 600 }}>History Timeline</h4>

            {notes.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No remarks logs written yet.</p>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                paddingLeft: '20px',
                borderLeft: '2px solid var(--border-color)',
                gap: '24px'
              }}>
                {notes.map((log) => (
                  <div key={log.id} style={{ position: 'relative' }}>
                    {/* Node Dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-26px',
                      top: '4px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      border: '2px solid var(--bg-card)'
                    }}></div>
                    
                    <div style={{ fontSize: '0.9rem' }}>
                      <p style={{ color: 'var(--text-main)', fontWeight: 450 }}>{log.note}</p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Logged by: <strong>{log.created_by}</strong></span>
                        <span>•</span>
                        <span>{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (min-width: 992px) {
          .enquiry-detail-layout {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 767px) {
          .enq-grid-cols, .comm-buttons-row, .product-enq-row {
            grid-template-columns: 1fr !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
