// GraniteSky Dispatch Center - Users / Access Management Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("userForm")) return;

  requireLogin();
  populateUserCarrierDropdown();
  renderUsers();

  const userForm = document.getElementById("userForm");

  userForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const users = getUsers();

    const carrierId = getValue("userCarrier");
    const carrier = getCarriers().find(c => c.id === carrierId);

    const user = {
      id: generateId("user"),
      name: getValue("userName"),
      email: getValue("userEmail").toLowerCase(),
      password: getValue("userPassword"),
      role: getValue("userRole"),
      permission: getValue("userPermission"),
      carrierId: carrierId,
      carrierName: carrier ? carrier.name : "",
      status: getValue("userStatus"),
      forcePasswordChange: getValue("forcePasswordChange") === "Yes",
      createdAt: new Date().toISOString()
    };

    if (users.some(u => u.email === user.email)) {
      alert("An account with this email already exists.");
      return;
    }

    users.unshift(user);
    saveUsers(users);

    userForm.reset();
    populateUserCarrierDropdown();
    renderUsers();

    showNotification("User account created.");
  });
});

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}

function populateUserCarrierDropdown() {
  const dropdown = document.getElementById("userCarrier");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Assign Carrier / Owner Operator</option>`;

  getCarriers().forEach(carrier => {
    dropdown.innerHTML += `<option value="${carrier.id}">${carrier.name}</option>`;
  });
}

function renderUsers() {
  const table = document.getElementById("usersTable");
  if (!table) return;

  const users = getUsers();

  if (users.length === 0) {
    table.innerHTML = `<tr><td colspan="8">No user accounts created.</td></tr>`;
    return;
  }

  table.innerHTML = users.map((user, index) => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.permission || "-"}</td>
      <td>${user.carrierName || "-"}</td>
      <td>${user.status}</td>
      <td>${user.forcePasswordChange ? "Yes" : "No"}</td>
      <td>
        <button class="small-btn" onclick="toggleUserStatus(${index})">
          ${user.status === "Active" ? "Deactivate" : "Activate"}
        </button>
        <button class="small-btn danger" onclick="deleteUser(${index})">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function toggleUserStatus(index) {
  const users = getUsers();

  users[index].status = users[index].status === "Active" ? "Inactive" : "Active";

  saveUsers(users);
  renderUsers();

  showNotification("User status updated.");
}

function deleteUser(index) {
  if (!confirmDelete("user account")) return;

  const users = getUsers();
  users.splice(index, 1);

  saveUsers(users);
  renderUsers();

  showNotification("User deleted.", "#dc2626");
}
