const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Pastikan tabel ada
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

    console.log('DB connected & table ready');

    // Test root
    app.get('/', (req, res) => {
      res.send('Total Fruit API jalan 🚀');
    });

    // Insert order
    app.post('/order', async (req, res) => {
      try {
        const { name, phone, address, menu } = req.body;

        await pool.query(
          'INSERT INTO orders (name, phone, address, menu) VALUES ($1,$2,$3,$4)',
          [name, phone, address, menu]
        );

        res.send('Order masuk!');
      } catch (err) {
        console.error(err);
        res.status(500).send('Gagal simpan order');
      }
    });

    // Ambil semua order (ADMIN)
    app.get('/orders', async (req, res) => {
      try {
        const result = await pool.query(
          'SELECT * FROM orders ORDER BY created_at DESC'
        );
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error ambil orders');
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log('Server jalan di port ' + PORT));

  } catch (err) {
    console.error('DB init error:', err);
    process.exit(1);
  }
}

startServer();