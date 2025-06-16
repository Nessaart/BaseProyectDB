document.getElementById("loadEnclosuresBtn").addEventListener("click", async () => {
  const container = document.getElementById("enclosuresContainer");

  try {
    container.innerHTML = "<p>Cargando datos...</p>";

    const res = await fetch("/api/sql/enclosuresGet");
    if (!res.ok) throw new Error("Error al obtener los enclosures");

    const enclosures = await res.json();

    if (enclosures.length === 0) {
      container.innerHTML = "<p>No hay enclosures registrados.</p>";
      return;
    }

    let html = `
      <table class="table-result">
        <thead>
          <tr>
            <th class="th-cell">ID</th>
            <th class="th-cell">Nombre</th>
            <th class="th-cell">Hábitat</th>
            <th class="th-cell">Tamaño (sqm)</th>
            <th class="th-cell">Clima</th>
          </tr>
        </thead>
        <tbody>`;

    enclosures.forEach((enc) => {
      html += `
        <tr>
          <td class="td-cell">${enc.idenclosures}</td>
          <td class="td-cell">${enc.name}</td>
          <td class="td-cell">${enc.habitat_typ}</td>
          <td class="td-cell">${enc.size_sqm}</td>
          <td class="td-cell">${enc.weather}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

  } catch (error) {
    container.innerHTML = `<p style="color: red;">${error.message}</p>`;
    console.error(error);
  }
});
