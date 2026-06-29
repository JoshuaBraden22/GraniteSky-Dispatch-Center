// GraniteSky Dispatch Center v1.0

const users = [
  { email: "admin@granitesky.com", password: "admin123", role: "admin", name: "Joshua Braden" },
  { email: "carrier@granitesky.com", password: "carrier123", role: "carrier", name: "Carrier User" }
];

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    localStorage.setItem("gsUser", JSON.stringify(user));
    window.location.href = user.role === "admin" ? "dashboard.html" : "carrier-dashboard.html";
  });
}

function requireLogin() {
  const user = JSON.parse(localStorage.getItem("gsUser"));
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

function logout() {
  localStorage.removeItem("gsUser");
  window.location.href = "login.html";
}

function showUserName() {
  const user = JSON.parse(localStorage.getItem("gsUser"));
  const target = document.getElementById("loggedUser");
  if (target && user) target.textContent = user.name;
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLoads() { return getData("gsLoads"); }
function saveLoads(data) { saveData("gsLoads", data); }

function getDrivers() { return getData("gsDrivers"); }
function saveDrivers(data) { saveData("gsDrivers", data); }

function getTrucks() { return getData("gsTrucks"); }
function saveTrucks(data) { saveData("gsTrucks", data); }

function getCompanies() { return getData("gsCompanies"); }
function saveCompanies(data) { saveData("gsCompanies", data); }

function getCarriers() { return getData("gsCarriers"); }
function saveCarriers(data) { saveData("gsCarriers", data); }

function getDocuments() { return getData("gsDocuments"); }
function saveDocuments(data) { saveData("gsDocuments", data); }

// DRIVERS

const driverForm = document.getElementById("driverForm");

if (driverForm) {
  driverForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const drivers = getDrivers();

    drivers.unshift({
      name: document.getElementById("driverName").value.trim(),
      phone: document.getElementById("driverPhone").value.trim(),
      email: document.getElementById("driverEmail").value.trim(),
      truck: document.getElementById("driverTruck").value.trim(),
      equipment: document.getElementById("driverEquipment").value.trim(),
      status: document.getElementById("driverStatus").value,
      notes: document.getElementById("driverNotes").value.trim()
    });

    saveDrivers(drivers);
    driverForm.reset();
    renderDrivers();
  });
}

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
      <td>${driver.status}</td>
      <td><button class="small-btn danger" onclick="deleteDriver(${index})">Delete</button></td>
    </tr>
  `).join("");
}

function deleteDriver(index) {
  if (!confirm("Delete this driver?")) return;
  const drivers = getDrivers();
  drivers.splice(index, 1);
  saveDrivers(drivers);
  renderDrivers();
  renderDashboard();
}

function clearDrivers() {
  if (!confirm("Clear all drivers?")) return;
  localStorage.removeItem("gsDrivers");
  renderDrivers();
  renderDashboard();
}

// TRUCKS

function populateTruckDriverDropdown() {
  const dropdown = document.getElementById("truckDriver");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Assign Driver</option>`;
  getDrivers().forEach(driver => {
    dropdown.innerHTML += `<option value="${driver.name}">${driver.name}</option>`;
  });
  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

const truckForm = document.getElementById("truckForm");

if (truckForm) {
  populateTruckDriverDropdown();

  truckForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const trucks = getTrucks();

    trucks.unshift({
      unit: document.getElementById("truckUnit").value.trim(),
      vin: document.getElementById("truckVin").value.trim(),
      year: document.getElementById("truckYear").value.trim(),
      make: document.getElementById("truckMake").value.trim(),
      model: document.getElementById("truckModel").value.trim(),
      plate: document.getElementById("truckPlate").value.trim(),
      state: document.getElementById("truckState").value.trim(),
      trailer: document.getElementById("trailerNumber").value.trim(),
      equipment: document.getElementById("truckEquipment").value.trim(),
      driver: document.getElementById("truckDriver").value,
      status: document.getElementById("truckStatus").value,
      notes: document.getElementById("truckNotes").value.trim()
    });

    saveTrucks(trucks);
    truckForm.reset();
    populateTruckDriverDropdown();
    renderTrucks();
    renderDashboard();
  });
}

