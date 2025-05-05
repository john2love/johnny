// 1. Import the express library
const express = require('express');
const cors = require('cors');


// 2. Create an express app
const app = express();
//defined cors accessibility
const corsOption = {
    origin: 'http://localhost:3000',

    methods: ['GET', 'POST'],
    Credentials: true
}
// 3. Use express.json() middleware to parse JSON body
app.use([
    cors(corsOption),
    express.json()
]);
app.use(express.json());

// 4. Create a placeholder array to store registered users
const users = [];

// 5. Handle POST request to /register route
app.post('/register', (req, res) => {
    // 6. Extract data sent in the body
    const { username, email, password } = req.body;

    // 7. Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json('All fields are required.');
    }
    const userExists = users.find((user) => {user.email === email || user.username === username});

    if (userExists) {
        return res.status(409).json('User already registered.');
    }

    // 8. Store the user data (simulate saving to database)
    users.push({ username, email, password });
    console.log('All Users so far',users);


    // 9. Send back a success response
    res.status(201).json('User registered successfully.');
});

// 10. Start the server on port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
