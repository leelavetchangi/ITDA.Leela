const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const attendanceRoutes = require('./routes/attendanceRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const memberRoutes = require('./routes/memberRoutes');
const planRoutes = require('./routes/planRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigin = process.env.CLIENT_URL;

app.use(cors(allowedOrigin ? { origin: allowedOrigin } : undefined));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/checkin', attendanceRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/plans', planRoutes);
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use(errorHandler);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();