const express = require("express");
const SqlService = require("../../services/sqlService");

const router = express.Router();

// ========== Post entry to table ==========
router.post('/post', async (req, res) => {
  const { param1, param2, paramN } = req.body;
  if (!param1 || !param2 || !paramN) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  const tableName = "test_table"
  try {
    await db.connectToDb();
    await db.query(
      `INSERT INTO ${tableName} (param1, param2, paramN) VALUES (?, ?, ?)`,
      [param1, param2, paramN]
    );
    res.status(200).send("Entry created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating entry.");
  } finally {
    await db.closeConnection();
  }
});

// ========== Get all entries of a table ==========
router.get('/get-all', async (req, res) => {
  const db = new SqlService();
  const tableName = "test_table"
  try {
    await db.connectToDb();
    const data = await db.query(`SELECT * FROM ${tableName}`);
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching data.");
  } finally {
    await db.closeConnection();
  }
});

// ========== Get one entry of a table ==========
router.get('/get-one/:id', async (req, res) => {
  const db = new SqlService();
  const tableName = "test_table"
  try {
    await db.connectToDb();
    const result = await db.query(
      `SELECT * FROM ${tableName} WHERE id = ?`,
      [req.params.id]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("Entry not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving info.");
  }
});

// ========== Post a new game ==========
router.post('/game', async (req, res) => {
  const { game_name, release_date, price, review_score } = req.body;
  if (!game_name || !release_date || !price || !review_score) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  try {
    await db.connectToDb();
    await db.query(
      `INSERT INTO game (game_name, release_date, price, review_score) VALUES (?, ?, ?, ?)`,
      [game_name, release_date, price, review_score]
    );
    res.status(200).send("Entry created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating entry.");
  } finally {
    await db.closeConnection();
  }
});

// ========== Get all games ==========
router.get('/get-all-games', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const data = await db.query(`SELECT * FROM game`);
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching data.");
  } finally {
    await db.closeConnection();
  }
});

// ========== Get one entry of a table ==========
router.get('/get-one-game/:id', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const result = await db.query(
      `SELECT * FROM game WHERE id_game = ?`,
      [req.params.id]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("Entry not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving info.");
  }
});

module.exports = router;