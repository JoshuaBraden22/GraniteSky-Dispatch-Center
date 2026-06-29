// GraniteSky Dispatch Center - Load Details Module

document.addEventListener("DOMContentLoaded", () => {
  requireLogin();
  renderLoadDetails();
});

function renderLoadDetails() {
  const params = new URLSearchParams(window.location.search);
  const loadId = params.get("id");

  const loads = getLoads();
  const load = loads.find(item => item.id === loadId);

  if (!load) {
    document.getElementById("detailLoadTitle").textContent = "Load Not Found";
    document.getElementById("loadDetailsTable").innerHTML = `
      <tr>
        <td>No load was found for this record.</td>
      </tr>
    `;
    return;
  }

  const broker = getCompanies().find(company => company.id === load.brokerId);
  const carrier = getCarriers().find(carrier => carrier.id === load.carrierId);
  const driver = getDrivers().find(driver => driver.id === load.driverId);
  const truck = getTrucks().find(truck => truck.id === load.truckId);

  const rate = Number(load.rate || 0);
  const miles = Number(load.miles || 0);
  const rpm = miles > 0 ? rate / miles : 0;

  document.getElementById("detailLoadTitle").textContent = `Load ${load.loadNumber}`;
  document.getElementById("detailStatus").textContent = load.status || "-";
  document.getElementById("detailRevenue").textContent = formatMoney(rate);
  document.getElementById("detailMiles").textContent = miles.toLocaleString();
  document.getElementById("detailRPM").textContent = formatMoney(rpm);

  document.getElementById("loadDetailsTable").innerHTML = `
    <tr>
      <th>Load Number</th>
      <td>${load.loadNumber}</td>
    </tr>
    <tr>
      <th>Broker / Customer</th>
      <td>${broker ? broker.name : load.brokerName || "Unassigned"}</td>
    </tr>
    <tr>
      <th>Carrier</th>
      <td>${carrier ? carrier.name : load.carrierName || "Unassigned"}</td>
    </tr>
    <tr>
      <th>Driver</th>
      <td>${driver ? driver.name : load.driverName || "Unassigned"}</td>
    </tr>
    <tr>
      <th>Truck</th>
      <td>${truck ? "Unit " + truck.unit : load.truckUnit || "Unassigned"}</td>
    </tr>
    <tr>
      <th>Lane</th>
      <td>${load.pickup} → ${load.delivery}</td>
    </tr>
    <tr>
      <th>Pickup Date</th>
      <td>${formatDate(load.pickupDate)}</td>
    </tr>
    <tr>
      <th>Delivery Date</th>
      <td>${formatDate(load.deliveryDate)}</td>
    </tr>
    <tr>
      <th>Commodity</th>
      <td>${load.commodity || "-"}</td>
    </tr>
    <tr>
      <th>Weight</th>
      <td>${load.weight || "-"}</td>
    </tr>
    <tr>
      <th>Miles</th>
      <td>${miles.toLocaleString()}</td>
    </tr>
    <tr>
      <th>Revenue</th>
      <td>${formatMoney(rate)}</td>
    </tr>
    <tr>
      <th>Notes</th>
      <td>${load.notes || "-"}</td>
    </tr>
  `;
}
