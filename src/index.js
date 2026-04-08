require('dotenv').config();
const express = require('express');
const connectDB = require('./api/core/db');

const app = express();

// Jalankan koneksi database
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});