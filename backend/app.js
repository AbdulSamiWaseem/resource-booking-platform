const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Resource management backend is running',
  });
});

module.exports = app;
