const express = require("express");
const { getFirestore } = require("firebase-admin/firestore");
const firebaseApp = require("../firebase/firebase.js");
const SqlService = require("../sql/connection.js");

const router = express.Router();
const dbFirestore = getFirestore(firebaseApp);

// MIGRATE: Firebase → MySQL
router.post("/enclosuresSet", async (req, res) => {
  const sql = new SqlService();
  try {
    await sql.connectToDb();

    const snapshot = await dbFirestore
      .collection("Zoo")
      .doc("zooid")
      .collection("Enclosure")
      .get();

    const enclosures = [];
    snapshot.forEach((doc) => {
      enclosures.push({ id: doc.id, ...doc.data() });
    });

    console.log("Datos obtenidos de Firebase:", enclosures);

    let inserted = 0;

    for (const enc of enclosures) {
      try {
        // Validaciones mínimas
        const enclosureId = enc.id?.slice(0, 30) || "";
        const name = enc.name || "";
        const habitat_typ = enc.inhabit || "unknown"; // evita null
        const size_sqm = Number(enc.size) || 0;
        const weather = enc.weather || "unknown";

        if (!habitat_typ) continue; // omitir si falta obligatorio

        await sql.query(
          "INSERT INTO enclosures (idenclosures, name, habitat_typ, size_sqm, weather) VALUES (?, ?, ?, ?, ?)",
          [enclosureId, name, habitat_typ, size_sqm, weather]
        );
        inserted++;
      } catch (err) {
        console.warn(`Error al insertar enclosure ${enc.id}:`, err.message);
      }
    }

    res.status(200).json({
      message: `${inserted} enclosures migrados exitosamente a SQL.`,
    });
  } catch (err) {
    console.error("Error en migración:", err);
    res.status(500).send("Error general al migrar enclosures.");
  } finally {
    await sql.closeConnection();
  }
});


router.get('/enclosuresGet', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const enclosures = await db.query("SELECT * FROM enclosures");
    res.status(200).json(enclosures);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching enclosures.");
  } finally {
    await db.closeConnection();
  }
});


module.exports = router;