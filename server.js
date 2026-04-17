require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ROOT (biar gak "Cannot GET /")
app.get('/', (req, res) => {
  res.send('TotalFruit API Jalan 🚀');
});

// Ambil semua orders
app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Tambah order
app.post('/orders', async (req, res) => {
  try {
    const { name, phone, address, menu } = req.body;

    await pool.query(
      'INSERT INTO orders (name, phone, address, menu) VALUES ($1,$2,$3,$4)',
      [name, phone, address, menu]
    );

    res.send('Order masuk ✅');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server + buat tabel kalau belum ada
async function startServer() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        name TEXT,
        phone TEXT,
        address TEXT,
        menu TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    app.listen(8000, () => {
      console.log('Server jalan di port 8000');
    });

  } catch (err) {
    console.error(err);
  }
}

startServer();
