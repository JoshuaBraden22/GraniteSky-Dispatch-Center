// GraniteSky Dispatch Center - Companies Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("companyForm")) return;

  requireLogin();
  renderCompanies();

  const companyForm = document.getElementById("companyForm");

  companyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const companies = getCompanies();

    const company = {
      name: document.getElementById("companyName").value.trim(),
      type: document.getElementById("companyType").value,
      mc: document.getElementById("companyMC").value.trim(),
      dot: document.getElementById("companyDOT").value.trim(),
      contact: document.getElementById("companyContact").value.trim(),
      phone: document.getElementById("companyPhone").value.trim(),
      email: document.getElementById("companyEmail").value.trim(),
      terms: document.getElementById("companyTerms").value.trim(),
      notes: document.getElementById("companyNotes").value.trim()
    };

    companies.unshift(company);
    saveCompanies(companies);

    companyForm.reset();
    renderCompanies();

    showNotification("Company saved successfully.");
  });
});

function renderCompanies() {
  const table = document.getElementById("companiesTable");
  if (!table) return;

  const companies = getCompanies();

  if (companies.length === 0) {
    table.innerHTML = `<tr><td colspan="9">No companies added yet.</td></tr>`;
    return;
  }

  table.innerHTML = companies.map((company, index) => `
    <tr>
      <td>${company.name}</td>
      <td>${company.type}</td>
      <td>${company.mc || "-"}</td>
      <td>${company.dot || "-"}</td>
      <td>${company.contact || "-"}</td>
      <td>${company.phone || "-"}</td>
      <td>${company.email || "-"}</td>
      <td>${company.terms || "-"}</td>
      <td>
        <button class="small-btn danger" onclick="deleteCompany(${index})">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteCompany(index) {
  if (!confirmDelete("company")) return;

  const companies = getCompanies();
  companies.splice(index, 1);

  saveCompanies(companies);
  renderCompanies();

  showNotification("Company deleted.", "#dc2626");
}

function clearCompanies() {
  if (!confirm("Clear all companies?")) return;

  localStorage.removeItem("gsCompanies");
  renderCompanies();

  showNotification("All companies cleared.", "#dc2626");
}
