const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const sanitizeHtml = require('sanitize-html');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret:'9f23a8d57c2d4fa109b4ecab1f85d7d3a02e1d9865d3cc1aa9a3b681cde59b02'
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Database setup
const db = new sqlite3.Database('doatoons.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            registration_number TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            access_level INTEGER NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Users table created or already exists.');
                // Insert a sample admin user (you'll do this manually)
                const sampleUser = {
                    email: 'admin1@doatoons.com',
                    password: 'AdminPassword123!', // Will be hashed
                    registration_number: 'DOA001',
                    full_name: 'Admin One',
                    access_level: 2 // Super admin
                };
                bcrypt.hash(sampleUser.password, 10, (err, hash) => {
                    if (err) {
                        console.error('Error hashing password:', err.message);
                        return;
                    }
                    db.run(`INSERT OR IGNORE INTO users (email, password, registration_number, full_name, access_level) VALUES (?, ?, ?, ?, ?)`,
                        [sampleUser.email, hash, sampleUser.registration_number, sampleUser.full_name, sampleUser.access_level],
                        (err) => {
                            if (err) {
                                console.error('Error inserting sample user:', err.message);
                            } else {
                                console.log('Sample admin user inserted or already exists.');
                            }
                        }
                    );
                });
            }
        });
    }
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password, registration_number } = req.body;

    // Input validation and sanitization
    if (!email || !password || !registration_number) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const sanitizedEmail = sanitizeHtml(email.trim());
    const sanitizedRegNumber = sanitizeHtml(registration_number.trim());

    // Check if email ends with @doatoons.com
    if (!sanitizedEmail.endsWith('@doatoons.com')) {
        return res.status(400).json({ success: false, message: 'Email must be a @doatoons.com address.' });
    }

    // Query the database with parameterized query to prevent SQL injection
    db.get(`SELECT * FROM users WHERE email = ? AND registration_number = ?`,
        [sanitizedEmail, sanitizedRegNumber],
        (err, user) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ success: false, message: 'Server error.' });
            }

            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or registration number.' });
            }

            // Verify password
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) {
                    console.error('Error comparing passwords:', err.message);
                    return res.status(500).json({ success: false, message: 'Server error.' });
                }

                if (!match) {
                    return res.status(401).json({ success: false, message: 'Invalid password.' });
                }

                // Successful login
                req.session.user = {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    access_level: user.access_level
                };
                res.json({ success: true, access_level: user.access_level });
            });
        }
    );
});

// Check session endpoint
app.get('/api/session', (req, res) => {
    if (req.session.user) {
        res.json({
            success: true,
            user: {
                email: req.session.user.email,
                full_name: req.session.user.full_name,
                access_level: req.session.user.access_level
            }
        });
    } else {
        res.json({ success: false });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err.message);
            return res.status(500).json({ success: false, message: 'Server error.' });
        }
        res.json({ success: true });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
