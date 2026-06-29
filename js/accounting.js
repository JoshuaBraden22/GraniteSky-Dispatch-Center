// ==========================================
// GraniteSky Dispatch Center
// Accounting Module
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("accountingRevenue")) return;

    requireLogin();
    renderAccounting();

});

// ==========================================

function renderAccounting() {

    const loads = getLoads();

    const deliveredLoads = loads.filter(load => load.status === "Delivered");

    const openLoads = loads.filter(load => load.status !== "Delivered");

    const totalRevenue = loads.reduce((sum, load) => {

        return sum + Number(load.rate || 0);

    }, 0);

    const averageRevenue = loads.length
        ? totalRevenue / loads.length
        : 0;

    setAccountingText(
        "accountingRevenue",
        formatMoney(totalRevenue)
    );

    setAccountingText(
        "accountingDelivered",
        deliveredLoads.length
    );

    setAccountingText(
        "accountingOpen",
        openLoads.length
    );

    setAccountingText(
        "accountingAverage",
        formatMoney(averageRevenue)
    );

    renderAccountingTable(loads);

}

// ==========================================

function renderAccountingTable(loads) {

    const table = document.getElementById("accountingTable");

    if (!table) return;

    if (loads.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="9">
                No accounting records available.
            </td>
        </tr>
        `;

        return;

    }

    table.innerHTML = loads.map(load => {

        const broker =
            getCompanies().find(c => c.id === load.brokerId);

        const carrier =
            getCarriers().find(c => c.id === load.carrierId);

        const driver =
            getDrivers().find(d => d.id === load.driverId);

        return `

        <tr>

            <td>${load.loadNumber}</td>

            <td>${broker ? broker.name : load.brokerName || "-"}</td>

            <td>${carrier ? carrier.name : load.carrierName || "-"}</td>

            <td>${driver ? driver.name : load.driverName || "-"}</td>

            <td>${load.pickup} → ${load.delivery}</td>

            <td>${formatMoney(load.rate)}</td>

            <td>${load.status}</td>

            <td>

                ${load.status === "Delivered"
                    ? "Ready to Invoice"
                    : "Open"}

            </td>

            <td>

                ${load.status === "Delivered"
                    ? "✔"
                    : "—"}

            </td>

        </tr>

        `;

    }).join("");

}

// ==========================================

function setAccountingText(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}
