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

    const carrierId = document.getElementById("userCarrier").value;
    const carrier = getCarriers().find(c => c.id === carrierId);

    const user = {
      id: generateId("user"),
      name: document.getElementById("userName").value.trim(),
      email: document.getElementById("userEmail").value.trim().toLowerCase(),
      password: document.getElementById("userPassword").value,
      role: document.getElementById("userRole").value,
      carrierId: carrierId,
      carrierName: carrier ? carrier.name : "",
      status: document.getElementById("userStatus").value
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

function populateUserCarrierDropdown() {
  const dropdown = document.getElementById("userCarrier");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Assign Carrier (optional)</option>`;

  getCarriers().forEach(carrier => {
    dropdown.innerHTML += `<option value="${carrier.id}">${carrier.name}</option>`;
  });
}

function renderUsers() {
  const table = document.getElementById("usersTable");
  if (!table) return;

  const users = getUsers();

  if (users.length === 0) {
    table.innerHTML = `<tr><td colspan="6">No user accounts created.</td></tr>`;
    return;
  }

  table.innerHTML = users.map((user, index) => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.carrierName || "-"}</td>
      <td>${user.status}</td>
      <td>
        <button class="small-btn danger" onclick="deleteUser(${index})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function deleteUser(index) {
  if (!confirmDelete("user account")) return;

  const users = getUsers();
  users.splice(index, 1);
  saveUsers(users);

  renderUsers();

  showNotification("User deleted.", "#dc2626");
}
