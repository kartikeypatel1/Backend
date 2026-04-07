const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Connect to MongoDB using mongoose.  The connection options
 * `useNewUrlParser` and `useUnifiedTopology` were removed in
 * mongoose v7 – the defaults are already appropriate, so we
 * simply await the connection and handle errors with try/catch.
 */
async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        // exit the process so the caller can restart if necessary
        process.exit(1);
    }
}

module.exports = connectDB;

 