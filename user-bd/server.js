
const dotenv = require('dotenv')
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/Db');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/Auth');

dotenv.config();
// Create Express App
const app = express();

// Connect to MongoDB
connectDB();

// CORS setup
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:5500'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use([cors(corsOptions), express.json()]);

app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Register route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json('All fields are required.');
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(409).json('User already registered.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json('User registered successfully.');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json('Server error. Please try again later.');
    }
});

// Start the server
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
