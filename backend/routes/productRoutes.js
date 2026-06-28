import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products (Public)
router.get('/', getProducts);

// GET /api/products/:idOrSlug (Public)
router.get('/:idOrSlug', getProductById);

// POST /api/products (Protected)
router.post('/', authenticateToken, createProduct);

// PUT /api/products/:id (Protected)
router.put('/:id', authenticateToken, updateProduct);

// DELETE /api/products/:id (Protected)
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
