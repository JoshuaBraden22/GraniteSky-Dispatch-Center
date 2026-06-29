// GraniteSky Dispatch Center - Accounting Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("accountingRevenue")) return;

  requireLogin();
  renderAccounting();
});

function renderAccounting() {
  const loads = getLoads();

  const totalRevenue = loads.reduce((sum, load) => sum + Number(load.rate || 0), 0);
  const totalCarrierPay = loads.reduce((sum, load) => sum + Number(load.carrierPay || 0), 0);
  const totalDriverPay = loads.reduce((sum, load) => sum + Number(load.driverPay || 0), 0);
  const totalDispatchFee = loads.reduce((sum, load) => sum + getDispatchFee(load), 0);
  const totalProfit = totalRevenue - totalCarrierPay - totalDriverPay - totalDispatchFee;

  setAccountingText("accountingRevenue", formatMoney(totalRevenue));
  setAccountingText("accountingCarrierPay", formatMoney(totalCarrierPay));
  setAccountingText("accountingDriverPay", formatMoney(totalDriverPay));
  setAccountingText("accountingDispatchFee", formatMoney(totalDispatchFee));
  setAccountingText("accountingProfit", formatMoney(totalProfit));
  setAccountingText("accountingDelivered", loads.filter(load => load.status === "Delivered").length);
  setAccountingText("accountingOpen", loads.filter(load => load.status !== "Delivered").length);
  setAccountingText("accountingAverage", formatMoney(loads.length ? totalRevenue / loads.length : 0));

  renderAccountingTable(loads);
}

function getDispatchFee(load) {
  return Number(load.rate || 0) * 0.08;
}

function renderAccountingTable(loads) {
  const table = document.getElementById("accountingTable");
  if (!table) return;

  if (loads.length === 0) {
    table.innerHTML = `<tr><td colspan="10">No accounting records available.</td></tr>`;
    return;
  }

  table.innerHTML = loads.map((load, index) => {
    const dispatchFee = getDispatchFee(load);
    const profit =
      Number(load.rate || 0) -
      Number(load.carrierPay || 0) -
      Number(load.driverPay || 0) -
      dispatchFee;

    return `
      <tr>
        <td>${load.loadNumber}</td>
        <td>${load.brokerName || "-"}</td>
        <td>${load.carrierName || "-"}</td>
        <td>${load.driverName || "-"}</td>
        <td>${formatMoney(load.rate)}</td>
        <td><input type="number" value="${load.carrierPay || ""}" onchange="updateAccountingField(${index}, 'carrierPay', this.value)"></td>
        <td><input type="number" value="${load.driverPay || ""}" onchange="updateAccountingField(${index}, 'driverPay', this.value)"></td>
        <td>${formatMoney(dispatchFee)}</td>
        <td>${formatMoney(profit)}</td>
        <td>
          <select onchange="updateAccountingField(${index}, 'invoiceStatus', this.value)">
            <option ${load.invoiceStatus === "Open" ? "selected" : ""}>Open</option>
            <option ${load.invoiceStatus === "Ready to Invoice" ? "selected" : ""}>Ready to Invoice</option>
            <option ${load.invoiceStatus === "Invoiced" ? "selected" : ""}>Invoiced</option>
            <option ${load.invoiceStatus === "Paid" ? "selected" : ""}>Paid</option>
          </select>
        </td>
      </tr>
    `;
  }).join("");
}

function updateAccountingField(index, field, value) {
  const loads = getLoads();
  loads[index][field] = value;
  saveLoads(loads);
  renderAccounting();
}

function setAccountingText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}
