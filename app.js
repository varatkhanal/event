// app.js
const express = require('express');
const dotenv = require("dotenv").config();
const userRoutes = require('./routes/UserRoutes');
const eventsRoutes = require('./routes/EventsRoutes');
const authRoutes = require('./routes/AuthRoutes');
const bookingRoutes = require('./routes/BookingRoutes');
const rolesRoutes = require('./routes/RoleRoutes');
const passport = require('passport');
 const session = require('express-session');
 const path = require('path');
 const flash = require('connect-flash');
 const initializeDatabase = require('./config/db');
//const { User } = require('./models');

require("./auth");
require('./config/passport'); // Initialize Passport


//const jwtSecretKey = crypto.randomBytes(64).toString('hex'); 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname,'views')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
   secret: 'mysecretKey',
  resave: false,
   saveUninitialized: false,
   cookie:{secure:false}
  }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//send goto page
app.get('/',(req,res)=>{
  //const filePath = path.join(--d, 'views', 'index.html');
  res.sendFile('index.html')}
  );

// Routes
app.use('/users', userRoutes);
app.use('/roles', rolesRoutes);
app.use('/auth',authRoutes)
app.use('/events',eventsRoutes);
app.use('/booking',bookingRoutes);

// app.post('/events/book',(req,res)=>{
//   eventsController.bookEvent;
//   console.log("here");
//   //res.status(201).json({ message: 'Event created successfully'});
// });


//sqlite database 
const db = initializeDatabase();

// MongoDB connection
//mongoose.connect('mongodb://localhost:27017/eventing', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);});
