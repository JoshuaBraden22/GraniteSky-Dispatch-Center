// GraniteSky Dispatch Center - Loads Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("loadForm")) return;

  requireLogin();
  populateDriverDropdown();
  renderLoads();

  const loadForm = document.getElementById("loadForm");

  loadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedDriver = document.getElementById("driver").value;
    const assignedTruck = getTrucks().find(t => t.driver === selectedDriver);

    const loads = getLoads();

    const load = {
      loadNumber: document.getElementById("loadNumber").value.trim(),
      driver: selectedDriver,
      truck: assignedTruck ? assignedTruck.unit : "Unassigned",
      pickup: document.getElementById("pickup").value.trim(),
      delivery: document.getElementById("delivery").value.trim(),
      pickupDate: document.getElementById("pickupDate").value,
      deliveryDate: document.getElementById("deliveryDate").value,
      rate: document.getElementById("rate").value,
      status: document.getElementById("status").value,
      notes: document.getElementById("notes").value.trim()
    };

    loads.unshift(load);
    saveLoads(loads);

    loadForm.reset();
    populateDriverDropdown();
    renderLoads();

    showNotification("Load saved successfully.");
  });
});

function populateDriverDropdown() {
  const dropdown = document.getElementById("driver");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Select Driver</option>`;

  getDrivers().forEach(driver => {
    const truck = getTrucks().find(t => t.driver === driver.name);
    const truckInfo = truck ? ` — Unit ${truck.unit}` : "";
    dropdown.innerHTML += `<option value="${driver.name}">${driver.name}${truckInfo}</option>`;
  });

  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

function renderLoads() {
  const table = document.getElementById("loadsTable");
  if (!table) return;

  const loads = getLoads();

  if (loads.length === 0) {
    table.innerHTML = `<tr><td colspan="9">No loads added yet.</td></tr>`;
    return;
  }

  table.innerHTML = loads.map((load, index) => {
    const badgeClass =
      load.status === "Delivered" ? "delivered" :
      load.status === "In Transit" ? "transit" :
      "pickup";

    return `
      <tr>
        <td>${load.loadNumber}</td>
        <td>${load.pickup} → ${load.delivery}</td>
        <td>${load.driver || "Unassigned"}</td>
        <td>${load.truck || "Unassigned"}</td>
        <td>${formatDate(load.pickupDate)}</td>
        <td>${formatDate(load.deliveryDate)}</td>
        <td>${formatMoney(load.rate)}</td>
        <td><span class="badge ${badgeClass}">${load.status}</span></td>
        <td>
          <div class="actions">
            <button class="small-btn" onclick="updateLoadStatus(${index})">Update</button>
            <button class="small-btn danger" onclick="deleteLoad(${index})">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateLoadStatus(index) {
  const loads = getLoads();

  if (loads[index].status === "Pickup Today") {
    loads[index].status = "In Transit";
  } else if (loads[index].status === "In Transit") {
    loads[index].status = "Delivered";
  } else {
    loads[index].status = "Pickup Today";
  }

  saveLoads(loads);
  renderLoads();
}

function deleteLoad(index) {
  if (!confirmDelete("load")) return;

  const loads = getLoads();
  loads.splice(index, 1);

  saveLoads(loads);
  renderLoads();

  showNotification("Load deleted.", "#dc2626");
}

function clearLoads() {
  if (!confirm("Clear all loads?")) return;

  localStorage.removeItem("gsLoads");
  renderLoads();

  showNotification("All loads cleared.", "#dc2626");
}
