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
        <button onclick="event.stopPropagation(); markComplete(${app.id})">✔ Complete</button>
        <button onclick="event.stopPropagation(); cancelAppointment(${app.id})">✖ Cancel</button>
        <button onclick="event.stopPropagation(); deleteAppointment(${app.id})">🗑 Delete</button>
      </div>
    `;

    // Click to open modal
    div.addEventListener('click', () => {
      showDetails(app);
    });

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

// 🔥 Show modal with 1s loading
function showDetails(app) {
  const modal = document.getElementById('modal');
  const loading = document.getElementById('loading');
  const details = document.getElementById('modalDetails');

  modal.style.display = 'block';

  loading.style.display = 'block';
  details.style.display = 'none';

  setTimeout(() => {
    loading.style.display = 'none';
    details.style.display = 'block';

    details.innerHTML = `
      <h3>Appointment Details</h3>
      <p><strong>Name:</strong> ${app.customerName}</p>
      <p><strong>Service:</strong> ${app.service}</p>
      <p><strong>Date:</strong> ${app.date}</p>
      <p><strong>Time:</strong> ${app.time}</p>
      <p><strong>Status:</strong> ${app.status}</p>
      <p><strong>ID:</strong> ${app.id}</p>
    `;
  }, 1000);
}

// Close modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// Click outside to close
window.onclick = function (event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

// Clear inputs
function clearInputs() {
  document.getElementById('name').value = '';
  document.getElementById('service').value = '';
  document.getElementById('date').value = '';
  document.getElementById('time').value = '';
}

// Init
loadAppointments();