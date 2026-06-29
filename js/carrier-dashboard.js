// GraniteSky Dispatch Center - Carrier Dashboard Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("carrierLoadsTable")) return;

  const user = requireLogin();
  showUserName();

  renderCarrierDashboard(user);
  populateCarrierLoadDropdown(user);

  const form = document.getElementById("carrierDocumentForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const documents = getDocuments();
    const fileInput = document.getElementById("carrierDocumentFile");
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "No file selected";

    documents.unshift({
      id: generateId("document"),
      load: document.getElementById("carrierDocumentLoad").value,
      type: document.getElementById("carrierDocumentType").value,
      name: document.getElementById("carrierDocumentName").value.trim(),
      file: fileName,
      notes: document.getElementById("carrierDocumentNotes").value.trim(),
      submittedBy: user.name,
      submittedByEmail: user.email,
      submittedAt: new Date().toISOString()
    });

    saveDocuments(documents);

    form.reset();
    populateCarrierLoadDropdown(user);

    showNotification("Document submitted.");
  });
});

function getCarrierLoads(user) {
  const loads = getLoads();

  if (!user || !user.carrierId) return [];

  return loads.filter(load => load.carrierId === user.carrierId);
}

function renderCarrierDashboard(user) {
  const loads = getCarrierLoads(user);

  const totalRevenue = loads.reduce((sum, load) => sum + Number(load.rate || 0), 0);
  const inTransit = loads.filter(load => load.status === "In Transit").length;
  const delivered = loads.filter(load => load.status === "Delivered").length;

  setText("carrierTotalLoads", loads.length);
  setText("carrierTransitLoads", inTransit);
  setText("carrierDeliveredLoads", delivered);
  setText("carrierRevenue", formatMoney(totalRevenue));

  renderCarrierLoadsTable(loads);
}

function renderCarrierLoadsTable(loads) {
  const table = document.getElementById("carrierLoadsTable");
  if (!table) return;

  if (loads.length === 0) {
    table.innerHTML = `<tr><td colspan="7">No assigned loads.</td></tr>`;
    return;
  }

  table.innerHTML = loads.map(load => {
    const badgeClass =
      load.status === "Delivered" ? "delivered" :
      load.status === "In Transit" ? "transit" :
      "pickup";

    return `
      <tr>
        <td>${load.loadNumber}</td>
        <td>${load.pickup} → ${load.delivery}</td>
        <td>${formatDate(load.pickupDate)}</td>
        <td>${formatDate(load.deliveryDate)}</td>
        <td>${formatMoney(load.rate)}</td>
        <td><span class="badge ${badgeClass}">${load.status}</span></td>
        <td><a class="small-btn" href="load-details.html?id=${load.id}">View</a></td>
      </tr>
    `;
  }).join("");
}

function populateCarrierLoadDropdown(user) {
  const dropdown = document.getElementById("carrierDocumentLoad");
  if (!dropdown) return;

  const loads = getCarrierLoads(user);

  dropdown.innerHTML = `<option value="">Select Load</option>`;

  loads.forEach(load => {
    dropdown.innerHTML += `<option value="${load.loadNumber}">${load.loadNumber} — ${load.pickup} → ${load.delivery}</option>`;
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}
