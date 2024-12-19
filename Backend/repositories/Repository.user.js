const { pool } = require("../config/db.config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "TES!@#$"; 

// Signup Controller
exports.signup = async function (req, res) {
    const { username, password } = req.body;

    try {
        const userCheck = await pool.query(
            "SELECT * FROM user_nurture WHERE username = $1",
            [username]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).send("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO user_nurture (username, pw_hash, role_id) VALUES ($1, $2, $3)",
            [username, hashedPassword, 0]
        );

        res.status(201).send("Sukses signup");
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Login Controller
exports.login = async function (req, res) {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM user_nurture WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Username tidak ditemukan");
        }

        const storedPassword = result.rows[0].pw_hash;
        const passwordValid = await bcrypt.compare(password, storedPassword);

        if (!passwordValid) {
            return res.status(401).send("Password salah");
        }

        // Generate JWT
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login berhasil",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Middleware untuk autentikasi token
exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).send("Token tidak ditemukan");

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send("Token tidak valid");
        req.user = user;
        next();
    });
};

// Logout (Opsional)
exports.logout = (req, res) => {
    res.status(200).send("Logout berhasil");
};
