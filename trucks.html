// GraniteSky Dispatch Center - Trucks Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("truckForm")) return;

  requireLogin();
  populateTruckDriverDropdown();
  renderTrucks();

  const truckForm = document.getElementById("truckForm");

  truckForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const trucks = getTrucks();

    const truck = {
      unit: document.getElementById("truckUnit").value.trim(),
      vin: document.getElementById("truckVin").value.trim(),
      year: document.getElementById("truckYear").value.trim(),
      make: document.getElementById("truckMake").value.trim(),
      model: document.getElementById("truckModel").value.trim(),
      plate: document.getElementById("truckPlate").value.trim(),
      state: document.getElementById("truckState").value.trim(),
      trailer: document.getElementById("trailerNumber").value.trim(),
      equipment: document.getElementById("truckEquipment").value.trim(),
      driver: document.getElementById("truckDriver").value,
      status: document.getElementById("truckStatus").value,
      notes: document.getElementById("truckNotes").value.trim()
    };

    trucks.unshift(truck);
    saveTrucks(trucks);

    truckForm.reset();
    populateTruckDriverDropdown();
    renderTrucks();

    showNotification("Truck saved successfully.");
  });
});

function populateTruckDriverDropdown() {
  const dropdown = document.getElementById("truckDriver");
  if (!dropdown) return;

  const drivers = getDrivers();

  dropdown.innerHTML = `<option value="">Assign Driver</option>`;

  drivers.forEach(driver => {
    dropdown.innerHTML += `<option value="${driver.name}">${driver.name}</option>`;
  });

  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

function renderTrucks() {
  const table = document.getElementById("trucksTable");
  if (!table) return;

  const trucks = getTrucks();

  if (trucks.length === 0) {
    table.innerHTML = `<tr><td colspan="8">No trucks added yet.</td></tr>`;
    return;
  }

  table.innerHTML = trucks.map((truck, index) => `
    <tr>
      <td>${truck.unit}</td>
      <td>${truck.year || ""} ${truck.make || ""} ${truck.model || ""}</td>
      <td>${truck.plate || "-"} ${truck.state ? "(" + truck.state + ")" : ""}</td>
      <td>${truck.trailer || "-"}</td>
      <td>${truck.equipment || "-"}</td>
      <td>${truck.driver || "Unassigned"}</td>
      <td>${truck.status || "Available"}</td>
      <td>
        <button class="small-btn danger" onclick="deleteTruck(${index})">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteTruck(index) {
  if (!confirmDelete("truck")) return;

  const trucks = getTrucks();
  trucks.splice(index, 1);

  saveTrucks(trucks);
  renderTrucks();

  showNotification("Truck deleted.", "#dc2626");
}

function clearTrucks() {
  if (!confirm("Clear all trucks?")) return;

  localStorage.removeItem("gsTrucks");
  renderTrucks();

  showNotification("All trucks cleared.", "#dc2626");
}
