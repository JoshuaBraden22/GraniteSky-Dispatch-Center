// GraniteSky Dispatch Center - Accounting Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("accountingRevenue")) return;

  requireLogin();
  renderAccounting();
});

function renderAccounting() {
  const loads = getLoads();

  const totalRevenue = loads.reduce((sum, load) => {
    return sum + Number(load.rate || 0);
  }, 0);

  const deliveredLoads = loads.filter(load => load.status === "Delivered");
  const openLoads = loads.filter(load => load.status !== "Delivered");

  setAccountingText("accountingRevenue", formatMoney(totalRevenue));
  setAccountingText("accountingDelivered", deliveredLoads.length);
  setAccountingText("accountingOpen", openLoads.length);
  setAccountingText("accountingAverage", formatMoney(loads.length ? totalRevenue / loads.length : 0));

  renderAccountingTable(loads);
}

function renderAccountingTable(loads) {
  const table = document.getElementById("accountingTable");
  if (!table) return;

  if (loads.length === 0) {
    table.innerHTML = `<tr><td colspan="6">No loads available for accounting.</td></tr>`;
    return;
  }

  table.innerHTML = loads.map(load => `
    <tr>
      <td>${load.loadNumber}</td>
      <td>${load.pickup} → ${load.delivery}</td>
      <td>${load.driver || "Unassigned"}</td>
      <td>${formatMoney(load.rate)}</td>
      <td>${load.status}</td>
      <td>${load.status === "Delivered" ? "Ready to Invoice" : "Open"}</td>
    </tr>
  `).join("");
}

function setAccountingText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}