function renderTrucks() {
  populateTruckDriverDropdown();

  const table = document.getElementById("trucksTable");
  if (!table) return;

  const trucks = getTrucks();

  if (trucks.length === 0) {
    table.innerHTML = `<tr><td colspan="8">No trucks have been added yet.</td></tr>`;
    return;
  }

  table.innerHTML = trucks.map((truck, index) => `
    <tr>
      <td>${truck.unit}</td>
      <td>${truck.year || ""} ${truck.make || ""} ${truck.model || ""}</td>
      <td>${truck.plate || "-"} ${truck.state ? "(" + truck.state + ")" : ""}</td>
      <td>${truck.trailer || "-"}</td>
      <td>${truck.equipment || "-"}</td>
      <td>${truck.driver || "Unassigned"}</td>
      <td>${truck.status}</td>
      <td><button class="small-btn danger" onclick="deleteTruck(${index})">Delete</button></td>
    </tr>
  `).join("");
}

function deleteTruck(index) {
  if (!confirm("Delete this truck?")) return;
  const trucks = getTrucks();
  trucks.splice(index, 1);
  saveTrucks(trucks);
  renderTrucks();
  renderDashboard();
}

function clearTrucks() {
  if (!confirm("Clear all trucks?")) return;
  localStorage.removeItem("gsTrucks");
  renderTrucks();
  renderDashboard();
}

// COMPANIES

const companyForm = document.getElementById("companyForm");

if (companyForm) {
  companyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const companies = getCompanies();

    companies.unshift({
      name: document.getElementById("companyName").value.trim(),
      type: document.getElementById("companyType").value,
      mc: document.getElementById("companyMC").value.trim(),
      dot: document.getElementById("companyDOT").value.trim(),
      contact: document.getElementById("companyContact").value.trim(),
      phone: document.getElementById("companyPhone").value.trim(),
      email: document.getElementById("companyEmail").value.trim(),
      terms: document.getElementById("companyTerms").value.trim(),
      notes: document.getElementById("companyNotes").value.trim()
    });

    saveCompanies(companies);
    companyForm.reset();
    renderCompanies();
  });
}

function renderCompanies() {
  const table = document.getElementById("companiesTable");
  if (!table) return;

  const companies = getCompanies();

  if (companies.length === 0) {
    table.innerHTML = `<tr><td colspan="9">No companies have been added yet.</td></tr>`;
    return;
  }

  table.innerHTML = companies.map((company, index) => `
    <tr>
      <td>${company.name}</td>
      <td>${company.type}</td>
      <td>${company.mc || "-"}</td>
      <td>${company.dot || "-"}</td>
      <td>${company.contact || "-"}</td>
      <td>${company.phone || "-"}</td>
      <td>${company.email || "-"}</td>
      <td>${company.terms || "-"}</td>
      <td><button class="small-btn danger" onclick="deleteCompany(${index})">Delete</button></td>
    </tr>
  `).join("");
}

function deleteCompany(index) {
  if (!confirm("Delete this company?")) return;
  const companies = getCompanies();
  companies.splice(index, 1);
  saveCompanies(companies);
  renderCompanies();
}

function clearCompanies() {
  if (!confirm("Clear all companies?")) return;
  localStorage.removeItem("gsCompanies");
  renderCompanies();
}

// CARRIERS

const carrierForm = document.getElementById("carrierForm");

if (carrierForm) {
  carrierForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const carriers = getCarriers();

    carriers.unshift({
      name: document.getElementById("carrierName").value.trim(),
      mc: document.getElementById("carrierMC").value.trim(),
      dot: document.getElementById("carrierDOT").value.trim(),
      contact: document.getElementById("carrierContact").value.trim(),
      phone: document.getElementById("carrierPhone").value.trim(),
      email: document.getElementById("carrierEmail").value.trim(),
      insurance: document.getElementById("carrierInsurance").value,
      status: document.getElementById("carrierStatus").value,
      notes: document.getElementById("carrierNotes").value.trim()
    });

    saveCarriers(carriers);
    carrierForm.reset();
    renderCarriers();
  });
}

function renderCarriers() {
  const table = document.getElementById("carriersTable");
  if (!table) return;

  const carriers = getCarriers();

  if (carriers.length === 0) {
    table.innerHTML = `<tr><td colspan="9">No carriers have been added yet.</td></tr>`;
    return;
  }

  table.innerHTML = carriers.map((carrier, index) => `
    <tr>
      <td>${carrier.name}</td>
      <td>${carrier.mc || "-"}</td>
      <td>${carrier.dot || "-"}</td>
      <td>${carrier.contact || "-"}</td>
      <td>${carrier.phone || "-"}</td>
      <td>${carrier.email || "-"}</td>
      <td>${carrier.insurance || "-"}</td>
      <td>${carrier.status}</td>
      <td><button class="small-btn danger" onclick="deleteCarrier(${index})">Delete</button></td>
    </tr>
  `).join("");
}

function deleteCarrier(index) {
  if (!confirm("Delete this carrier?")) return;
  const carriers = getCarriers();
  carriers.splice(index, 1);
  saveCarriers(carriers);
  renderCarriers();
}

