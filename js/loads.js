// GraniteSky Dispatch Center - Upgraded Loads Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("loadForm")) return;

  requireLogin();

  populateCompanyDropdown();
  populateCarrierDropdown();
  populateDriverDropdown();
  populateTruckDropdown();
  renderLoads();

  const loadForm = document.getElementById("loadForm");

  loadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const loads = getLoads();

    const selectedDriver = getValue("driver");
    const selectedTruck = getValue("truck");

    const load = {
      loadNumber: getValue("loadNumber"),
      broker: getValue("broker"),
      carrier: getValue("carrier"),
      driver: selectedDriver,
      truck: selectedTruck,
      pickup: getValue("pickup"),
      delivery: getValue("delivery"),
      pickupDate: getValue("pickupDate"),
      deliveryDate: getValue("deliveryDate"),
      commodity: getValue("commodity"),
      weight: getValue("weight"),
      miles: getValue("miles"),
      rate: getValue("rate"),
      status: getValue("status"),
      notes: getValue("notes")
    };

    loads.unshift(load);
    saveLoads(loads);

    loadForm.reset();

    populateCompanyDropdown();
    populateCarrierDropdown();
    populateDriverDropdown();
    populateTruckDropdown();
    renderLoads();

    showNotification("Load saved successfully.");
  });
});

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function populateCompanyDropdown() {
  const dropdown = document.getElementById("broker");
  if (!dropdown) return;

  const companies = getCompanies();

  dropdown.innerHTML = `<option value="">Select Broker / Customer</option>`;

  companies.forEach(company => {
    dropdown.innerHTML += `<option value="${company.name}">${company.name} (${company.type})</option>`;
  });

  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

function populateCarrierDropdown() {
  const dropdown = document.getElementById("carrier");
  if (!dropdown) return;

  const carriers = getCarriers();

  dropdown.innerHTML = `<option value="">Select Carrier</option>`;

  carriers.forEach(carrier => {
    dropdown.innerHTML += `<option value="${carrier.name}">${carrier.name}</option>`;
  });

  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

function populateDriverDropdown() {
  const dropdown = document.getElementById("driver");
  if (!dropdown) return;

  const drivers = getDrivers();

  dropdown.innerHTML = `<option value="">Select Driver</option>`;

  drivers.forEach(driver => {
    dropdown.innerHTML += `<option value="${driver.name}">${driver.name}</option>`;
  });

  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

function populateTruckDropdown() {
  const dropdown = document.getElementById("truck");
  if (!dropdown) return;

  const trucks = getTrucks();

  dropdown.innerHTML = `<option value="">Select Truck</option>`;

  trucks.forEach(truck => {
    dropdown.innerHTML += `<option value="${truck.unit}">Unit ${truck.unit} - ${truck.make || ""} ${truck.model || ""}</option>`;
  });

  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

function renderLoads() {
  const table = document.getElementById("loadsTable");
  if (!table) return;

  const loads = getLoads();

  if (loads.length === 0) {
    table.innerHTML = `<tr><td colspan="11">No loads added yet.</td></tr>`;
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
        <td>${load.broker || "Unassigned"}</td>
        <td>${load.carrier || "Unassigned"}</td>
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

  showNotification("Load status updated.");
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
