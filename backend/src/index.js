const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/enrollments', require('./routes/enrollment.routes'));
app.use('/api/accommodations', require('./routes/accommodation.routes'));
app.use('/api/absences', require('./routes/absence.routes'));
app.use('/api/requests', require('./routes/requests.routes'));
app.use('/api/faculties', require('./routes/faculties.routes'));

const PORT = process.env.PORT || 5000;

// Database sync and server start
sequelize.sync().then(() => {
  console.log('Database connected successfully.');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});