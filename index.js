const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');
const reservationRoute = require('./routes/reservationRoute');
const reviewRoute = require('./routes/reviewRoute');
const orderRoute = require('./routes/orderRoute');
const deliveryRoute = require('./routes/deliveryRoute');
const menuItemRoute = require('./routes/menuItemRoute');
const orderMenuItemRoute = require('./routes/orderMenuItemRoute');
const productRoute = require('./routes/productRoute')

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

// Use routes
app.use('/products', productRoute);
app.use('/users', userRoute);  // Authentication routes
app.use('/reservations', reservationRoute);  // Reservation routes
app.use('/reviews', reviewRoute);  // Review routes
app.use('/orders', orderRoute);  // Order routes
app.use('/deliveries', deliveryRoute);  // Delivery routes
app.use('/menu', menuItemRoute);  // Menu Item routes
app.use('/order-menu-items', orderMenuItemRoute);  // Order Menu Item routes
app.use('/uploads', express.static('uploads'));


// Sequelize synchronization with database
sequelize.sync({ force: false })
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




