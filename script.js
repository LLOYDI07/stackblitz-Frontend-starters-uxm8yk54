// Base API endpoint for all appointment requests
const API_URL =
  'https://appointment-booking-api-iir8.onrender.com/appointments';



// LOAD APPOINTMENTS (GET)

async function loadAppointments() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const container = document.getElementById('appointments');
  container.innerHTML = ''; 

  // Loop through each appointment
  data.forEach((app) => {
    const div = document.createElement('div');
    div.className = 'card';

    // Convert status to lowercase for CSS class styling
    const statusClass = app.status.toLowerCase();

    // Populate appointment card HTML
    div.innerHTML = `
      <strong>${app.customerName}</strong><br>
      Service: ${app.service}<br>
      Date: ${app.date}<br>
      Time: ${app.time}<br>
      Status: <span class="status ${statusClass}">${app.status}</span><br>

      <div class="actions">
        <!-- Stop propagation prevents opening modal when clicking button -->
        <button onclick="event.stopPropagation(); markComplete(${app.id})">✔ Complete</button>
        <button onclick="event.stopPropagation(); cancelAppointment(${app.id})">✖ Cancel</button>
        <button onclick="event.stopPropagation(); deleteAppointment(${app.id})">🗑 Delete</button>
      </div>
    `;

    // Clicking card opens modal with details
    div.addEventListener('click', () => {
      showDetails(app);
    });

    container.appendChild(div);
  });
}


// ADD NEW APPOINTMENT (POST)

async function addAppointment() {
  const customerName = document.getElementById('name').value;
  const service = document.getElementById('service').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!customerName || !service || !date || !time) {
    alert('Please fill all fields');
    return;
  }

  // Send POST request to API
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName,
      service,
      date,
      time,
      status: 'Scheduled', // default status
    }),
  });

  clearInputs();       
  loadAppointments();  
}



// MARK APPOINTMENT AS COMPLETED (PUT)

async function markComplete(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Completed' }),
  });

  loadAppointments(); 
}



// CANCEL APPOINTMENT (PUT)

async function cancelAppointment(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Cancelled' }),
  });

  loadAppointments(); 
}



// DELETE APPOINTMENT (DELETE)

async function deleteAppointment(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  loadAppointments(); 
}



// SHOW MODAL WITH DETAILS

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



// CLOSE MODAL
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// CLOSE MODAL WHEN CLICKING OUTSIDE

window.onclick = function (event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};


function clearInputs() {
  document.getElementById('name').value = '';
  document.getElementById('service').value = '';
  document.getElementById('date').value = '';
  document.getElementById('time').value = '';
}


loadAppointments(); 