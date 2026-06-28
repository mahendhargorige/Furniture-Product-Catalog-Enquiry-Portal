# SVS Furniture REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Admin Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@svsfurniture.com",
    "password": "admin123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "name": "SVS Admin",
      "email": "admin@svsfurniture.com",
      "role": "admin"
    }
  }
  ```

---

## Categories

### Get All Categories
- **Endpoint**: `GET /categories`
- **Response (200 OK)**: Array of category objects.

### Get Category by ID or Slug
- **Endpoint**: `GET /categories/:idOrSlug`
- **Response (200 OK)**: Category object.

---

## Products

### Get All Products (Filterable)
- **Endpoint**: `GET /products`
- **Query Parameters (Optional)**:
  - `search`: Keyword string search (name, material, description)
  - `category`: Category ID or slug string
  - `material`: Material keyword (Teak, Walnut, Mahogany)
  - `availability`: Availability status string (`available`, `low_stock`, `out_of_stock`, `custom_order`)
  - `price_min`: Numeric minimum price filter
  - `price_max`: Numeric maximum price filter
  - `featured`: Filter by featured flag (`true` or `1`)
  - `sort`: Sorting option (`price_low`, `price_high`, `newest`, `name_asc`)
- **Response (200 OK)**: Array of product objects.

### Get Product Details
- **Endpoint**: `GET /products/:idOrSlug`
- **Response (200 OK)**:
  ```json
  {
    "product": { "id": 1, "name": "...", "material": "..." },
    "relatedProducts": [ ... ]
  }
  ```

### Create Product (Protected)
- **Endpoint**: `POST /products`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**: Same as database fields (name, category_id, material, size, price_min, price_max, description, image_url, availability_status, is_featured).
- **Response (201 Created)**: Created product object.

### Update Product (Protected)
- **Endpoint**: `PUT /products/:id`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK)**: Updated product object.

### Delete Product (Protected)
- **Endpoint**: `DELETE /products/:id`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK)**: `{ "message": "Product deleted successfully", "id": 1 }`

---

## Enquiries

### Submit Enquiry (Public)
- **Endpoint**: `POST /enquiries`
- **Request Body**:
  ```json
  {
    "full_name": "Rajesh Kumar",
    "mobile_number": "9876543210",
    "email": "rajesh.k@gmail.com",
    "location": "Hyderabad",
    "product_id": 1,
    "quantity": 1,
    "message": "Prefer walnut polish finish."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Enquiry submitted successfully! Our team will contact you shortly.",
    "enquiryId": 3,
    "enquiry": { ... }
  }
  ```

### Get All Enquiries (Protected)
- **Endpoint**: `GET /enquiries`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Query Parameters**: `status` (optional)
- **Response (200 OK)**: Array of enquiries.

### Get Enquiry Details with Timeline Notes (Protected)
- **Endpoint**: `GET /enquiries/:id`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK)**:
  ```json
  {
    "enquiry": { "id": 1, "full_name": "..." },
    "notes": [ { "id": 1, "note": "...", "created_at": "..." } ]
  }
  ```

### Update Enquiry Status (Protected)
- **Endpoint**: `PUT /enquiries/:id/status`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**: `{ "status": "contacted" }`
- **Response (200 OK)**: Updated enquiry and log timeline.

### Add Follow-up Note (Protected)
- **Endpoint**: `POST /enquiries/:id/notes`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**: `{ "note": "Remarks go here..." }`
- **Response (201 Created)**: Updated notes array.

---

## Dashboard Summary

### Get Dashboard Analytics (Protected)
- **Endpoint**: `GET /dashboard/summary`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response (200 OK)**:
  ```json
  {
    "totalProducts": 8,
    "totalEnquiries": 2,
    "pendingEnquiries": 2,
    "convertedEnquiries": 0,
    "statusBreakdown": { "new": 1, "in_progress": 1, "contacted": 0, ... },
    "categoryDistribution": [ { "category_name": "Home Furniture", "product_count": 3 } ],
    "recentEnquiries": [ ... ]
  }
  ```
