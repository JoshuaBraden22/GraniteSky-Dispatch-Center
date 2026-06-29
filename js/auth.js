// GraniteSky Dispatch Center - Authentication Module

const defaultUsers = [
  {
    id: "default_admin",
    name: "Joshua Braden",
    email: "admin@granitesky.com",
    password: "admin123",
    role: "Admin",
    carrierId: "",
    carrierName: "",
    status: "Active"
  },
  {
    id: "default_carrier",
    name: "Carrier User",
    email: "carrier@granitesky.com",
    password: "carrier123",
    role: "Carrier",
    carrierId: "",
    carrierName: "",
    status: "Active"
  }
];

function getAllLoginUsers() {
  const savedUsers = typeof getUsers === "function" ? getUsers() : [];
  return [...defaultUsers, ...savedUsers];
}

function requireLogin() {
  const user = JSON.parse(localStorage.getItem("gsUser"));

  if (!user) {
    window.location.href = "login.html?v=4000";
    return null;
  }

  return user;
}

function logout() {
  localStorage.removeItem("gsUser");
  window.location.href = "login.html?v=4000";
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("gsUser"));
}

function showUserName() {
  const user = getCurrentUser();
  const element = document.getElementById("loggedUser");

  if (user && element) {
    element.textContent = user.name;
  }
}

function routeUser(user) {
  const role = String(user.role || "").toLowerCase();

  if (role === "carrier" || role === "owner operator") {
    window.location.href = "carrier-dashboard.html?v=4000";
  } else {
    window.location.href = "dashboard.html?v=999";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    const user = getAllLoginUsers().find(account =>
      account.email === email &&
      account.password === password &&
      account.status !== "Inactive"
    );

    if (!user) {
      alert("Invalid email, password, or inactive account.");
      return;
    }

    localStorage.setItem("gsUser", JSON.stringify(user));
    routeUser(user);
  });
});
