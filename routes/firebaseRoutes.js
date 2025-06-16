const express = require("express");
const { getFirestore } = require("firebase-admin/firestore");
const firebaseApp = require("../firebase/firebase.js");
const router = express.Router();

const db = getFirestore(firebaseApp);

// GET all enclosures
router.get("/enclosures", async (req, res) => {
  try {
    const snapshot = await db.collection("Zoo").doc("zooid").collection("Enclosure").get();
    const enclosures = [];
    snapshot.forEach((doc) => {
      enclosures.push({ id: doc.id, ...doc.data() });
    });
    res.json(enclosures);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener los enclosures");
  }
});



/////////////////////////////

// GET enclosure by ID

router.get("/enclosures/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = db.collection("Zoo").doc("zooid").collection("Enclosure").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send("Enclosure no encontrado");
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener el enclosure");
  }
});


////////////////////////////////////////////////////////////////////
router.post("/manual-register", async (req, res) => {
  try {
    const { zooId, inhabit, name, size, weather } = req.body;

    if (!zooId || !inhabit || !name || !size || !weather) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    if (zooId.toLowerCase() === "zoo") {
      return res.status(400).json({
        error: "El ID del zoo no puede ser 'Zoo'. Usa el ID correcto, como 'zooid'.",
      });
    }

    // Obtener el número actual de enclosures
    const existingSnap = await db.collection(`Zoo/${zooId}/Enclosure`).get();
    const enclosureCounter = existingSnap.size + 1;

    // Crear el ID con el mismo formato del automático
    const enclosureId = `idEnclosure_${enclosureCounter}`;

    const enclosureData = {
      inhabit,
      name,
      size: parseInt(size, 10),
      weather
    };

    await db
      .collection("Zoo")
      .doc(zooId)
      .collection("Enclosure")
      .doc(enclosureId)
      .set(enclosureData);

    return res.status(200).json({ message: "Enclosure registrado con éxito.", enclosureId });
  } catch (error) {
    console.error("Error en manual-register:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
});




///////////////////////////////////////////////////////////////////
// POST: Generar enclosures con animales
router.post("/generate", async (req, res) => {
  const { enclosureCount } = req.body;
  const zooId = "zooid";

  const nameOptions = ["Desierto", "Pradera", "Templado", "Taiga", "Tundra"];
  const weatherOptions = [
    "tropical",
    "seco",
    "templado",
    "continental",
    "polar",
  ];
  const inhabitOptions = ["terrestrial", "acuatico"];

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  try {
    const existingSnap = await db.collection(`Zoo/${zooId}/Enclosure`).get();
    let enclosureCounter = existingSnap.size + 1;

    for (let i = 0; i < enclosureCount; i++) {
      const enclosureId = `idEnclosure_${enclosureCounter++}`;
      const enclosureData = {
        inhabit: randomItem(inhabitOptions),
        name: randomItem(nameOptions),
        size: Math.floor(Math.random() * (32 - 18 + 1)) + 18,
        weather: randomItem(weatherOptions),
      };

      await db.doc(`Zoo/${zooId}/Enclosure/${enclosureId}`).set(enclosureData);
    }

    res.status(200).send("Enclosures generados exitosamente.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar enclosures.");
  }
});

module.exports = router;
