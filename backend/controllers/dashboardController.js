import { getDatabase } from '../config/db.js';

export async function getDashboardSummary(req, res) {
  try {
    const db = await getDatabase();

    // 1. Total Products
    const productsCount = await db.get('SELECT COUNT(*) as count FROM products');

    // 2. Total Enquiries
    const enquiriesCount = await db.get('SELECT COUNT(*) as count FROM enquiries');

    // 3. Status Breakdown
    const statusCounts = await db.all(`
      SELECT status, COUNT(*) as count 
      FROM enquiries 
      GROUP BY status
    `);

    // Format breakdown to guarantee all statuses are represented
    const defaultStatuses = {
      'new': 0,
      'in_progress': 0,
      'contacted': 0,
      'converted': 0,
      'closed': 0
    };
    
    statusCounts.forEach(item => {
      if (item.status in defaultStatuses) {
        defaultStatuses[item.status] = item.count;
      }
    });

    // Calculate totals for pending (new + in_progress)
    const pendingCount = defaultStatuses['new'] + defaultStatuses['in_progress'];
    const convertedCount = defaultStatuses['converted'];
    const contactedCount = defaultStatuses['contacted'];
    const closedCount = defaultStatuses['closed'];

    // 4. Recent Enquiries (last 5)
    const recentEnquiries = await db.all(`
      SELECT e.*, p.name as product_name 
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      ORDER BY e.created_at DESC 
      LIMIT 5
    `);

    // 5. Category distribution count
    const categoryDistribution = await db.all(`
      SELECT c.name as category_name, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
    `);

    return res.json({
      totalProducts: productsCount.count,
      totalEnquiries: enquiriesCount.count,
      pendingEnquiries: pendingCount,
      convertedEnquiries: convertedCount,
      contactedEnquiries: contactedCount,
      closedEnquiries: closedCount,
      statusBreakdown: defaultStatuses,
      categoryDistribution,
      recentEnquiries
    });

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return res.status(500).json({ message: 'Failed to retrieve dashboard analytics.' });
  }
}