function clearCarriers() {
  if (!confirm("Clear all carriers?")) return;
  localStorage.removeItem("gsCarriers");
  renderCarriers();
}

// LOADS

function populateDriverDropdown() {
  const dropdown = document.getElementById("driver");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Select Driver</option>`;

  getDrivers().forEach(driver => {
    const truck = getTrucks().find(t => t.driver === driver.name);
    const truckInfo = truck ? ` — Unit ${truck.unit}` : "";
    dropdown.innerHTML += `<option value="${driver.name}">${driver.name}${truckInfo}</option>`;
  });

  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

const loadForm = document.getElementById("loadForm");

if (loadForm) {
  populateDriverDropdown();

  loadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selectedDriver = document.getElementById("driver").value;
    const assignedTruck = getTrucks().find(t => t.driver === selectedDriver);
    const loads = getLoads();

    loads.unshift({
      loadNumber: document.getElementById("loadNumber").value.trim(),
      driver: selectedDriver,
      truck: assignedTruck ? assignedTruck.unit : "Unassigned",
      pickup: document.getElementById("pickup").value.trim(),
      delivery: document.getElementById("delivery").value.trim(),
      pickupDate: document.getElementById("pickupDate").value,
      deliveryDate: document.getElementById("deliveryDate").value,
      rate: document.getElementById("rate").value,
      status: document.getElementById("status").value,
      notes: document.getElementById("notes").value.trim()
    });

    saveLoads(loads);
    loadForm.reset();
    populateDriverDropdown();
    renderLoads();
    renderDashboard();
  });
}

function renderLoads() {
  populateDriverDropdown();

  const table = document.getElementById("loadsTable");
  if (!table) return;

  const loads = getLoads();

  if (loads.length === 0) {
    table.innerHTML = `<tr><td colspan="9">No loads added yet.</td></tr>`;
    return;
  }

  table.innerHTML = loads.map((load, index) => {
    const badgeClass =
      load.status === "Delivered" ? "delivered" :
      load.status === "In Transit" ? "transit" :
      "pickup";

    return `
      <tr>
        <td>${load.loadNumber}</td>
        <td>${load.pickup} → ${load.delivery}</td>
        <td>${load.driver || "Unassigned"}</td>
        <td>${load.truck || "Unassigned"}</td>
        <td>${load.pickupDate || "-"}</td>
        <td>${load.deliveryDate || "-"}</td>
        <td>$${Number(load.rate || 0).toLocaleString()}</td>
        <td><span class="badge ${badgeClass}">${load.status}</span></td>
        <td>
          <div class="actions">
            <button class="small-btn" onclick="updateLoadStatus(${index})">Update</button>
            <button class="small-btn danger" onclick="deleteLoad(${index})">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function updateLoadStatus(index) {
  const loads = getLoads();

  if (loads[index].status === "Pickup Today") {
    loads[index].status = "In Transit";
  } else if (loads[index].status === "In Transit") {
    loads[index].status = "Delivered";
  } else {
    loads[index].status = "Pickup Today";
  }

  saveLoads(loads);
  renderLoads();
  renderDashboard();
  renderDispatchBoard();
}

function deleteLoad(index) {
  if (!confirm("Delete this load?")) return;
  const loads = getLoads();
  loads.splice(index, 1);
  saveLoads(loads);
  renderLoads();
  renderDashboard();
  renderDispatchBoard();
}

function clearLoads() {
  if (!confirm("Clear all loads?")) return;
  localStorage.removeItem("gsLoads");
  renderLoads();
  renderDashboard();
  renderDispatchBoard();
}

// DOCUMENTS

function populateDocumentLoadDropdown() {
  const dropdown = document.getElementById("documentLoad");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Attach to Load</option>`;

  getLoads().forEach(load => {
    dropdown.innerHTML += `<option value="${load.loadNumber}">${load.loadNumber} — ${load.pickup} → ${load.delivery}</option>`;
  });
}

const documentForm = document.getElementById("documentForm");

if (documentForm) {
  populateDocumentLoadDropdown();

  documentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const documents = getDocuments();
    const fileInput = document.getElementById("documentFile");
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "No file selected";

    documents.unshift({
      load: document.getElementById("documentLoad").value || "Unassigned",
      type: document.getElementById("documentType").value,
      name: document.getElementById("documentName").value.trim(),
      file: fileName,
      notes: document.getElementById("documentNotes").value.trim()
    });

    saveDocuments(documents);
    documentForm.reset();
    populateDocumentLoadDropdown();
    renderDocuments();
  });
}

function renderDocuments() {
  populateDocumentLoadDropdown();

  const table = document.getElementById("documentsTable");
  if (!table) return;

  const documents = getDocuments();

  if (documents.length === 0) {
    table.innerHTML = `<tr><td colspan="6">No documents have been added yet.</td></tr>`;
    return;
  }

  table.innerHTML = documents.map((doc, index) => `
    <tr>
      <td>${doc.load}</td>
      <td>${doc.type}</td>
      <td>${doc.name}</td>
      <td>${doc.file}</td>
      <td>${doc.notes || "-"}</td>
      <td><button class="small-btn danger" onclick="deleteDocument(${index})">Delete</button></td>
    </tr>
  `).join("");
}

function deleteDocument(index) {
  if (!confirm("Delete this document record?")) return;
  const documents = getDocuments();
  documents.splice(index, 1);
  saveDocuments(documents);
  renderDocuments();
}

function clearDocuments() {
  if (!confirm("Clear all document records?")) return;
  localStorage.removeItem("gsDocuments");
  renderDocuments();
}

// DISPATCH BOARD

function renderDispatchBoard() {
  const loads = getLoads();

  const pickupBoard = document.getElementById("pickupBoard");
  const transitBoard = document.getElementById("transitBoard");
  const deliveredBoard = document.getElementById("deliveredBoard");

  if (!pickupBoard || !transitBoard || !deliveredBoard) return;

  pickupBoard.innerHTML = renderBoardCards(loads.filter(load => load.status === "Pickup Today"), "No pickup loads.");
  transitBoard.innerHTML = renderBoardCards(loads.filter(load => load.status === "In Transit"), "No loads in transit.");
  deliveredBoard.innerHTML = renderBoardCards(loads.filter(load => load.status === "Delivered"), "No delivered loads.");
}

function renderBoardCards(loads, emptyMessage) {
  if (loads.length === 0) {
    return `<p class="empty-board">${emptyMessage}</p>`;
  }

  return loads.map(load => `
    <div class="dispatch-card">
      <strong>${load.loadNumber}</strong>
      <p>${load.pickup} → ${load.delivery}</p>
      <small>Driver: ${load.driver || "Unassigned"}</small><br>
      <small>Truck: Unit ${load.truck || "Unassigned"}</small><br>
      <small>Rate: $${Number(load.rate || 0).toLocaleString()}</small>
    </div>
  `).join("");
}

// DASHBOARD

function renderDashboard() {
  const loads = getLoads();
  const drivers = getDrivers();
  const trucks = getTrucks();

  const revenue = loads.reduce((total, load) => total + Number(load.rate || 0), 0);
  const delivered = loads.filter(load => load.status === "Delivered").length;

  const revenueBox = document.getElementById("dashboardRevenue");
  const loadsBox = document.getElementById("dashboardLoads");
  const driversBox = document.getElementById("dashboardDrivers");
  const deliveredBox = document.getElementById("dashboardDelivered");
  const recentTable = document.getElementById("dashboardRecentLoads");
  const driversTable = document.getElementById("dashboardDriversTable");

  if (revenueBox) revenueBox.textContent = "$" + revenue.toLocaleString();
  if (loadsBox) loadsBox.textContent = loads.length;
  if (driversBox) driversBox.textContent = drivers.length;
  if (deliveredBox) deliveredBox.textContent = delivered;

  if (recentTable) {
    if (loads.length === 0) {
      recentTable.innerHTML = `<tr><td colspan="5">No loads added yet.</td></tr>`;
    } else {
      recentTable.innerHTML = loads.slice(0, 5).map(load => {
        const badgeClass =
          load.status === "Delivered" ? "delivered" :
          load.status === "In Transit" ? "transit" :
          "pickup";

        return `
          <tr>
            <td>${load.loadNumber}</td>
            <td>${load.pickup} → ${load.delivery}</td>
            <td>${load.driver || "Unassigned"} / Unit ${load.truck || "Unassigned"}</td>
            <td>$${Number(load.rate || 0).toLocaleString()}</td>
            <td><span class="badge ${badgeClass}">${load.status}</span></td>
          </tr>
        `;
      }).join("");
    }
  }

  if (driversTable) {
    if (drivers.length === 0) {
      driversTable.innerHTML = `<tr><td colspan="3">No drivers added yet.</td></tr>`;
    } else {
      driversTable.innerHTML = drivers.map(driver => {
        const truck = trucks.find(t => t.driver === driver.name);

        return `
          <tr>
            <td>${driver.name}</td>
            <td>${truck ? "Unit " + truck.unit : "Unassigned"}</td>
            <td>${driver.status}</td>
          </tr>
        `;
      }).join("");
    }
  }
}
