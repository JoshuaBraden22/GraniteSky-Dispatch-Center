// GraniteSky Dispatch Center - Firebase Access Management

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("userForm")) return;

  requireLogin();
  populateUserCarrierDropdown();
  renderUsers();

  document.getElementById("userForm").addEventListener("submit", handleUserSubmit);
});

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function populateUserCarrierDropdown() {
  const dropdown = document.getElementById("userCarrier");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Assign Carrier / Owner Operator</option>`;

  getCarriers().forEach(carrier => {
    dropdown.innerHTML += `<option value="${carrier.id}">${carrier.name}</option>`;
  });
}

async function handleUserSubmit(e) {
  e.preventDefault();

  const editId = getValue("userEditId");
  const carrierId = getValue("userCarrier");
  const carrier = getCarriers().find(c => c.id === carrierId);

  const profile = {
    name: getValue("userName"),
    email: getValue("userEmail").toLowerCase(),
    role: getValue("userRole"),
    permission: getValue("userPermission"),
    carrierId,
    carrierName: carrier ? carrier.name : "",
    status: getValue("userStatus"),
    forcePasswordChange: getValue("forcePasswordChange") === "Yes",
    updatedAt: new Date().toISOString()
  };

  const password = getValue("userPassword");

  try {
    if (editId) {
      await gsDb.collection("users").doc(editId).set(profile, { merge: true });
      showNotification("User profile updated.");
    } else {
      if (!password) {
        alert("Password is required for new users.");
        return;
      }

      const secondaryApp = firebase.initializeApp(window.firebaseConfig, "Secondary");
      const secondaryAuth = secondaryApp.auth();

      const credential = await secondaryAuth.createUserWithEmailAndPassword(profile.email, password);
      const newUser = credential.user;

      await newUser.updateProfile({
        displayName: profile.name
      });

      await gsDb.collection("users").doc(newUser.uid).set({
        ...profile,
        uid: newUser.uid,
        id: newUser.uid,
        createdAt: new Date().toISOString()
      });

      await secondaryAuth.signOut();
      await secondaryApp.delete();

      showNotification("Firebase user account created.");
    }

    resetUserForm();
    renderUsers();

  } catch (error) {
    alert(error.message);
  }
}

async function renderUsers() {
  const table = document.getElementById("usersTable");
  if (!table) return;

  const snapshot = await gsDb.collection("users").orderBy("createdAt", "desc").get();

  if (snapshot.empty) {
    table.innerHTML = `<tr><td colspan="8">No user accounts created.</td></tr>`;
    return;
  }

  table.innerHTML = snapshot.docs.map(doc => {
    const user = doc.data();

    return `
      <tr>
        <td>${user.name || "-"}</td>
        <td>${user.email || "-"}</td>
        <td>${user.role || "-"}</td>
        <td>${user.permission || "-"}</td>
        <td>${user.carrierName || "-"}</td>
        <td>${user.status || "Active"}</td>
        <td>${user.forcePasswordChange ? "Yes" : "No"}</td>
        <td>
          <div class="actions">
            <button class="small-btn" onclick="editUser('${doc.id}')">Edit</button>
            <button class="small-btn" onclick="toggleUserStatus('${doc.id}', '${user.status || "Active"}')">
              ${(user.status || "Active") === "Active" ? "Deactivate" : "Activate"}
            </button>
            <button class="small-btn danger" onclick="deleteUserProfile('${doc.id}')">Delete Profile</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

async function editUser(userId) {
  const doc = await gsDb.collection("users").doc(userId).get();
  if (!doc.exists) return;

  const user = doc.data();

  document.getElementById("userEditId").value = userId;
  document.getElementById("userName").value = user.name || "";
  document.getElementById("userEmail").value = user.email || "";
  document.getElementById("userPassword").value = "";
  document.getElementById("userPassword").placeholder = "Leave blank to keep password";
  document.getElementById("userRole").value = user.role || "Carrier";
  document.getElementById("userPermission").value = user.permission || "Carrier Portal Only";
  document.getElementById("userCarrier").value = user.carrierId || "";
  document.getElementById("userStatus").value = user.status || "Active";
  document.getElementById("forcePasswordChange").value = user.forcePasswordChange ? "Yes" : "No";

  document.getElementById("userSubmitBtn").textContent = "Update Account";
  document.getElementById("cancelEditBtn").style.display = "inline-block";
}

async function toggleUserStatus(userId, currentStatus) {
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

  await gsDb.collection("users").doc(userId).set({
    status: newStatus,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  renderUsers();
  showNotification("User status updated.");
}

async function deleteUserProfile(userId) {
  if (!confirm("Delete this user profile? This does not delete the Firebase Auth login.")) return;

  await gsDb.collection("users").doc(userId).delete();

  renderUsers();
  showNotification("User profile deleted.", "#dc2626");
}

function resetUserForm() {
  document.getElementById("userForm").reset();
  document.getElementById("userEditId").value = "";
  document.getElementById("userPassword").placeholder = "Temporary Password";
  document.getElementById("userSubmitBtn").textContent = "Create Account";
  document.getElementById("cancelEditBtn").style.display = "none";
}
