const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Koneksi PostgreSQL dari Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ Test koneksi DB saat start
pool.connect()
  .then(() => console.log("DB siap 🚀"))
  .catch(err => console.error("DB init error:", err));

// ✅ Buat tabel kalau belum ada
pool.query(`
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  name TEXT,
  phone TEXT,
  address TEXT,
  menu TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

// ✅ Route test
app.get('/', (req, res) => {
  res.send('Total Fruit API jalan 🚀');
});

// ✅ Route order masuk
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
    res.status(500).send('DB error');
  }
});

// ✅ Port dari Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server jalan di port ' + PORT));
