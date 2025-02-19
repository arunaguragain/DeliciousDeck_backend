const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');
const reservationRoute = require('./routes/reservationRoute');
const reviewRoute = require('./routes/reviewRoute');
const menuItemRoute = require('./routes/menuItemRoute');
const productRoute = require('./routes/productRoute');
const authMiddleware = require('./middleware/authorization');  // ✅ Import middleware


// Creating a Server
const app = express();

// Creating a port
const PORT = process.env.PORT || 5001;

// Creating middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test Route to check server
app.get('/', (req, res) => {
  res.send("Welcome to Delicious Deck API");
});

app.get('/admin-dashboard', authMiddleware(['admin']), (req, res) => {
  res.json({ message:  `Welcome Admin, ${req.user.email}!` });
});


// Use routes
app.use('/products', productRoute);
app.use('/users', userRoute);  // Authentication routes
app.use('/reservations', reservationRoute);  // Reservation routes
app.use('/reviews', reviewRoute);  // Review routes


app.use('/menu', menuItemRoute);  // Menu Item routes
 // Order Menu Item routes
app.use('/uploads', express.static('uploads'));


// Sequelize synchronization with database
sequelize.sync({ alter : true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.log('Error syncing database: ', err);
  });

// Running the server on PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// sequelize.sync({ alter: true });




