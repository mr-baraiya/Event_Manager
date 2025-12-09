const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser')
const Login = require('./Routes/Login');
const SignUp = require('./Routes/Signup');
const Event = require('./Routes/Event')
const cors = require('cors');

require('dotenv').config();

const app = express();

// Configure CORS to allow requests from the frontend
const corsOptions = {
  origin: "http://localhost:5173", // Vite's default port
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));

const PORT = process.env.MONGO_PORT || 7120; // Fallback to 7120 if not set

app.use(express.urlencoded({ extended: true }));
app.use(BodyParser.json());

const connectionString = "mongodb+srv://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASSWORD+"@deven.bppkn.mongodb.net/Event_Management_System";

mongoose.connect(connectionString).then(()=>{
    console.log("Connected to MongoDB Database SuccessFully");
    
    app.use('/login',Login);
    app.use('/user',SignUp);
    app.use('/event',Event)
    
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
})