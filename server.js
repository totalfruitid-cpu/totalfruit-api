const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json());

// TEST ROUTE (cek server hidup)
app.get('/', (req, res) => {
  res.send('Server jalan bro!');
});

// ROUTE TERIMA ORDER
app.post('/orders', (req, res) => {
  console.log('Order masuk:', req.body);
  res.send('Order diterima bro!');
});

app.listen(PORT, () => {
  console.log(`Server running di http://localhost:${PORT}`);
});