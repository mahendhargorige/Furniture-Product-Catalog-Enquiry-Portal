import express from 'express';
import { getCategories, getCategoryById } from '../controllers/categoryController.js';

const router = express.Router();

// GET /api/categories
router.get('/', getCategories);

// GET /api/categories/:idOrSlug
router.get('/:idOrSlug', getCategoryById);

export default router;
