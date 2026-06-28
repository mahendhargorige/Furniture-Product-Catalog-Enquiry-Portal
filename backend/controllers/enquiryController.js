import { getDatabase } from '../config/db.js';

// POST create enquiry (Public)
export async function createEnquiry(req, res) {
  const {
    full_name,
    mobile_number,
    email,
    location,
    product_id,
    quantity,
    message
  } = req.body;

  // Validation
  if (!full_name || !mobile_number || !email || !location || !product_id) {
    return res.status(400).json({ message: 'Name, mobile number, email, location, and product interest are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanMobile = mobile_number.replace(/\D/g, ''); // strip non-digits

  if (cleanMobile.length < 10) {
    return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number.' });
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  const numQty = parseInt(quantity, 10);
  if (isNaN(numQty) || numQty < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1.' });
  }

  try {
    const db = await getDatabase();

    // Verify product exists
    const product = await db.get('SELECT id, name FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(400).json({ message: 'The selected product does not exist.' });
    }

    const result = await db.run(
      `INSERT INTO enquiries (full_name, mobile_number, email, location, product_id, quantity, message, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        full_name.trim(),
        mobile_number.trim(),
        cleanEmail,
        location.trim(),
        parseInt(product_id, 10),
        numQty,
        message ? message.trim() : ''
      ]
    );

    // Fetch created record
    const newEnquiry = await db.get('SELECT * FROM enquiries WHERE id = ?', [result.lastID]);
    
    return res.status(201).json({
      message: 'Enquiry submitted successfully! Our team will contact you shortly.',
      enquiryId: result.lastID,
      enquiry: newEnquiry
    });

  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return res.status(500).json({ message: 'Failed to submit enquiry. Please try again later.' });
  }
}

// GET all enquiries (Admin only)
export async function getEnquiries(req, res) {
  const { status } = req.query;
  try {
    const db = await getDatabase();
    
    let query = `
      SELECT e.*, p.name as product_name, p.slug as product_slug 
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND e.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY e.created_at DESC`;

    const enquiries = await db.all(query, params);
    return res.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({ message: 'Failed to retrieve enquiries.' });
  }
}

// GET single enquiry with details & note logs (Admin only)
export async function getEnquiryById(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();

    const enquiry = await db.get(
      `SELECT e.*, p.name as product_name, p.slug as product_slug, p.image_url as product_image, c.name as category_name
       FROM enquiries e
       LEFT JOIN products p ON e.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE e.id = ?`,
      [id]
    );

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found.' });
    }

    // Fetch follow-up notes logs
    const notes = await db.all(
      `SELECT * FROM enquiry_notes WHERE enquiry_id = ? ORDER BY created_at DESC`,
      [id]
    );

    return res.json({
      enquiry,
      notes
    });
  } catch (error) {
    console.error('Error fetching enquiry details:', error);
    return res.status(500).json({ message: 'Failed to retrieve enquiry details.' });
  }
}

// PUT update enquiry status (Admin only)
export async function updateEnquiryStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['new', 'in_progress', 'contacted', 'converted', 'closed'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid or missing status.' });
  }

  const creatorName = req.user?.name || 'Admin';

  try {
    const db = await getDatabase();
    
    const enquiry = await db.get('SELECT id, status FROM enquiries WHERE id = ?', [id]);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found.' });
    }

    if (enquiry.status === status) {
      return res.json({ message: 'Status is already set to ' + status });
    }

    // Begin a transaction to ensure integrity
    await db.exec('BEGIN TRANSACTION');

    // Update status
    await db.run(
      `UPDATE enquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );

    // Create tracking note in logs
    const statusLabelMap = {
      'new': 'New / Open',
      'in_progress': 'In Progress',
      'contacted': 'Contacted Client',
      'converted': 'Converted to Sale',
      'closed': 'Closed / Non-responsive'
    };
    const logMessage = `Status updated from '${statusLabelMap[enquiry.status]}' to '${statusLabelMap[status]}'`;
    
    await db.run(
      `INSERT INTO enquiry_notes (enquiry_id, note, created_by, created_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [id, logMessage, creatorName]
    );

    await db.exec('COMMIT');

    const updatedEnquiry = await db.get('SELECT * FROM enquiries WHERE id = ?', [id]);
    const notes = await db.all('SELECT * FROM enquiry_notes WHERE enquiry_id = ? ORDER BY created_at DESC', [id]);

    return res.json({
      message: 'Enquiry status updated successfully',
      enquiry: updatedEnquiry,
      notes
    });

  } catch (error) {
    console.error('Error updating enquiry status:', error);
    try {
      const db = await getDatabase();
      await db.exec('ROLLBACK');
    } catch (_) {}
    return res.status(500).json({ message: 'Failed to update status.' });
  }
}

// POST add manual note to enquiry timeline (Admin only)
export async function addEnquiryNote(req, res) {
  const { id } = req.params;
  const { note } = req.body;

  if (!note || !note.trim()) {
    return res.status(400).json({ message: 'Note text is required.' });
  }

  const creatorName = req.user?.name || 'Admin';

  try {
    const db = await getDatabase();

    const enquiry = await db.get('SELECT id FROM enquiries WHERE id = ?', [id]);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found.' });
    }

    await db.run(
      `INSERT INTO enquiry_notes (enquiry_id, note, created_by, created_at)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      [id, note.trim(), creatorName]
    );

    const notes = await db.all(
      `SELECT * FROM enquiry_notes WHERE enquiry_id = ? ORDER BY created_at DESC`,
      [id]
    );

    return res.status(201).json({
      message: 'Note added successfully',
      notes
    });
  } catch (error) {
    console.error('Error adding enquiry note:', error);
    return res.status(500).json({ message: 'Failed to add follow-up note.' });
  }
}

// DELETE enquiry (Admin only)
export async function deleteEnquiry(req, res) {
  const { id } = req.params;
  try {
    const db = await getDatabase();

    const enquiry = await db.get('SELECT id FROM enquiries WHERE id = ?', [id]);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found.' });
    }

    // Notes will cascade delete automatically due to ON DELETE CASCADE
    await db.run('DELETE FROM enquiries WHERE id = ?', [id]);
    
    return res.json({ message: 'Enquiry deleted successfully', id: parseInt(id, 10) });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return res.status(500).json({ message: 'Failed to delete enquiry.' });
  }
}
