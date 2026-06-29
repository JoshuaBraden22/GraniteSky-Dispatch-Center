// GraniteSky Dispatch Center - Drivers Module with IDs

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("driverForm")) return;

  requireLogin();
  renderDrivers();

  const driverForm = document.getElementById("driverForm");

  driverForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const drivers = getDrivers();

    const driver = {
      id: generateId("driver"),
      name: document.getElementById("driverName").value.trim(),
      phone: document.getElementById("driverPhone").value.trim(),
      email: document.getElementById("driverEmail").value.trim(),
      truck: document.getElementById("driverTruck").value.trim(),
      equipment: document.getElementById("driverEquipment").value.trim(),
      status: document.getElementById("driverStatus").value,
      notes: document.getElementById("driverNotes").value.trim()
    };

    drivers.unshift(driver);
    saveDrivers(drivers);

    driverForm.reset();
    renderDrivers();

    showNotification("Driver saved successfully.");
  });
});

function renderDrivers() {
  const table = document.getElementById("driversTable");
  if (!table) return;

  const drivers = getDrivers();

  if (drivers.length === 0) {
    table.innerHTML = `<tr><td colspan="7">No drivers added yet.</td></tr>`;
    return;
  }

  table.innerHTML = drivers.map((driver, index) => `
    <tr>
      <td>${driver.name}</td>
      <td>${driver.phone || "-"}</td>
      <td>${driver.email || "-"}</td>
      <td>${driver.truck || "-"}</td>
      <td>${driver.equipment || "-"}</td>
      <td>${driver.status || "Available"}</td>
      <td>
        <button class="small-btn danger" onclick="deleteDriver(${index})">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteDriver(index) {
  if (!confirmDelete("driver")) return;

  const drivers = getDrivers();
  drivers.splice(index, 1);

  saveDrivers(drivers);
  renderDrivers();

  showNotification("Driver deleted.", "#dc2626");
}

function clearDrivers() {
  if (!confirm("Clear all drivers?")) return;

  localStorage.removeItem("gsDrivers");
  renderDrivers();

  showNotification("All drivers cleared.", "#dc2626");
}
