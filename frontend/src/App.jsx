import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';


// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import EnquiryForm from './pages/EnquiryForm';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminEnquiries from './pages/AdminEnquiries';
import AdminEnquiryDetail from './pages/AdminEnquiryDetail';

export default function App() {
  return (
    <ToastProvider>
      <Router>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-main)'
        }}>
          {/* Global Header Navigation */}
          <Navbar />

          {/* Main App Content Viewport */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/catalog/:idOrSlug" element={<ProductDetail />} />
              <Route path="/enquire" element={<EnquiryForm />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Administrative Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute>
                    <AdminProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/enquiries" 
                element={
                  <ProtectedRoute>
                    <AdminEnquiries />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/enquiries/:id" 
                element={
                  <ProtectedRoute>
                    <AdminEnquiryDetail />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          {/* Global Footer Branding */}
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}
