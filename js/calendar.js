// GraniteSky Dispatch Center - Calendar Module with Linked Load Data

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("calendarTable")) return;

  requireLogin();
  renderCalendar();
});

function renderCalendar() {
  const table = document.getElementById("calendarTable");
  if (!table) return;

  const loads = getLoads();
  const events = [];

  loads.forEach(load => {
    if (load.pickupDate) {
      events.push({ date: load.pickupDate, type: "Pickup", load });
    }

    if (load.deliveryDate) {
      events.push({ date: load.deliveryDate, type: "Delivery", load });
    }
  });

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (events.length === 0) {
    table.innerHTML = `<tr><td colspan="8">No scheduled loads yet.</td></tr>`;
    return;
  }

  table.innerHTML = events.map(event => {
    const load = event.load;

    const broker = getCompanies().find(company => company.id === load.brokerId);
    const carrier = getCarriers().find(carrier => carrier.id === load.carrierId);
    const driver = getDrivers().find(driver => driver.id === load.driverId);

    const badgeClass =
      load.status === "Delivered" ? "delivered" :
      load.status === "In Transit" ? "transit" :
      "pickup";

    return `
      <tr>
        <td>${formatDate(event.date)}</td>
        <td>${event.type}</td>
        <td>${load.loadNumber}</td>
        <td>${broker ? broker.name : load.brokerName || "Unassigned"}</td>
        <td>${carrier ? carrier.name : load.carrierName || "Unassigned"}</td>
        <td>${load.pickup} → ${load.delivery}</td>
        <td>${driver ? driver.name : load.driverName || "Unassigned"}</td>
        <td><span class="badge ${badgeClass}">${load.status}</span></td>
      </tr>
    `;
  }).join("");
}
