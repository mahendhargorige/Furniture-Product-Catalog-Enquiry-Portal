import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Send, PhoneCall, CheckCircle, Mail, MapPin, User, FileText, ShoppingBag } from 'lucide-react';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function EnquiryForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const preselectedProductId = searchParams.get('product_id');

  // Products list for select dropdown
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [productId, setProductId] = useState(preselectedProductId || '');
  const [quantity, setQuantity] = useState('1');
  const [message, setMessage] = useState('');

  // UI Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Load all products to populate the dropdown
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.getProducts();
        setProducts(data);
        // If a pre-selected ID was passed, make sure it is set
        if (preselectedProductId) {
          setProductId(preselectedProductId);
        }
      } catch (err) {
        console.error('Failed to load products list:', err);
        showToast('Failed to load products list for dropdown.', 'error');
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, [preselectedProductId, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation checks
    if (!fullName.trim()) {
      return showToast('Please enter your full name.', 'error');
    }
    if (!mobileNumber.trim()) {
      return showToast('Please enter your mobile number.', 'error');
    }
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return showToast('Please enter a valid 10-digit mobile number.', 'error');
    }
    if (!email.trim()) {
      return showToast('Please enter your email address.', 'error');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return showToast('Please enter a valid email address.', 'error');
    }
    if (!location.trim()) {
      return showToast('Please enter your delivery location/town.', 'error');
    }
    if (!productId) {
      return showToast('Please select a product of interest.', 'error');
    }
    const numQty = parseInt(quantity, 10);
    if (isNaN(numQty) || numQty < 1) {
      return showToast('Quantity must be at least 1.', 'error');
    }

    setIsSubmitting(true);

    try {
      const payload = {
        full_name: fullName,
        mobile_number: mobileNumber,
        email: email,
        location: location,
        product_id: productId,
        quantity: numQty,
        message: message
      };

      const response = await api.submitEnquiry(payload);

      // Store submission reference details for final screen
      const selectedProductObj = products.find(p => p.id.toString() === productId.toString());
      setSubmittedData({
        refId: response.enquiryId,
        name: fullName,
        mobile: mobileNumber,
        email: email,
        productName: selectedProductObj ? selectedProductObj.name : 'Selected Product',
        quantity: numQty
      });

      showToast('Enquiry submitted successfully!', 'success');

      // Clear Form Fields
      setFullName('');
      setMobileNumber('');
      setEmail('');
      setLocation('');
      setProductId('');
      setQuantity('1');
      setMessage('');

    } catch (err) {
      console.error('Enquiry submit error:', err);
      showToast(err.message || 'Failed to submit enquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If successfully submitted, display confirmation card
  if (submittedData) {
    return (
      <div className="container py-5" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card text-center" style={{
          maxWidth: '600px',
          padding: '48px 32px',
          boxShadow: 'var(--shadow-lg)',
          borderTop: '5px solid var(--status-converted)'
        }}>
          <div style={{ color: 'var(--status-converted)', display: 'inline-flex', alignSelf: 'center', marginBottom: '20px' }}>
            <CheckCircle size={56} />
          </div>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>Enquiry Submitted</h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '24px' }}>
            Reference Enquiry ID: <strong>#SVS-{submittedData.refId}</strong>
          </span>

          <div style={{
            backgroundColor: 'var(--bg-main)',
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '32px',
            fontSize: '0.95rem'
          }}>
            <p><strong>Customer Name:</strong> {submittedData.name}</p>
            <p><strong>Mobile Number:</strong> {submittedData.mobile}</p>
            <p><strong>Product Selected:</strong> {submittedData.productName} (x{submittedData.quantity})</p>
            <p><strong>Confirmation Email:</strong> sent to {submittedData.email}</p>
          </div>

          <p style={{ marginBottom: '32px', lineHeight: 1.5 }}>
            Thank you! Your requirements have been logged in our system. A sales coordinator from <strong>Sri Venkata Sai Furniture Works</strong> will call you or message you on WhatsApp shortly to discuss details and give you the final price quote.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => setSubmittedData(null)} className="btn btn-primary">
              Submit New Enquiry
            </button>
            <Link to="/catalog" className="btn btn-secondary">
              Browse More Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 enquiry-page-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }} >

      {/* Sidebar Info Banner */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '12px' }}>Request Details & Price Quotes</h1>
          <p style={{ fontSize: '1.1rem' }}>
            Fill out our brief enquiry form and our production coordinators will send you a detailed commercial quote, drawings, and delivery timelines.
          </p>
        </div>

        <div className="card glass" style={{ padding: '24px', borderLeft: '4px solid var(--accent)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={20} color="var(--primary)" /> For Dealers & Bulk Inquiries
          </h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
            Are you an interior designer, contractor, or local furniture dealer looking for wholesale supply?
          </p>
          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--primary-dark)' }}>
            Please specify "Dealer Pricing Request" in the message notes along with your GST registration details.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>Site measurement & design drawing visits can be scheduled for Hyderabad/Secunderabad locations.</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Mail size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>Quotes are sent on email & WhatsApp within 24 hours of submission.</span>
          </div>
        </div>
      </div>

      {/* Main Submission Form Sheet */}
      <div className="card" style={{ padding: '36px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
          Submit Requirement Form
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> Full Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="enquiry-form-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><PhoneCall size={16} /> Mobile / WhatsApp Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Delivery Location / Town *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Gachibowli, Hyderabad or Guntur, AP"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }} className="enquiry-form-row">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShoppingBag size={16} /> Product of Interest *</label>
              <select
                className="form-select"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                disabled={loadingProducts}
              >
                <option value="">-- Choose a Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.material})</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                className="form-input"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} /> Custom Specifications / Message</label>
            <textarea
              className="form-textarea"
              placeholder="Describe any size modifications, preferred wood polish colors, upholstery type, or custom drawings you have..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              marginTop: '10px',
              padding: '14px 0',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            disabled={isSubmitting}
          >
            <Send size={16} /> {isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
          </button>
        </form>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .enquiry-page-layout {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
        @media (max-width: 767px) {
          .enquiry-form-row {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
