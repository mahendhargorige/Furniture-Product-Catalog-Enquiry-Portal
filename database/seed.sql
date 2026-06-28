-- SQL Seed Data for Sri Venkata Sai Furniture Works

-- 1. Insert Categories
INSERT OR IGNORE INTO categories (id, name, slug, description) VALUES
(1, 'Home Furniture', 'home-furniture', 'Premium sofas, dining tables, beds, and wardrobes designed for modern homes.'),
(2, 'Office Furniture', 'office-furniture', 'Ergonomic chairs, executive desks, conference tables, and office workstations.'),
(3, 'Export Furniture', 'export-furniture', 'Handcrafted teak and rosewood furniture exported worldwide, highlighting Indian craftsmanship.'),
(4, 'Custom Designs', 'custom-designs', 'Bespoke, custom-tailored furniture built exactly to client specifications and drawings.');

-- 2. Insert Products
INSERT OR IGNORE INTO products (id, category_id, name, slug, material, size, price_min, price_max, availability_status, description, image_url, is_featured) VALUES
(1, 1, 'Royal Teak Wood Sofa Set', 'royal-teak-sofa-set', 'Premium Teak Wood & High-Density Foam', '3-Seater + 2-Seater (Standard)', 45000.00, 65000.00, 'available', 'Hand-carved premium teak wood sofa set with velvet upholstery and royal cushions. Extremely durable and elegant.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60', 1),
(2, 1, 'Mahogany 6-Seater Dining Table', 'mahogany-6-seater-dining-table', 'Solid Mahogany Wood & Glass Top', '6ft x 3.5ft x 2.5ft', 35000.00, 52000.00, 'available', 'Sturdy 6-seater dining table made of mahogany, complete with 6 cushioned chairs and a polished tempered glass top.', 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&auto=format&fit=crop&q=60', 1),
(3, 1, 'King Size Teak Wood Bed with Storage', 'king-size-teak-wood-bed', 'Teak Wood & Plywood Storage Boxes', '72" x 78" (King Size)', 40000.00, 58000.00, 'available', 'Elegant king-size bed with built-in hydraulic storage compartments. Polished in dual-tone walnut and natural wood colors.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=60', 0),
(4, 2, 'Executive Ergonomic Desk', 'executive-ergonomic-desk', 'Engineered Wood & Steel Frame', '5ft x 2.5ft x 2.5ft', 12000.00, 18000.00, 'available', 'Spacious executive office desk featuring integrated wire management channels, key-lock drawers, and a clean matte finish.', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=60', 0),
(5, 2, 'Premium High-Back Mesh Chair', 'premium-high-back-mesh-chair', 'Breathable Mesh, Nylon Frame & Chrome Base', 'Adjustable (Standard)', 65000.00, 8500.00, 'available', 'Ergonomic high-back office chair with adjustable lumbar support, 3D armrests, tilt-lock mechanism, and heavy-duty wheels.', 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop&q=60', 1),
(6, 3, 'Handcrafted Teak Wood Carved Door', 'teak-wood-carved-door', '100% Solid Old Teak Wood', '80" x 36" x 1.5"', 25000.00, 38000.00, 'low_stock', 'Beautifully hand-carved main door featuring traditional Indian motifs. Ideal for heritage houses and export collections.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60', 1),
(7, 3, 'Rosewood Vintage Dressing Table', 'rosewood-vintage-dressing-table', 'Sheesham / Rosewood & Brass Inlays', '4ft x 1.5ft x 6ft', 28000.00, 42000.00, 'available', 'Traditional vintage style dressing table made of fine rosewood with elegant brass floral inlays and an oval mirror.', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=60', 0),
(8, 4, 'Bespoke Walnut Modular Wardrobe', 'bespoke-walnut-modular-wardrobe', 'Walnut Veneer & Soft-Close Hardware', 'Custom Dimensions (As per site)', 60000.00, 95000.00, 'custom_order', 'Bespoke walk-in modular wardrobe system customized exactly to user space with profile lighting and glass drawers.', 'https://images.unsplash.com/photo-1558882224-cca166733360?w=600&auto=format&fit=crop&q=60', 0);

-- 3. Insert Admin User (Password is 'admin123' - BCrypt hash with 10 salt rounds)
INSERT OR IGNORE INTO admin_users (id, name, email, password_hash, role) VALUES
(1, 'SVS Admin', 'admin@svsfurniture.com', '$2a$10$r4xwLmAxUdqRm9mgI30E6Otna3vs86yXOTumMSibYoQZq.1hlEw6e', 'admin');

-- 4. Insert Sample Enquiries
INSERT OR IGNORE INTO enquiries (id, full_name, mobile_number, email, location, product_id, quantity, message, status) VALUES
(1, 'Rajesh Kumar', '9876543210', 'rajesh.k@gmail.com', 'Hyderabad, Telangana', 1, 1, 'I am looking for a 5-seater teak wood sofa set. Can you deliver to Gachibowli? What is the final price?', 'new'),
(2, 'Ananya Sharma', '9123456789', 'ananya.sharma@yahoo.com', 'Bangalore, Karnataka', 6, 2, 'Interested in ordering 2 carved main doors for my new house project. Do you support custom designs?', 'in_progress');

-- 5. Insert Sample Notes
INSERT OR IGNORE INTO enquiry_notes (id, enquiry_id, note, created_by) VALUES
(1, 2, 'Called Ananya, she sent the CAD drawings for the doors. Teak wood required. Quote in progress.', 'SVS Admin');
