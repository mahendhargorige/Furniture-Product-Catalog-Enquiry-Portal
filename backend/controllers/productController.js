import { getDatabase } from '../config/db.js';

// Helper to generate slugs
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

// GET all products with filtering, search, and sorting
export async function getProducts(req, res) {
  try {
    const { 
      search, 
      category, 
      material, 
      availability, 
      price_min, 
      price_max, 
      featured,
      sort 
    } = req.query;

    const db = await getDatabase();
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by Search Query (matches name, material, size or description)
    if (search) {
      query += ` AND (p.name LIKE ? OR p.material LIKE ? OR p.description LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Filter by Category ID or Slug
    if (category) {
      const categoryId = parseInt(category, 10);
      if (!isNaN(categoryId)) {
        query += ` AND p.category_id = ?`;
        params.push(categoryId);
      } else {
        query += ` AND c.slug = ?`;
        params.push(category);
      }
    }

    // Filter by Material
    if (material) {
      query += ` AND p.material LIKE ?`;
      params.push(`%${material}%`);
    }

    // Filter by Availability Status
    if (availability) {
      query += ` AND p.availability_status = ?`;
      params.push(availability);
    }

    // Filter by Minimum Price (price_max is compared since price ranges overlap)
    if (price_min) {
      query += ` AND p.price_max >= ?`;
      params.push(parseFloat(price_min));
    }

    // Filter by Maximum Price
    if (price_max) {
      query += ` AND p.price_min <= ?`;
      params.push(parseFloat(price_max));
    }

    // Filter by Featured
    if (featured === 'true' || featured === '1') {
      query += ` AND p.is_featured = 1`;
    }

    // Sorting options
    if (sort) {
      switch (sort) {
        case 'price_low':
          query += ` ORDER BY p.price_min ASC`;
          break;
        case 'price_high':
          query += ` ORDER BY p.price_max DESC`;
          break;
        case 'newest':
          query += ` ORDER BY p.created_at DESC`;
          break;
        case 'name_asc':
          query += ` ORDER BY p.name ASC`;
          break;
        default:
          query += ` ORDER BY p.is_featured DESC, p.id DESC`;
      }
    } else {
      // Default: featured first, then newest
      query += ` ORDER BY p.is_featured DESC, p.id DESC`;
    }

    const products = await db.all(query, params);
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to retrieve products.' });
  }
}

// GET single product by ID or Slug + Related Products
export async function getProductById(req, res) {
  const { idOrSlug } = req.params;
  try {
    const db = await getDatabase();

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    let param = parseInt(idOrSlug, 10);
    if (!isNaN(param)) {
      query += ` AND p.id = ?`;
    } else {
      query += ` AND p.slug = ?`;
      param = idOrSlug;
    }

    const product = await db.get(query, [param]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Fetch related products (same category, limit 4, excluding current product)
    const relatedProducts = await db.all(
      `SELECT * FROM products WHERE category_id = ? AND id != ? LIMIT 4`,
      [product.category_id, product.id]
    );

    return res.json({
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({ message: 'Failed to retrieve product details.' });
  }
}

// POST create product (Admin only)
export async function createProduct(req, res) {
  const {
    category_id,
    name,
    material,
    size,
    price_min,
    price_max,
    availability_status,
    description,
    image_url,
    is_featured
  } = req.body;

  // Validation
  if (!category_id || !name || !material || !size || price_min === undefined || price_max === undefined) {
    return res.status(400).json({ message: 'Category, Name, Material, Size, and Price range are required.' });
  }

  const slug = generateSlug(name);

  try {
    const db = await getDatabase();

    // Check slug uniqueness
    const existing = await db.get('SELECT id FROM products WHERE slug = ?', [slug]);
    let finalSlug = slug;
    if (existing) {
      finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const result = await db.run(
      `INSERT INTO products (category_id, name, slug, material, size, price_min, price_max, availability_status, description, image_url, is_featured, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        parseInt(category_id, 10),
        name,
        finalSlug,
        material,
        size,
        parseFloat(price_min),
        parseFloat(price_max),
        availability_status || 'available',
        description || '',
        image_url || '',
        is_featured ? 1 : 0
      ]
    );

    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    return res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Failed to create product.' });
  }
}

// PUT update product (Admin only)
export async function updateProduct(req, res) {
  const { id } = req.params;
  const {
    category_id,
    name,
    material,
    size,
    price_min,
    price_max,
    availability_status,
    description,
    image_url,
    is_featured
  } = req.body;

  if (!category_id || !name || !material || !size || price_min === undefined || price_max === undefined) {
    return res.status(400).json({ message: 'Category, Name, Material, Size, and Price range are required.' });
  }

  const slug = generateSlug(name);

  try {
    const db = await getDatabase();

    // Check if product exists
    const product = await db.get('SELECT id, slug FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Check slug uniqueness if name changed
    let finalSlug = product.slug;
    if (name.toLowerCase() !== product.slug.replace(/-[0-9]{4}$/, '').replace(/-/g, ' ')) {
      const existing = await db.get('SELECT id FROM products WHERE slug = ? AND id != ?', [slug, id]);
      finalSlug = slug;
      if (existing) {
        finalSlug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    await db.run(
      `UPDATE products 
       SET category_id = ?, name = ?, slug = ?, material = ?, size = ?, price_min = ?, price_max = ?, availability_status = ?, description = ?, image_url = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        parseInt(category_id, 10),
        name,
        finalSlug,
        material,
        size,
        parseFloat(price_min),
        parseFloat(price_max),
        availability_status,
        description || '',
        image_url || '',
        is_featured ? 1 : 0,
        id
      ]
    );

    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    return res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Failed to update product.' });
  }
}

// DELETE product (Admin only)
export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();

    const product = await db.get('SELECT id FROM products WHERE id = ?', [id]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await db.run('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ message: 'Product deleted successfully', id: parseInt(id, 10) });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Failed to delete product.' });
  }
}
