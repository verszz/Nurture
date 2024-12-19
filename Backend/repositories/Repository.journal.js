const { pool } = require("../config/db.config.js");
const bcrypt = require("bcrypt");

exports.addJournal = async function (req, res) {
  const { username, title, Content } = req.body;

  try {
    const CurrentDate = new Date();
    const formattedDate = CurrentDate.toLocaleDateString();
    // Check if a note with the same name already exists
    const NoteCheck = await pool.query(
      "SELECT * FROM journal_nurture WHERE journal_title = $1 AND journal_owner = $2",
      [title, username]
    );
    const UserCheck = await pool.query(
      "SELECT * FROM user_nurture Where username = $1",
      [username]
    );
    if (UserCheck.rowCount > 0) {
      if (NoteCheck.rowCount > 0) {
        return res.status(404).send("Note Already Exist, Change Name");
      } else {
        // Insert the new note into the database
        await pool.query(
        "INSERT INTO journal_nurture (journal_owner, journal_title, journal_content, journal_date) VALUES ($1, $2, $3, $4)",
        [username, title, Content, formattedDate]
        );
        res.status(201).send("Add Journal Berhasil!");
      }
    }
    else {
        return res.status(400).send("Username Doesn't Exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getAllJournal = async function (req, res) {
  const { username } = req.body;

  try {
    const AllJournal = await pool.query(
      "SELECT * FROM journal_nurture WHERE journal_owner = $1 ORDER BY journal_date DESC",
      [username.trim()]
    );
    if (AllJournal.rowCount === 0) {
      return res.status(404).send(`No journals found for user: ${username}`);
          }
    res.json(AllJournal.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.deleteJournal = async function (req, res) {
  const { id } = req.body; // Use journal ID from the request body
  try {
      const result = await pool.query("DELETE FROM journal_nurture WHERE id = $1", [id]);
      if (result.rowCount === 0) {
          return res.status(404).send("Journal not found.");
      }
      res.status(200).send("Journal deleted successfully.");
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
};

exports.getJournalSpecific = async function (req, res) {
  const { username, title } = req.body;

  try {
    // Retrieve the specific note for the specified user by id
    const SpecificJournal = await pool.query(
      "SELECT * FROM journal_nurture WHERE journal_owner = $1 AND journal_title = $2",
      [username, title]
    );
    if (SpecificJournal.rowCount === 0) {
        return res.status(404).send("No journals found for this user.");
      }
    res.json(SpecificJournal.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getJournalById = async function (req, res) {
  const { id } = req.body; // Extract ID from the request body

  try {
    // Check if the journal exists
    const result = await pool.query(
      "SELECT * FROM journal_nurture WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Journal entry not found.");
    }

    // Return the journal data
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving journal by ID:", error);
    return res.status(500).send("Internal Server Error.");
  }
};

exports.EditJournalSpecific = async function (req, res) { 
  const { username, title, Content, new_title } = req.body;

  // Ensure all required fields are provided
  if (!username || !title || !Content || !new_title) {
    return res.status(400).send("Missing required fields: username, title, Content, and new_title are required.");
  }

  try {
    // Check if the journal entry exists for the given username and title
    const NoteCheck = await pool.query(
      "SELECT * FROM journal_nurture WHERE journal_owner = $1 AND journal_title = $2",
      [username, title]
    );

    // If no journal entry is found, return an error
    if (NoteCheck.rowCount === 0) {
      return res.status(404).send("Journal entry not found.");
    }

    const Note_Id = NoteCheck.rows[0].id;

    // Update the journal entry with the new content
    await pool.query(
      "UPDATE journal_nurture SET journal_content = $1, journal_title = $2 WHERE journal_owner = $3 AND id = $4",
      [Content, new_title, username, Note_Id]
    );

    // Send success response
    res.status(200).send("Journal entry updated successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
