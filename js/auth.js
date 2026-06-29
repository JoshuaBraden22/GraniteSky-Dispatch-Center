// GraniteSky Dispatch Center - Authentication Module

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

function requireLogin() {
  const user = JSON.parse(localStorage.getItem("gsUser"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  return user;
}

function logout() {
  localStorage.removeItem("gsUser");
  window.location.href = "login.html";
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

document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document
      .getElementById("email")
      .value
      .trim()
      .toLowerCase();

    const password = document
      .getElementById("password")
      .value;

    const user = users.find(u =>
      u.email === email &&
      u.password === password
    );

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

});
