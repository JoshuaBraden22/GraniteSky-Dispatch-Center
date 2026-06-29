// GraniteSky Dispatch Center - Carriers Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("carrierForm")) return;

  requireLogin();
  renderCarriers();

  const carrierForm = document.getElementById("carrierForm");

  carrierForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const carriers = getCarriers();

    const carrier = {
      name: document.getElementById("carrierName").value.trim(),
      mc: document.getElementById("carrierMC").value.trim(),
      dot: document.getElementById("carrierDOT").value.trim(),
      contact: document.getElementById("carrierContact").value.trim(),
      phone: document.getElementById("carrierPhone").value.trim(),
      email: document.getElementById("carrierEmail").value.trim(),
      insurance: document.getElementById("carrierInsurance").value,
      status: document.getElementById("carrierStatus").value,
      notes: document.getElementById("carrierNotes").value.trim()
    };

    carriers.unshift(carrier);
    saveCarriers(carriers);

    carrierForm.reset();
    renderCarriers();

    showNotification("Carrier saved successfully.");
  });
});

function renderCarriers() {
  const table = document.getElementById("carriersTable");
  if (!table) return;

  const carriers = getCarriers();

  if (carriers.length === 0) {
    table.innerHTML = `<tr><td colspan="9">No carriers added yet.</td></tr>`;
    return;
  }

  table.innerHTML = carriers.map((carrier, index) => `
    <tr>
      <td>${carrier.name}</td>
      <td>${carrier.mc || "-"}</td>
      <td>${carrier.dot || "-"}</td>
      <td>${carrier.contact || "-"}</td>
      <td>${carrier.phone || "-"}</td>
      <td>${carrier.email || "-"}</td>
      <td>${formatDate(carrier.insurance)}</td>
      <td>${carrier.status || "Active"}</td>
      <td>
        <button class="small-btn danger" onclick="deleteCarrier(${index})">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteCarrier(index) {
  if (!confirmDelete("carrier")) return;

  const carriers = getCarriers();
  carriers.splice(index, 1);

  saveCarriers(carriers);
  renderCarriers();

  showNotification("Carrier deleted.", "#dc2626");
}

function clearCarriers() {
  if (!confirm("Clear all carriers?")) return;

  localStorage.removeItem("gsCarriers");
  renderCarriers();

  showNotification("All carriers cleared.", "#dc2626");
}
