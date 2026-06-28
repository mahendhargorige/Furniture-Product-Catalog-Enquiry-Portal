import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/enquiries (Public submission)
router.post('/', createEnquiry);

// GET /api/enquiries (Protected)
router.get('/', authenticateToken, getEnquiries);

// GET /api/enquiries/:id (Protected)
router.get('/:id', authenticateToken, getEnquiryById);

// PUT /api/enquiries/:id/status (Protected status changes)
router.put('/:id/status', authenticateToken, updateEnquiryStatus);

// POST /api/enquiries/:id/notes (Protected adding logs/notes)
router.post('/:id/notes', authenticateToken, addEnquiryNote);

// DELETE /api/enquiries/:id (Protected deletion)
router.delete('/:id', authenticateToken, deleteEnquiry);

export default router;
