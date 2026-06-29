// ===========================================
// GraniteSky Dispatch Center
// Version 1.0
// ===========================================

// Demo Users
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

}


// AUTH CHECK
function requireLogin() {

    const user = JSON.parse(localStorage.getItem("gsUser"));

    if (!user) {
        window.location.href = "login.html";
    }

    return user;

}


// LOGOUT
function logout() {

    localStorage.removeItem("gsUser");

    window.location.href = "login.html";

}


// DISPLAY USER NAME
function showUserName() {

    const user = JSON.parse(localStorage.getItem("gsUser"));

    const target = document.getElementById("loggedUser");

    if (target && user) {
        target.innerHTML = user.name;
    }

}
