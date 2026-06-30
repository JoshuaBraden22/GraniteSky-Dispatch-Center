// GraniteSky Dispatch Center - Firebase Authentication Module

function requireLogin() {
  const user = JSON.parse(localStorage.getItem("gsUser"));

  if (!user) {
    window.location.href = "login.html?v=7000";
    return null;
  }

  return user;
}

function logout() {
  gsAuth.signOut().finally(() => {
    localStorage.removeItem("gsUser");
    window.location.href = "login.html?v=7000";
  });
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("gsUser"));
}

function showUserName() {
  const user = getCurrentUser();
  const element = document.getElementById("loggedUser");

  if (user && element) {
    element.textContent = user.name || user.email;
  }
}

function routeUser(user) {
  const role = String(user.role || "Admin").toLowerCase();

  if (role === "carrier" || role === "owner operator") {
    window.location.href = "carrier-dashboard.html?v=7000";
    return;
  }

  window.location.href = "dashboard.html?v=7000";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    try {
      const credential = await gsAuth.signInWithEmailAndPassword(email, password);
      const firebaseUser = credential.user;

      let profile = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || email,
        email: firebaseUser.email,
        role: "Admin",
        carrierId: "",
        carrierName: "",
        status: "Active"
      };

      const userDoc = await gsDb.collection("users").doc(firebaseUser.uid).get();

      if (userDoc.exists) {
        profile = {
          ...profile,
          ...userDoc.data(),
          uid: firebaseUser.uid,
          id: firebaseUser.uid,
          email: firebaseUser.email
        };
      }

      if (profile.status === "Inactive") {
        alert("This account is inactive.");
        await gsAuth.signOut();
        return;
      }

      localStorage.setItem("gsUser", JSON.stringify(profile));
      routeUser(profile);

    } catch (error) {
      alert(error.message);
    }
  });
});
