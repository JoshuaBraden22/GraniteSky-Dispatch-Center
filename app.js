// GraniteSky Dispatch Center

const users = [
  {
    email: "admin@granitesky.com",
    password: "admin123",
    role: "admin",
    name: "Joshua Braden"
  },
  {
    email: "carrier@granitesky.com",
    password: "carrier123",
    role: "carrier",
    name: "Carrier User"
  }
];

// LOGIN

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

    if (user.role === "admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "carrier-dashboard.html";
    }
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

  if (target && user) {
    target.textContent = user.name;
  }
}

// STORAGE

function getLoads() {
  return JSON.parse(localStorage.getItem("gsLoads")) || [];
}

function saveLoads(loads) {
  localStorage.setItem("gsLoads", JSON.stringify(loads));
}

function getDrivers() {
  return JSON.parse(localStorage.getItem("gsDrivers")) || [];
}

function saveDrivers(drivers) {
  localStorage.setItem("gsDrivers", JSON.stringify(drivers));
}

// DRIVERS

const driverForm = document.getElementById("driverForm");

if (driverForm) {
  driverForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const drivers = getDrivers();

    const newDriver = {
      name: document.getElementById("driverName").value.trim(),
      phone: document.getElementById("driverPhone").value.trim(),
      email: document.getElementById("driverEmail").value.trim(),
      truck: document.getElementById("driverTruck").value.trim(),
      equipment: document.getElementById("driverEquipment").value.trim(),
      status: document.getElementById("driverStatus").value,
      notes: document.getElementById("driverNotes").value.trim()
    };

    drivers.unshift(newDriver);
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
    table.innerHTML = `
      <tr>
        <td colspan="7">No drivers have been added yet.</td>
      </tr>
    `;
    return;
  }

  table.innerHTML = drivers.map((driver, index) => {
    return `
      <tr>
        <td>${driver.name}</td>
        <td>${driver.phone || "-"}</td>
        <td>${driver.email || "-"}</td>
        <td>${driver.truck || "-"}</td>
        <td>${driver.equipment || "-"}</td>
        <td>${driver.status}</td>
        <td>
          <div class="actions">
            <button class="small-btn danger" onclick="deleteDriver(${index})">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function deleteDriver(index) {
  if (!confirm("Delete this driver?")) return;

  const drivers = getDrivers();
  drivers.splice(index, 1);
  saveDrivers(drivers);
  renderDrivers();
}

function clearDrivers() {
  if (!confirm("Clear all drivers?")) return;

  localStorage.removeItem("gsDrivers");
  renderDrivers();
}

// LOAD DRIVER DROPDOWN

function populateDriverDropdown() {
  const dropdown = document.getElementById("driver");
  if (!dropdown) return;

  const drivers = getDrivers();

  dropdown.innerHTML = `<option value="">Select Driver</option>`;

  if (drivers.length === 0) {
    dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
    return;
  }

  drivers.forEach(driver => {
    dropdown.innerHTML += `<option value="${driver.name}">${driver.name}</option>`;
  });

  dropdown.innerHTML += `<option value="Unassigned">Unassigned</option>`;
}

// LOAD FORM

const loadForm = document.getElementById("loadForm");

if (loadForm) {
  populateDriverDropdown();

  loadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const loads = getLoads();

    const newLoad = {
      loadNumber: document.getElementById("loadNumber").value.trim(),
      driver: document.getElementById("driver").value,
      pickup: document.getElementById("pickup").value.trim(),
      delivery: document.getElementById("delivery").value.trim(),
      pickupDate: document.getElementById("pickupDate").value,
      deliveryDate: document.getElementById("deliveryDate").value,
      rate: document.getElementById("rate").value,
      status: document.getElementById("status").value,
      notes: document.getElementById("notes").value.trim()
    };

    loads.unshift(newLoad);
    saveLoads(loads);

    loadForm.reset();
    populateDriverDropdown();
    renderLoads();
  });
}

// LOAD TABLE

function renderLoads() {
  populateDriverDropdown();

  const table = document.getElementById("loadsTable");
  if (!table) return;

  const loads = getLoads();

  if (loads.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="8">No loads have been added yet.</td>
      </tr>
    `;
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
}

function deleteLoad(index) {
  if (!confirm("Delete this load?")) return;

  const loads = getLoads();
  loads.splice(index, 1);
  saveLoads(loads);

  renderLoads();
  renderDashboard();
}

function clearLoads() {
  if (!confirm("Clear all loads?")) return;

  localStorage.removeItem("gsLoads");
  renderLoads();
  renderDashboard();
}

// DASHBOARD

function renderDashboard() {
  const loads = getLoads();

  const revenue = loads.reduce((total, load) => {
    return total + Number(load.rate || 0);
  }, 0);

  const inTransit = loads.filter(load => load.status === "In Transit").length;
  const delivered = loads.filter(load => load.status === "Delivered").length;

  const revenueBox = document.getElementById("dashboardRevenue");
  const loadsBox = document.getElementById("dashboardLoads");
  const transitBox = document.getElementById("dashboardTransit");
  const deliveredBox = document.getElementById("dashboardDelivered");
  const recentTable = document.getElementById("dashboardRecentLoads");

  if (revenueBox) revenueBox.textContent = "$" + revenue.toLocaleString();
  if (loadsBox) loadsBox.textContent = loads.length;
  if (transitBox) transitBox.textContent = inTransit;
  if (deliveredBox) deliveredBox.textContent = delivered;

  if (!recentTable) return;

  if (loads.length === 0) {
    recentTable.innerHTML = `
      <tr>
        <td colspan="5">No loads have been added yet.</td>
      </tr>
    `;
    return;
  }

  recentTable.innerHTML = loads.slice(0, 5).map(load => {
    const badgeClass =
      load.status === "Delivered" ? "delivered" :
      load.status === "In Transit" ? "transit" :
      "pickup";

    return `
      <tr>
        <td>${load.loadNumber}</td>
        <td>${load.pickup} → ${load.delivery}</td>
        <td>${load.driver || "Unassigned"}</td>
        <td>$${Number(load.rate || 0).toLocaleString()}</td>
        <td><span class="badge ${badgeClass}">${load.status}</span></td>
      </tr>
    `;
  }).join("");
}
