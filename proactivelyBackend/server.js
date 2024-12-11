const express = require('express');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const app = express();
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = 8083;
const path = require('path');


// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// middleware
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/home', require('./routes/api/speakerListings'));


//verify the rest of the routes with JWT middleware
app.use(verifyJWT);
app.use('/authCheck', require('./routes/authCheck'));
app.use('/bookings', require('./routes/api/bookings'));
app.use('/employees', require('./routes/api/employees'));
app.use('/userdetails', require('./routes/api/userDetails'));
app.use('/speakerprofile', require('./routes/api/speakerProfile'));

// custom error handling 
app.use(errorHandler);

// start listening
app.listen(PORT, () => {
    console.log('Server running on http://localhost:${PORT}');
})