// GraniteSky Dispatch Center - Dashboard Module with Linked Load Data

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("dashboardRevenue")) return;

  requireLogin();
  showUserName();
  renderDashboard();
});

function renderDashboard() {
  const loads = getLoads();
  const drivers = getDrivers();
  const trucks = getTrucks();

  const totalRevenue = loads.reduce((sum, load) => {
    return sum + Number(load.rate || 0);
  }, 0);

  const delivered = loads.filter(load => load.status === "Delivered").length;

  setText("dashboardRevenue", formatMoney(totalRevenue));
  setText("dashboardLoads", loads.length);
  setText("dashboardDrivers", drivers.length);
  setText("dashboardDelivered", delivered);

  renderRecentLoads(loads);
  renderDriverOverview(drivers, trucks);
}

function renderRecentLoads(loads) {
  const table = document.getElementById("dashboardRecentLoads");
  if (!table) return;

  if (loads.length === 0) {
    table.innerHTML = `<tr><td colspan="6">No loads added yet.</td></tr>`;
    return;
  }

  table.innerHTML = loads.slice(0, 5).map(load => {
    const badgeClass = getStatusClass(load.status);

    const broker = getCompanies().find(company => company.id === load.brokerId);
    const carrier = getCarriers().find(carrier => carrier.id === load.carrierId);
    const driver = getDrivers().find(driver => driver.id === load.driverId);
    const truck = getTrucks().find(truck => truck.id === load.truckId);

    return `
      <tr>
        <td>${load.loadNumber}</td>
        <td>${broker ? broker.name : load.brokerName || "Unassigned"}</td>
        <td>${carrier ? carrier.name : load.carrierName || "Unassigned"}</td>
        <td>${driver ? driver.name : load.driverName || "Unassigned"} / Unit ${truck ? truck.unit : load.truckUnit || "Unassigned"}</td>
        <td>${formatMoney(load.rate)}</td>
        <td><span class="badge ${badgeClass}">${load.status}</span></td>
      </tr>
    `;
  }).join("");
}

function renderDriverOverview(drivers, trucks) {
  const table = document.getElementById("dashboardDriversTable");
  if (!table) return;

  if (drivers.length === 0) {
    table.innerHTML = `<tr><td colspan="3">No drivers added yet.</td></tr>`;
    return;
  }

  table.innerHTML = drivers.map(driver => {
    const truck = trucks.find(t => t.driverId === driver.id);

    return `
      <tr>
        <td>${driver.name}</td>
        <td>${truck ? "Unit " + truck.unit : "Unassigned"}</td>
        <td>${driver.status || "Available"}</td>
      </tr>
    `;
  }).join("");
}

function getStatusClass(status) {
  if (status === "Delivered") return "delivered";
  if (status === "In Transit") return "transit";
  return "pickup";
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}
