const { default: mongoose } = require("mongoose");
const config = require("./config");


const dbURL = config.MONGO_URL;

// Connect to the database
mongoose.connect(dbURL)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });