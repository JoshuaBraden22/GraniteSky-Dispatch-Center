// GraniteSky Dispatch Center - Messages Module

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("messageForm")) return;

  requireLogin();
  renderMessages();

  const messageForm = document.getElementById("messageForm");

  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const messages = getMessages();

    const message = {
      date: new Date().toISOString(),
      to: document.getElementById("messageTo").value.trim(),
      subject: document.getElementById("messageSubject").value.trim(),
      body: document.getElementById("messageBody").value.trim()
    };

    messages.unshift(message);
    saveMessages(messages);

    messageForm.reset();
    renderMessages();

    showNotification("Message saved successfully.");
  });
});

function renderMessages() {
  const table = document.getElementById("messagesTable");
  if (!table) return;

  const messages = getMessages();

  if (messages.length === 0) {
    table.innerHTML = `<tr><td colspan="5">No messages added yet.</td></tr>`;
    return;
  }

  table.innerHTML = messages.map((message, index) => `
    <tr>
      <td>${formatDate(message.date)}</td>
      <td>${message.to}</td>
      <td>${message.subject}</td>
      <td>${message.body}</td>
      <td>
        <button class="small-btn danger" onclick="deleteMessage(${index})">
          Delete
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteMessage(index) {
  if (!confirmDelete("message")) return;

  const messages = getMessages();
  messages.splice(index, 1);

  saveMessages(messages);
  renderMessages();

  showNotification("Message deleted.", "#dc2626");
}

function clearMessages() {
  if (!confirm("Clear all messages?")) return;

  localStorage.removeItem("gsMessages");
  renderMessages();

  showNotification("All messages cleared.", "#dc2626");
}
