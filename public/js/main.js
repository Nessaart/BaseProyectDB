// Registro automático
const generateBtn = document.getElementById("generateBtn");
if (generateBtn) {
  generateBtn.addEventListener("click", async () => {
    const enclosureCount = parseInt(document.getElementById("enclosureCount").value);

    try {
      const res = await fetch("/api/firebase/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enclosureCount })
      });

      const text = await res.text();
      alert(text);
    } catch (err) {
      console.error(err);
      alert("Error al generar enclosures automáticamente.");
    }
  });
}

// Registro manual
const registerBtn = document.getElementById("RegisterButtonEnclosure");
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const zooId = "zooid";
    const enclosureId = document.getElementById("enclosureId").value.trim();
    const inhabit = document.getElementById("inhabit").value.trim();
    const name = document.getElementById("name").value.trim();
    const size = document.getElementById("size").value.trim();
    const weather = document.getElementById("weather").value.trim();

    if (!enclosureId || !inhabit || !name || !size || !weather) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const data = {
      zooId,
      enclosureId,
      inhabit,
      name,
      size: parseInt(size, 10),
      weather
    };

    try {
      const res = await fetch("/api/firebase/manual-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert("¡Enclosure registrado exitosamente!");
      } else {
        alert("Error al registrar: " + result.error);
      }
    } catch (error) {
      console.error("Error al registrar enclosure:", error);
      alert("Ocurrió un error al registrar el enclosure.");
    }
  });
}


