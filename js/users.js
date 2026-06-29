// GraniteSky Dispatch Center - Access Management Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("userForm")) return;

  requireLogin();
  populateUserCarrierDropdown();
  renderUsers();

  const userForm = document.getElementById("userForm");

  userForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const editId = document.getElementById("userEditId")?.value || "";
    const users = getUsers();

    const carrierId = getValue("userCarrier");
    const carrier = getCarriers().find(c => c.id === carrierId);

    const userData = {
      name: getValue("userName"),
      email: getValue("userEmail").toLowerCase(),
      role: getValue("userRole"),
      permission: getValue("userPermission"),
      carrierId,
      carrierName: carrier ? carrier.name : "",
      status: getValue("userStatus"),
      forcePasswordChange: getValue("forcePasswordChange") === "Yes"
    };

    const password = getValue("userPassword");

    if (editId) {
      const user = users.find(u => u.id === editId);
      if (!user) return;

      const emailUsed = users.some(u => u.email === userData.email && u.id !== editId);
      if (emailUsed) {
        alert("Another account already uses this email.");
        return;
      }

      Object.assign(user, userData);

      if (password) {
        user.password = password;
      }

      saveUsers(users);
      showNotification("User updated.");
    } else {
      if (!password) {
        alert("Password is required for new users.");
        return;
      }

      if (users.some(u => u.email === userData.email)) {
        alert("An account with this email already exists.");
        return;
      }

      users.unshift({
        id: generateId("user"),
        ...userData,
        password,
        createdAt: new Date().toISOString()
      });

      saveUsers(users);
      showNotification("User account created.");
    }

    resetUserForm();
    renderUsers();
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

  table.innerHTML = users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.permission || "-"}</td>
      <td>${user.carrierName || "-"}</td>
      <td>${user.status}</td>
      <td>${user.forcePasswordChange ? "Yes" : "No"}</td>
      <td>
        <div class="actions">
          <button class="small-btn" onclick="editUser('${user.id}')">Edit</button>
          <button class="small-btn" onclick="resetUserPassword('${user.id}')">Reset Password</button>
          <button class="small-btn" onclick="toggleUserStatus('${user.id}')">
            ${user.status === "Active" ? "Deactivate" : "Activate"}
          </button>
          <button class="small-btn danger" onclick="deleteUser('${user.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function editUser(userId) {
  const user = getUsers().find(u => u.id === userId);
  if (!user) return;

  document.getElementById("userEditId").value = user.id;
  document.getElementById("userName").value = user.name || "";
  document.getElementById("userEmail").value = user.email || "";
  document.getElementById("userPassword").value = "";
  document.getElementById("userPassword").placeholder = "Leave blank to keep current password";
  document.getElementById("userRole").value = user.role || "Carrier";
  document.getElementById("userPermission").value = user.permission || "Carrier Portal Only";
  document.getElementById("userCarrier").value = user.carrierId || "";
  document.getElementById("userStatus").value = user.status || "Active";
  document.getElementById("forcePasswordChange").value = user.forcePasswordChange ? "Yes" : "No";

  document.getElementById("userSubmitBtn").textContent = "Update Account";
  document.getElementById("cancelEditBtn").style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetUserPassword(userId) {
  const newPassword = prompt("Enter new temporary password:");
  if (!newPassword) return;

  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;

  user.password = newPassword;
  user.forcePasswordChange = true;

  saveUsers(users);
  renderUsers();

  showNotification("Password reset.");
}

function toggleUserStatus(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;

  user.status = user.status === "Active" ? "Inactive" : "Active";

  saveUsers(users);
  renderUsers();

  showNotification("User status updated.");
}

function deleteUser(userId) {
  if (!confirmDelete("user account")) return;

  const users = getUsers().filter(u => u.id !== userId);
  saveUsers(users);

  renderUsers();

  showNotification("User deleted.", "#dc2626");
}

function resetUserForm() {
  document.getElementById("userForm").reset();
  document.getElementById("userEditId").value = "";
  document.getElementById("userPassword").placeholder = "Temporary Password";
  document.getElementById("userSubmitBtn").textContent = "Create Account";
  document.getElementById("cancelEditBtn").style.display = "none";
}
