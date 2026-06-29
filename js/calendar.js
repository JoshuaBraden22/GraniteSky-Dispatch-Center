// GraniteSky Dispatch Center - Calendar Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("calendarTable")) return;

  requireLogin();
  renderCalendar();
});

function renderCalendar() {
  const table = document.getElementById("calendarTable");
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
    table.innerHTML = `<tr><td colspan="6">No scheduled loads yet.</td></tr>`;
    return;
  }

  table.innerHTML = events.map(event => {
    const load = event.load;

    const badgeClass =
      load.status === "Delivered" ? "delivered" :
      load.status === "In Transit" ? "transit" :
      "pickup";

    return `
      <tr>
        <td>${formatDate(event.date)}</td>
        <td>${event.type}</td>
        <td>${load.loadNumber}</td>
        <td>${load.pickup} → ${load.delivery}</td>
        <td>${load.driver || "Unassigned"}</td>
        <td><span class="badge ${badgeClass}">${load.status}</span></td>
      </tr>
    `;
  }).join("");
}
