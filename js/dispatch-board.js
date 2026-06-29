// GraniteSky Dispatch Center - Dispatch Board Module with View Load Links

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("pickupBoard")) return;

  requireLogin();
  renderDispatchBoard();
});

function renderDispatchBoard() {
  const loads = getLoads();

  const pickup = document.getElementById("pickupBoard");
  const transit = document.getElementById("transitBoard");
  const delivered = document.getElementById("deliveredBoard");

  if (!pickup || !transit || !delivered) return;

  pickup.innerHTML = renderBoardCards(loads.filter(load => load.status === "Pickup Today"), "No pickup loads.");
  transit.innerHTML = renderBoardCards(loads.filter(load => load.status === "In Transit"), "No loads in transit.");
  delivered.innerHTML = renderBoardCards(loads.filter(load => load.status === "Delivered"), "No delivered loads.");
}

function renderBoardCards(loads, emptyMessage) {
  if (loads.length === 0) {
    return `<p class="empty-board">${emptyMessage}</p>`;
  }

  return loads.map(load => {
    const broker = getCompanies().find(company => company.id === load.brokerId);
    const carrier = getCarriers().find(carrier => carrier.id === load.carrierId);
    const driver = getDrivers().find(driver => driver.id === load.driverId);
    const truck = getTrucks().find(truck => truck.id === load.truckId);

    return `
      <div class="dispatch-card">
        <strong>${load.loadNumber}</strong>

        <p>${load.pickup} → ${load.delivery}</p>

        <small>Broker: ${broker ? broker.name : load.brokerName || "Unassigned"}</small><br>
        <small>Carrier: ${carrier ? carrier.name : load.carrierName || "Unassigned"}</small><br>
        <small>Driver: ${driver ? driver.name : load.driverName || "Unassigned"}</small><br>
        <small>Truck: Unit ${truck ? truck.unit : load.truckUnit || "Unassigned"}</small><br>
        <small>Pickup: ${formatDate(load.pickupDate)}</small><br>
        <small>Delivery: ${formatDate(load.deliveryDate)}</small><br>
        <small>Rate: ${formatMoney(load.rate)}</small>

        <div class="actions" style="margin-top:12px;">
          <a class="small-btn" href="load-details.html?id=${load.id}">View</a>
          <button class="small-btn" onclick="advanceLoad('${load.id}')">Advance</button>
          <button class="small-btn danger" onclick="deleteBoardLoad('${load.id}')">Delete</button>
        </div>
      </div>
    `;
  }).join("");
}

function advanceLoad(loadId) {
  const loads = getLoads();
  const load = loads.find(item => item.id === loadId);

  if (!load) return;

  if (load.status === "Pickup Today") {
    load.status = "In Transit";
  } else if (load.status === "In Transit") {
    load.status = "Delivered";
  } else {
    load.status = "Delivered";
  }

  saveLoads(loads);
  renderDispatchBoard();

  showNotification("Load status updated.");
}

function deleteBoardLoad(loadId) {
  if (!confirmDelete("load")) return;

  const loads = getLoads().filter(load => load.id !== loadId);
  saveLoads(loads);

  renderDispatchBoard();

  showNotification("Load deleted.", "#dc2626");
}
