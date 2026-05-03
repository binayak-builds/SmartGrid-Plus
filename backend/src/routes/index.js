const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// ==========================================
// AUTHENTICATION APIs
// ==========================================

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const query = `
      SELECT l.*, c.email 
      FROM login l 
      LEFT JOIN customer c ON l.meter_no = c.meter_no 
      WHERE (l.username = ? OR l.meter_no = ? OR c.email = ?) 
      AND l.password = ?
    `;
    const [rows] = await pool.query(query, [username, username, username, password]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const token = jwt.sign(
      { meter_no: user.meter_no, username: user.username, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    let { meter_no, username, name, firstName, lastName, password, address, city, state, email, phone } = req.body;
    
    // Fallback for missing fields from simple signup form
    if (!meter_no) meter_no = Math.floor(100000 + Math.random() * 900000).toString();
    if (!name && firstName) name = `${firstName} ${lastName || ''}`.trim();
    if (!username && email) username = email.split('@')[0] + Math.floor(Math.random() * 100);
    if (!address) address = 'Pending Onboarding';
    if (!city) city = 'Unknown';
    if (!state) state = 'Unknown';
    if (!phone) phone = '0000000000';

    await connection.beginTransaction();
    
    // 1. Insert into login
    await connection.query(
      'INSERT INTO login(meter_no, username, name, password, user_type) VALUES (?, ?, ?, ?, ?)',
      [meter_no, username, name, password, 'user']
    );
    
    // 2. Insert into customer
    await connection.query(
      'INSERT INTO customer(name, meter_no, address, city, state, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, meter_no, address, city, state, email, phone]
    );

    // Fetch tax data for accurate billing
    const [taxRows] = await connection.query('SELECT cost_per_unit, meter_rent, service_charge, service_tax, fixed_tax FROM tax LIMIT 1');
    const tax = taxRows[0] || { cost_per_unit: 8, meter_rent: 50, service_charge: 30, service_tax: 20, fixed_tax: 10 };

    // 2.1 Insert into meter_info with randomized bill_type
    const billType = Math.random() > 0.8 ? 'Commercial' : 'Residential';
    await connection.query(
      'INSERT INTO meter_info(meter_no, meter_location, meter_type, phase_code, bill_type, days) VALUES (?, ?, ?, ?, ?, ?)',
      [meter_no, 'Indoor', 'Smart Digital', billType === 'Commercial' ? 'Three' : 'Single', billType, 30]
    );
    
    // 3 & 4. Random Bills, Usage History, Payments
    let seed = Array.from(meter_no).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const customRandom = () => {
      if (process.env.DEMO_MODE === 'true') {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      }
      return Math.random();
    };
    const randInt = (min, max) => Math.floor(customRandom() * (max - min + 1)) + min;
    const randChoice = (arr) => arr[Math.floor(customRandom() * arr.length)];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let lastMonthUnits = 0;
    let hasUnpaid = false;
    let hasPaid = false;
    let alertMap = new Map();
    let unitHistory = [];
    
    // Base units depending on type
    const baseMin = billType === 'Commercial' ? 200 : 80;
    const baseMax = billType === 'Commercial' ? 500 : 300;
    
    // Slight increasing trend base
    let trendBase = randInt(baseMin, baseMin + 50);

    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const monthIndex = i + 1;
      
      // Trend increases slightly per month for realism
      trendBase += randInt(5, 15);
      
      // Seasonal Variation: Summer months (May, Jun) -> higher usage
      let seasonalMultiplier = 1.0;
      if (month === 'May' || month === 'Jun') seasonalMultiplier = 1.2;
      
      // Actual units is trend +/- noise, with seasonal multiplier
      const rawUnits = trendBase + randInt(-20, 20);
      let units = Math.floor(rawUnits * seasonalMultiplier);
      
      // Micro behavior noise (+/- 10-15 units)
      units += (customRandom() < 0.5 ? -1 : 1) * randInt(10, 15);
      units = Math.max(baseMin, Math.min(baseMax * 1.4, units)); // Clamp
      
      unitHistory.push(units);
      
      // Check for unusual spike alert (> 20% high, > 30% critical)
      if (lastMonthUnits > 0) {
        if (units > lastMonthUnits * 1.3) {
          alertMap.set(`critical_spike_${monthIndex}`, { message: `Critical usage spike detected in ${month}`, severity: 'critical' });
        } else if (units > lastMonthUnits * 1.2) {
          alertMap.set(`high_spike_${monthIndex}`, { message: `Unusual usage spike detected in ${month}`, severity: 'high' });
        }
      }
      lastMonthUnits = units;
      
      // Calculate total bill using tax data
      const energyCost = units * tax.cost_per_unit;
      const totalbill = Math.round(energyCost + tax.meter_rent + tax.service_charge + tax.service_tax + tax.fixed_tax);
      
      // Randomize status. Older months mostly 'paid'.
      let status = (i < 4) ? 'paid' : (randInt(0, 2) === 0 ? 'unpaid' : 'paid');
      if (i === months.length - 1 && !hasUnpaid) status = 'unpaid';
      if (i === 0 && !hasPaid) status = 'paid'; // force at least 1 paid
      if (status === 'unpaid') hasUnpaid = true;
      if (status === 'paid') hasPaid = true;

      // Insert Bill with month_index
      const [billResult] = await connection.query(
        'INSERT INTO bill(meter_no, month, month_index, units, totalbill, status) VALUES (?, ?, ?, ?, ?, ?)',
        [meter_no, month, monthIndex, units, totalbill, status]
      );
      const billId = billResult.insertId;

      // Insert Usage History exactly matching bill to ensure chart consistency
      await connection.query(
        'INSERT INTO usage_history(meter_no, month, month_index, units) VALUES (?, ?, ?, ?)',
        [meter_no, month, monthIndex, units]
      );

      // Insert Payment if Paid with slight payment delay (0-5 days)
      if (status === 'paid') {
        const day = 10 + randInt(0, 5); // Simulating payment between 10th and 15th
        const year = new Date().getFullYear();
        const paymentDate = `${year}-${monthIndex.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        await connection.query(
          'INSERT INTO payments(bill_id, amount, payment_date, status) VALUES (?, ?, ?, ?)',
          [billId, totalbill, paymentDate, 'completed']
        );
      }
    }

    // 5. AI Predictions (next month = Jul)
    // Use last 3 months average + momentum
    const last3 = unitHistory.slice(-3);
    const avg3 = last3.reduce((a, b) => a + b, 0) / (last3.length || 1);
    
    // Calculate momentum based on the difference between the 3rd last and last month
    let momentum = last3.length === 3 ? (last3[2] - last3[0]) / 2 : 0;
    momentum = Math.max(-50, Math.min(50, momentum)); // Clamp momentum

    const predictedUnits = Math.floor(Math.max(0, avg3 + momentum + randInt(-5, 5)));
    
    const predictedEnergyCost = predictedUnits * tax.cost_per_unit;
    const predictedBill = Math.round(predictedEnergyCost + tax.meter_rent + tax.service_charge + tax.service_tax + tax.fixed_tax);
    
    await connection.query(
      'INSERT INTO ai_predictions(meter_no, predicted_units, predicted_bill, month) VALUES (?, ?, ?, ?)',
      [meter_no, predictedUnits, predictedBill, 'Jul']
    );

    // 6. Energy Assets
    const numAssets = randInt(1, 3);
    // Tie asset capacity to average usage
    const baseCapacity = Math.max(2, Math.floor((avg3 || 200) / 50));
    
    for (let i = 0; i < numAssets; i++) {
      const type = billType === 'Commercial' 
        ? randChoice(['battery', 'battery', 'solar']) 
        : randChoice(['solar', 'solar', 'battery']);
      let capacity = baseCapacity + randInt(-1, 2);
      capacity = Math.max(2, Math.min(12, capacity)); // Clamp capacity
      
      const status = randChoice(['active', 'active', 'inactive']);
      await connection.query(
        'INSERT INTO energy_assets(meter_no, type, capacity, status) VALUES (?, ?, ?, ?)',
        [meter_no, type, capacity, status]
      );
    }

    // 7. Automation Rules
    const numRules = randInt(2, 4);
    const ruleNames = ['Eco Mode', 'Peak Saver', 'Night Saver', 'Auto Cutoff', 'Load Balancer'];
    const actions = ['Turn off AC', 'Reduce load', 'Switch to Battery', 'Dim Lights', 'Limit usage'];
    for (let i = 0; i < numRules; i++) {
      const ruleName = randChoice(ruleNames);
      const action = randChoice(actions);
      const status = randChoice(['active', 'inactive']);
      await connection.query(
        'INSERT INTO automation_rules(meter_no, rule_name, action, status) VALUES (?, ?, ?, ?)',
        [meter_no, ruleName, action, status]
      );
    }

    // 8. Alerts System
    if (hasUnpaid) {
      alertMap.set('unpaid', { message: 'Payment pending for past invoice', severity: 'medium' });
    }
    if (lastMonthUnits > 250) {
      alertMap.set('high_usage', { message: `High usage detected (${lastMonthUnits} kWh)`, severity: 'high' });
    }
    if (alertMap.size === 0) {
      alertMap.set('normal', { message: 'Usage normal, grid stable', severity: 'low' });
    }

    for (const [key, alert] of alertMap) {
      await connection.query(
        'INSERT INTO alerts(meter_no, message, severity) VALUES (?, ?, ?)',
        [meter_no, alert.message, alert.severity]
      );
    }

    await connection.commit();

    // Create token for immediate login
    const token = jwt.sign(
      { meter_no, username, user_type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: { meter_no, username, name, user_type: 'user', email }
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to create user' });
  } finally {
    connection.release();
  }
});

// GET /me to verify token (needed for frontend AuthContext)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM login WHERE meter_no=?', [req.user.meter_no]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// USER PROFILE APIs (Protected)
// ==========================================

router.get('/profile/:meter_no', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customer WHERE meter_no=?', [req.params.meter_no]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/meter/:meter_no', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM meter_info WHERE meter_no=?', [req.params.meter_no]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// DASHBOARD APIs (Protected)
// ==========================================

router.get('/dashboard/:meter_no', authenticateToken, async (req, res) => {
  try {
    const meter_no = req.params.meter_no;

    // Join query
    const [history] = await pool.query(`
      SELECT c.name, b.month, b.units, b.totalbill, b.status
      FROM customer c
      JOIN bill b ON c.meter_no = b.meter_no
      WHERE c.meter_no=?
    `, [meter_no]);

    // Latest bill
    const [latestBill] = await pool.query(`
      SELECT * FROM bill
      WHERE meter_no=?
      ORDER BY bill_id DESC LIMIT 1
    `, [meter_no]);

    // Status count
    const [statusCount] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM bill
      WHERE meter_no=?
      GROUP BY status
    `, [meter_no]);

    res.json({
      history,
      latestBill: latestBill[0] || null,
      statusCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// ANALYTICS APIs (Protected)
// ==========================================

// ANALYTICS APIs (Protected)
// Consolidated in later section


// ==========================================
// USAGE GRAPH API (Protected)
// ==========================================

// USAGE GRAPH API (Protected)
// Consolidated in later section


// ==========================================
// BILLING APIs (Protected)
// ==========================================

router.get('/bills/:meter_no', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bill WHERE meter_no=?', [req.params.meter_no]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/unpaid', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bill WHERE status='unpaid'");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/high-usage', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bill WHERE units > 100");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// PAYMENT APIs (Protected)
// ==========================================

router.post('/pay/:bill_id', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const bill_id = req.params.bill_id;
    const { amount } = req.body;

    await connection.beginTransaction();

    await connection.query("UPDATE bill SET status='paid' WHERE bill_id=?", [bill_id]);

    await connection.query(
      "INSERT INTO payments (bill_id, amount, payment_date, status) VALUES (?, ?, NOW(), 'completed')",
      [bill_id, amount]
    );

    await connection.commit();
    res.json({ message: 'Payment successful' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Payment failed' });
  } finally {
    connection.release();
  }
});

// ==========================================
// ALERTS APIs (Protected)
// ==========================================

router.get('/alerts/:meter_no', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alerts WHERE meter_no=?', [req.params.meter_no]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// ENERGY / METER APIs (Protected)
// ==========================================

router.get('/energy_info/:meter_no', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.name, m.meter_type, m.meter_location
      FROM customer c
      JOIN meter_info m ON c.meter_no = m.meter_no
      WHERE c.meter_no=?
    `, [req.params.meter_no]);
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/analytics — system-wide stats for admin and users
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const [rev] = await pool.query('SELECT SUM(totalbill) as total_revenue, AVG(totalbill) as avg_bill, AVG(units) as avg_units, MAX(totalbill) as max_bill FROM bill')
    const [unpaid] = await pool.query('SELECT SUM(totalbill) as unpaidTotal, COUNT(*) as unpaidCount FROM bill WHERE status="unpaid"')
    
    res.json({
      total_revenue: rev[0].total_revenue || 0,
      totalRevenue: rev[0].total_revenue || 0, // for FinancialOverview compat
      avg_units: rev[0].avg_units || 0,
      max_bill: rev[0].max_bill || 0,
      avgBill: Math.round(rev[0].avg_bill) || 0,
      unpaidTotal: unpaid[0].unpaidTotal || 0,
      unpaidCount: unpaid[0].unpaidCount || 0
    })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/usage/:meter_no — get usage history for chart
router.get('/usage/:meter_no', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT month, units FROM usage_history WHERE meter_no=? ORDER BY month', [req.params.meter_no])
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ==========================================
// ADMIN APIs (Protected)
// ==========================================

router.get('/admin/customers', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customer');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/admin/bills', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bill');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/admin/unpaid-customers', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customer WHERE name IN (SELECT name FROM bill WHERE status="unpaid")')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/predictions', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT p.*, c.name as customer_name FROM ai_predictions p JOIN customer c ON p.meter_no = c.meter_no')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/admin/assets', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT a.*, c.name as customer_name FROM energy_assets a JOIN customer c ON a.meter_no = c.meter_no')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

router.get('/admin/asset-stats', authenticateToken, async (req, res) => {
  try {
    const [solar] = await pool.query('SELECT COUNT(*) as count, SUM(capacity) as totalCapacity FROM energy_assets WHERE type="solar"')
    const [battery] = await pool.query('SELECT COUNT(*) as count, SUM(capacity) as totalCapacity FROM energy_assets WHERE type="battery"')
    const [counts] = await pool.query('SELECT status, COUNT(*) as count FROM energy_assets GROUP BY status')
    res.json({
      solar: solar[0],
      battery: battery[0],
      activeCount: counts.find(c => c.status === 'active')?.count || 0,
      inactiveCount: counts.find(c => c.status === 'inactive')?.count || 0
    })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// ==========================================
// MISSING ROUTES (referenced by frontend)
// ==========================================

// GET /api/meter — list all meters
router.get('/meter', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT m.*, c.name as customer_name FROM meter_info m LEFT JOIN customer c ON m.meter_no = c.meter_no')
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/payments/history — payment history
router.get('/payments/history', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, b.meter_no, b.month, b.units, b.totalbill, c.name as customer_name
      FROM payments p
      JOIN bill b ON p.bill_id = b.bill_id
      JOIN customer c ON b.meter_no = c.meter_no
      ORDER BY p.payment_date DESC
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/admin/automation — list all automation rules for admin
router.get('/admin/automation', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, c.name as customer_name 
      FROM automation_rules r 
      JOIN customer c ON r.meter_no = c.meter_no
    `)
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/automation/:meter_no — automation rules for a meter
router.get('/automation/:meter_no', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM automation_rules WHERE meter_no=?', [req.params.meter_no])
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// POST /api/automation — create new automation rule
router.post('/automation', authenticateToken, async (req, res) => {
  try {
    const { meter_no, rule_name, action } = req.body
    await pool.query(
      'INSERT INTO automation_rules (meter_no, rule_name, action, status) VALUES (?, ?, ?, ?)',
      [meter_no, rule_name, action, 'active']
    )
    res.status(201).json({ message: 'Automation rule created' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /api/automation/:rule_id/toggle — toggle automation rule
router.put('/automation/:rule_id/toggle', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM automation_rules WHERE rule_id=?', [req.params.rule_id])
    if (rows.length === 0) return res.status(404).json({ error: 'Rule not found' })
    const newStatus = rows[0].status === 'active' ? 'inactive' : 'active'
    await pool.query('UPDATE automation_rules SET status=? WHERE rule_id=?', [newStatus, req.params.rule_id])
    res.json({ message: 'Rule toggled', status: newStatus })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// GET /api/energy/:meter_no — get energy assets for a meter
router.get('/energy/:meter_no', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM energy_assets WHERE meter_no=?', [req.params.meter_no])
    res.json(rows)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PUT /api/customer/update/:meter_no — update customer profile
router.put('/customer/update/:meter_no', authenticateToken, async (req, res) => {
  try {
    const { name, address, city, state, email, phone } = req.body
    await pool.query(
      'UPDATE customer SET name=?, address=?, city=?, state=?, email=?, phone=? WHERE meter_no=?',
      [name, address, city, state, email, phone, req.params.meter_no]
    )
    res.json({ message: 'Profile updated' })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
