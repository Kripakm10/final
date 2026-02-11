const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URL || process.env.mongodb_url;
if (!mongoUrl) {
    console.error('MONGODB_URL is not set in environment');
    process.exit(1);
}

mongoose
    .connect(mongoUrl)
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => {
        console.error('DB connection error:', err);
        process.exit(1);
    });