const API_URL =
  'https://appointment-booking-api-iir8.onrender.com/appointments';

// Load appointments
async function loadAppointments() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const container = document.getElementById('appointments');
  container.innerHTML = '';

  data.forEach((app) => {
    const div = document.createElement('div');
    div.className = 'card';

    const statusClass = app.status.toLowerCase();

    div.innerHTML = `
      <strong>${app.customerName}</strong><br>
      Service: ${app.service}<br>
      Date: ${app.date}<br>
      Time: ${app.time}<br>
      Status: <span class="status ${statusClass}">${app.status}</span><br>

      <div class="actions">
        <button onclick="markComplete(${app.id})">✔ Complete</button>
        <button onclick="cancelAppointment(${app.id})">✖ Cancel</button>
        <button onclick="deleteAppointment(${app.id})">🗑 Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}

// Add appointment
async function addAppointment() {
  const customerName = document.getElementById('name').value;
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!customerName || !service || !date || !time) {
    alert('Please fill all fields');
    return;
  }

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName,
      service,
      date,
      time,
      status: 'Scheduled',
    }),
  });

  clearInputs();
  loadAppointments();
}

// Mark complete
async function markComplete(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Completed' }),
  });

  loadAppointments();
}

// Cancel
async function cancelAppointment(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Cancelled' }),
  });

  loadAppointments();
}

// Delete
async function deleteAppointment(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  loadAppointments();
}

// Clear inputs
function clearInputs() {
  document.getElementById('name').value = '';
  document.getElementById('service').value = '';
  document.getElementById('date').value = '';
  document.getElementById('time').value = '';
}

// Init
loadAppointments();
