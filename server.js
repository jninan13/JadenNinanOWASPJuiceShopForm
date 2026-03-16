const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database("./users.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create users table + seed one demo user
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);

    db.run(`DELETE FROM users`);
    db.run(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        ["admin@juice.local", "admin1234"]
    );
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Server: Fields cannot be empty" });
    }

    if (!email.includes("@")) {
        return res.json({ success: false, message: "Server: Invalid email format" });
    }

    if (password.length < 8) {
        return res.json({ success: false, message: "Server: Password must be at least 8 characters" });
    }

    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

    console.log("Running vulnerable query:");
    console.log(query);

    db.get(query, (err, row) => {
        if (err) {
            console.error("SQL error:", err.message);
            return res.json({ success: false, message: "SQL error occurred" });
        }
        if (row) {
            return res.json({ success: true, message: "Login successful" });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});