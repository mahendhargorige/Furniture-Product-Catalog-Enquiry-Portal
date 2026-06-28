import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'svs_furniture_works_secret_key_2026_db_jwt';

export async function login(req, res) {
  const { email, password } = req.body;

  // Simple input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const db = await getDatabase();
    
    // Find admin user by email
    const user = await db.get('SELECT * FROM admin_users WHERE email = ?', [email.toLowerCase().trim()]);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token (expires in 24h)
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error logging in admin:', error);
    return res.status(500).json({ message: 'An error occurred during login. Please try again.' });
  }
}
