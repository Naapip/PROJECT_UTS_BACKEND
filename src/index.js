require('dotenv').config();
const initializeApp = require('./core/app'); // Memanggil app.js di folder core
const PORT = process.env.PORT || 5000;

initializeApp().then((app) => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Architecture Layering Structure Activated!`);
  });
}).catch(err => {
  console.error('Gagal menjalankan server:', err);
});