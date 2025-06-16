const getBtn = document.getElementById("getBtn");
if (getBtn) {
  getBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/firebase/enclosures");
      const enclosures = await res.json();

      const output = document.getElementById("output");
      output.innerHTML = ""; // Limpiar contenido anterior

      if (enclosures.length === 0) {
        output.innerHTML = "<p>No hay enclosures disponibles.</p>";
        return;
      }

      // Crear tabla
      const table = document.createElement("table");
      table.classList.add("table-result");

      // Encabezado
      const header = table.insertRow();
      ["ID", "Habitantes", "Nombre", "Tamaño", "Clima"].forEach((text) => {
        const th = document.createElement("th");
        th.textContent = text;
        th.classList.add("th-cell");
        header.appendChild(th);
      });

      // Filas con datos
      enclosures.forEach((enc) => {
        const row = table.insertRow();
        [enc.id, enc.inhabit, enc.name, enc.size, enc.weather].forEach((val) => {
          const td = row.insertCell();
          td.textContent = val || "N/A";
          td.classList.add("td-cell");
        });
      });

      output.appendChild(table);
    } catch (err) {
      console.error(err);
      alert("Error al obtener los enclosures.");
    }
  });
}

const getByIdBtn = document.getElementById("getByIdBtn");
if (getByIdBtn) {
  getByIdBtn.addEventListener("click", async () => {
    const id = document.getElementById("enclosureIdInput").value.trim();
    const outputById = document.getElementById("outputById");

    if (!id) {
      alert("Por favor ingresa una ID");
      return;
    }

    try {
      const res = await fetch(`/api/firebase/enclosures/${id}`);
      if (!res.ok) {
        outputById.innerHTML = `<p>No se encontró la enclosure con ID "${id}".</p>`;
        return;
      }

      const enclosure = await res.json();

      const resultHTML = `
        <div class="output-box">
          <h3 class="subtitle">Resultado:</h3>
          <ul>
            <li><strong>ID:</strong> ${enclosure.id}</li>
            <li><strong>Habitantes:</strong> ${enclosure.inhabit}</li>
            <li><strong>Nombre:</strong> ${enclosure.name}</li>
            <li><strong>Tamaño:</strong> ${enclosure.size}</li>
            <li><strong>Clima:</strong> ${enclosure.weather}</li>
          </ul>
        </div>
      `;

      outputById.innerHTML = resultHTML;
    } catch (err) {
      console.error(err);
      alert("Error al obtener la enclosure.");
    }
  });
}

const migrateBtn = document.getElementById("migrateBtn");
if (migrateBtn) {
  migrateBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/sql/enclosuresSet", {
        method: "POST",
      });

      const result = await response.json();
      console.log("Resultado de migración:", result);

      alert(result.message);
    } catch (err) {
      console.error("Error en la migración:", err);
      alert("Ocurrió un error durante la migración.");
    }
  });
};
