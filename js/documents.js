// GraniteSky Dispatch Center - Documents Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("documentForm")) return;

  requireLogin();
  populateDocumentLoadDropdown();
  renderDocuments();

  const documentForm = document.getElementById("documentForm");

  documentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const documents = getDocuments();
    const fileInput = document.getElementById("documentFile");
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "No file selected";

    const documentRecord = {
      load: document.getElementById("documentLoad").value || "Unassigned",
      type: document.getElementById("documentType").value,
      name: document.getElementById("documentName").value.trim(),
      file: fileName,
      notes: document.getElementById("documentNotes").value.trim()
    };

    documents.unshift(documentRecord);
    saveDocuments(documents);

    documentForm.reset();
    populateDocumentLoadDropdown();
    renderDocuments();

    showNotification("Document saved successfully.");
  });
});

function populateDocumentLoadDropdown() {
  const dropdown = document.getElementById("documentLoad");
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">Attach to Load</option>`;

  getLoads().forEach(load => {
    dropdown.innerHTML += `
      <option value="${load.loadNumber}">
        ${load.loadNumber} — ${load.pickup} → ${load.delivery}
      </option>
    `;
  });
}

function renderDocuments() {
  const table = document.getElementById("documentsTable");
  if (!table) return;

  const documents = getDocuments();

  if (documents.length === 0) {
    table.innerHTML = `<tr><td colspan="6">No documents added yet.</td></tr>`;
    return;
  }

  table.innerHTML = documents.map((doc, index) => `
    <tr>
      <td>${doc.load}</td>
      <td>${doc.type}</td>
      <td>${doc.name}</td>
      <td>${doc.file}</td>
      <td>${doc.notes || "-"}</td>
      <td>
        <button class="small-btn danger" onclick="deleteDocument(${index})">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteDocument(index) {
  if (!confirmDelete("document")) return;

  const documents = getDocuments();
  documents.splice(index, 1);

  saveDocuments(documents);
  renderDocuments();

  showNotification("Document deleted.", "#dc2626");
}

function clearDocuments() {
  if (!confirm("Clear all documents?")) return;

  localStorage.removeItem("gsDocuments");
  renderDocuments();

  showNotification("All documents cleared.", "#dc2626");
}
