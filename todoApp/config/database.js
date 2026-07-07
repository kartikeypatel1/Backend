const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connect to MongoDB using mongoose.  The connection options
 * `useNewUrlParser` and `useUnifiedTopology` were removed in
 * mongoose v7 – the defaults are already appropriate, so we
 * simply await the connection and handle errors with try/catch.
 */
const dbConnect=() => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with an error code
    });
}
module.exports = dbConnect;
