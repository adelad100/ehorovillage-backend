// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts'); // Import the posts routes

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', userRoutes); // Prefix all user routes with /api/user
app.use('/api/auth', authRoutes); // Prefix all auth routes with /api/auth
app.use('/api/posts', postRoutes); // Prefix all posts routes with /api/posts

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
