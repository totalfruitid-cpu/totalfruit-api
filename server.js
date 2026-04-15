const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const menu = [
  { id: 1, name: "Jus Alpukat", price: 15000, img: "https://i.imgur.com/8fKzXyL.png" },
  { id: 2, name: "Jus Mangga", price: 12000, img: "https://i.imgur.com/7dLwPqM.png" },
  { id: 3, name: "Salad Buah", price: 20000, img: "https://i.imgur.com/9eNrRtS.png" },
  { id: 4, name: "Es Buah", price: 10000, img: "https://i.imgur.com/5kMwVyN.png" }
];

app.get('/data', (req, res) => {
  res.json(menu);
});

app.get('/', (req, res) => {
  res.send('TotalFruit API nyala bro');
});

app.listen(3000, () => console.log('API jalan di port 3000'));
