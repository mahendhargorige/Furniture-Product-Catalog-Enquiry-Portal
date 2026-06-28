import { getDatabase } from '../config/db.js';

// GET all categories
export async function getCategories(req, res) {
  try {
    const db = await getDatabase();
    const categories = await db.all('SELECT * FROM categories ORDER BY name ASC');
    return res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Failed to retrieve categories.' });
  }
}

// GET category by ID or slug
export async function getCategoryById(req, res) {
  const { idOrSlug } = req.params;
  try {
    const db = await getDatabase();
    
    // Check if parameter is integer ID or string slug
    let query = 'SELECT * FROM categories WHERE id = ?';
    let param = parseInt(idOrSlug, 10);
    
    if (isNaN(param)) {
      query = 'SELECT * FROM categories WHERE slug = ?';
      param = idOrSlug;
    }

    const category = await db.get(query, [param]);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({ message: 'Failed to retrieve category.' });
  }
}
