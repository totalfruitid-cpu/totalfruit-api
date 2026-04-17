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

async function initDB() {
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
    console.log("Table ready ✅");
  } catch (err) {
    console.error("DB init error:", err);
  }
}

app.get('/', (req, res) => {
  res.send('Total Fruit API jalan 🚀');
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log('Server jalan di port ' + PORT);
  await initDB(); // ← jalan setelah server hidup
});
