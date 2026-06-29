// ==========================================
// GraniteSky Dispatch Center
// Layout & Navigation Module
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    highlightCurrentPage();
    showLoggedInUser();
    createMobileMenu();

});

// ==========================================
// Highlight Current Sidebar Page
// ==========================================

function highlightCurrentPage() {

    const currentPage = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".sidebar-nav a");

    links.forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }

    });

}

// ==========================================
// Display Logged In User
// ==========================================

function showLoggedInUser() {

    const user = JSON.parse(localStorage.getItem("gsUser"));

    if (!user) return;

    const targets = document.querySelectorAll(".logged-user");

    targets.forEach(target => {

        target.textContent = user.name;

    });

}

// ==========================================
// Mobile Sidebar Toggle
// ==========================================

function createMobileMenu() {

    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) return;

    let button = document.querySelector(".menu-toggle");

    if (button) return;

    button = document.createElement("button");

    button.innerHTML = "☰";

    button.className = "menu-toggle";

    document.body.appendChild(button);

    button.addEventListener("click", () => {

        sidebar.classList.toggle("mobile-open");

    });

}

// ==========================================
// Notification Popup
// ==========================================

function showNotification(message, color = "#16a34a") {

    let note = document.createElement("div");

    note.innerText = message;

    note.style.position = "fixed";
    note.style.right = "25px";
    note.style.bottom = "25px";
    note.style.background = color;
    note.style.color = "#fff";
    note.style.padding = "14px 20px";
    note.style.borderRadius = "14px";
    note.style.fontWeight = "700";
    note.style.boxShadow = "0 15px 40px rgba(0,0,0,.25)";
    note.style.zIndex = "9999";

    document.body.appendChild(note);

    setTimeout(() => {

        note.remove();

    }, 3000);

}

// ==========================================
// Confirm Delete
// ==========================================

function confirmDelete(itemName = "item") {

    return confirm(`Delete this ${itemName}?`);

}

// ==========================================
// Format Currency
// ==========================================

function formatMoney(value) {

    return Number(value || 0).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

}

// ==========================================
// Format Date
// ==========================================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString();

}
