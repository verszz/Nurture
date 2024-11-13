const { pool } = require("../config/db.config.js");
const bcrypt = require("bcrypt");

exports.signup = async function (req, res) {
  const { username, password } = req.body;

  try {
    console.log("Received data:", { username, password });

    const userCheck = await pool.query(
      "SELECT * FROM user_nurture WHERE username = $1",
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).send("Username already exists");
    }

    const Hashed_Password = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO user_nurture (username, pw_hash, role_id) VALUES ($1, $2, $3)",
      [username, Hashed_Password, 0]
    );

    res.status(201).send("Sukses signup");
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async function (req, res) {
    const { username, password } = req.body;

    try {
        console.log("Received data:", { username, password });
        const result = await pool.query("SELECT * FROM user_nurture WHERE username = $1", [username]);

        if (result.rows.length === 0) {
            return res.status(404).send("Username tidak ditemukan");
        }

        const storedPassword = result.rows[0].pw_hash;
        const truefalse = await bcrypt.compare(password, storedPassword);

        if (!truefalse) {
            return res.status(401).send("Password salah");
        }
        console.log("Validity of Password :", {truefalse});
        res.status(200).send("Login berhasil");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
