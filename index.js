const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const userRoute = require('./routes/userRoute');
const reservationRoute = require('./routes/reservationRoute');
const reviewRoute = require('./routes/reviewRoute');
const menuItemRoute = require('./routes/menuItemRoute');
const authMiddleware = require('./middleware/authorization');  

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("Welcome to Delicious Deck API");
});

app.get('/admin-dashboard', authMiddleware(['admin']), (req, res) => {
  res.json({ message:  `Welcome Admin, ${req.user.email}!` });
});

app.use('/users', userRoute);  
app.use('/reservations', reservationRoute);  
app.use('/reviews', reviewRoute);  
app.use('/menu', menuItemRoute);  
app.use('/uploads', express.static('uploads'));


// module.exports = app;   // test ko laagi rakheko
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);   
});






