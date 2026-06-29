// ==========================================
// GraniteSky Dispatch Center
// Dispatch Board Module
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("pickupBoard")) return;

    requireLogin();
    renderDispatchBoard();

});

// ==========================================

function renderDispatchBoard() {

    const loads = getLoads();

    const pickup = document.getElementById("pickupBoard");
    const transit = document.getElementById("transitBoard");
    const delivered = document.getElementById("deliveredBoard");

    if (!pickup || !transit || !delivered) return;

    pickup.innerHTML = "";
    transit.innerHTML = "";
    delivered.innerHTML = "";

    loads.forEach((load, index) => {

        const card = createDispatchCard(load, index);

        switch (load.status) {

            case "Pickup Today":
                pickup.appendChild(card);
                break;

            case "In Transit":
                transit.appendChild(card);
                break;

            case "Delivered":
                delivered.appendChild(card);
                break;

            default:
                pickup.appendChild(card);

        }

    });

    if (!pickup.innerHTML)
        pickup.innerHTML = "<p>No pickup loads.</p>";

    if (!transit.innerHTML)
        transit.innerHTML = "<p>No loads in transit.</p>";

    if (!delivered.innerHTML)
        delivered.innerHTML = "<p>No delivered loads.</p>";

}

// ==========================================

function createDispatchCard(load, index) {

    const card = document.createElement("div");

    card.className = "dispatch-card";

    card.innerHTML = `

        <h3>${load.loadNumber}</h3>

        <p><strong>Driver:</strong> ${load.driver || "Unassigned"}</p>

        <p><strong>Truck:</strong> ${load.truck || "Unassigned"}</p>

        <p><strong>Lane:</strong><br>
        ${load.pickup} → ${load.delivery}</p>

        <p><strong>Pickup:</strong> ${formatDate(load.pickupDate)}</p>

        <p><strong>Delivery:</strong> ${formatDate(load.deliveryDate)}</p>

        <p><strong>Revenue:</strong> ${formatMoney(load.rate)}</p>

        <div class="actions">

            <button
            class="small-btn"
            onclick="advanceLoad(${index})">

            Advance

            </button>

            <button
            class="small-btn danger"
            onclick="deleteLoad(${index})">

            Delete

            </button>

        </div>

    `;

    return card;

}

// ==========================================

function advanceLoad(index) {

    const loads = getLoads();

    switch (loads[index].status) {

        case "Pickup Today":
            loads[index].status = "In Transit";
            break;

        case "In Transit":
            loads[index].status = "Delivered";
            break;

        default:
            loads[index].status = "Delivered";

    }

    saveLoads(loads);

    renderDispatchBoard();

    showNotification("Load updated.");

}
