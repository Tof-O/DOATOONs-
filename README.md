#DOATOONs
A web application for managing user profiles and admin access for DOATOONs.
Project Structure
DOATOONs-/
├── profile/
│   ├── admin/
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── assets/
│   │   │       └── Logos/
│   │   │           └── Official.png
│   │   ├── server.js
│   │   ├── package.json
│   │   └── doatoons.db  (Excluded from Git)
│   ├── index.html
│   └── scripts.js
├── .gitignore
└── README.md

Setup
Prerequisites

Node.js (v14 or higher)
Git

Installation

Clone the repository:
git clone https://github.com/your-username/DOATOONs-.git
cd DOATOONs-


Set up the admin backend:
cd profile/admin
npm install


Start the admin backend server:
npm start


Access the admin page at http://localhost:3000.


Admin Credentials

Email: admin1@doatoons.com
Password: AdminPassword123!
Registration Number: DOA001

To add more admin users, modify server.js to insert new users into the SQLite database, or use a SQLite client to manage the doatoons.db file.
Deployment
For production deployment:

Deploy the backend on a server (e.g., a VPS).
Enable HTTPS and set cookie.secure to true in server.js.
Replace the session.secret with a secure value.

Consider adding rate limiting and CSRF protection.

Security Notes

Passwords are hashed using bcrypt.
SQL injection is prevented using parameterized queries.
Inputs are sanitized using sanitize-html.

