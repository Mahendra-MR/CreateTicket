const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 📦 Import Routes
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

// 🚦 Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// 🔐 Validate Environment Variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Environment variables MONGO_URI or JWT_SECRET are missing.");
  process.exit(1);
}

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// 🧯 Optional: Handle Uncaught Errors
process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err.message);
  process.exit(1);
});
