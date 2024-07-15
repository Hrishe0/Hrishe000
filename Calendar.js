let events = JSON.parse(localStorage.getItem('events')) || [];
let currentEventId = null;

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function updateDateTime() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };

    const currentDate = now.toLocaleDateString('en-US', dateOptions);
    const currentClock = now.toLocaleTimeString('en-US', timeOptions);

    document.getElementById('currentDate').textContent = currentDate;
    document.getElementById('currentClock').textContent = currentClock;
}

setInterval(updateDateTime, 1000);

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        dayCell.onclick = () => openEventForm(null, day);

        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = currentMonth + 1 < 10 ? '0' + (currentMonth + 1) : (currentMonth + 1);
        const formattedDate = `${currentYear}-${formattedMonth}-${formattedDay}`;

        const dayEvents = events.filter(event => event.date === formattedDate);
        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-element');
            eventElement.style.backgroundColor = event.priority === 'high' ? 'red' :
                event.priority === 'medium' ? 'orange' : 'green';
            eventElement.textContent = event.title;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('buttons');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = (e) => {
                e.stopPropagation();
                openEventForm(event.id, day);
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                deleteEventById(event.id);
            };

            buttonsDiv.appendChild(editButton);
            buttonsDiv.appendChild(deleteButton);
            eventElement.appendChild(buttonsDiv);

            dayCell.appendChild(eventElement);
        });

        calendar.appendChild(dayCell);
    }
}

function openEventForm(eventId, day) {
    currentEventId = eventId;
    const formTitle = document.querySelector('.event-form h2');

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth;
    const formattedDate = `${currentYear}-${formattedMonth}-${formattedDay}`;

    if (eventId) {
        const event = events.find(event => event.id === eventId);
        if (event) {
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('startTime').value = event.startTime;
            document.getElementById('endTime').value = event.endTime;
            document.getElementById('notifyTime').value = event.notifyTime;
            document.getElementById('location').value = event.location;
            document.getElementById('guests').value = event.guests;
            document.getElementById('email').value = event.email;
            document.getElementById('priority').value = event.priority;
            formTitle.textContent = 'Edit Event';
        }
    } else {
        document.getElementById('eventId').value = '';
        document.getElementById('eventTitle').value = '';
        document.getElementById('startTime').value = `${formattedDate}T11:30`;
        document.getElementById('endTime').value = `${formattedDate}T12:30`;
        document.getElementById('notifyTime').value = '10';
        document.getElementById('location').value = '';
        document.getElementById('guests').value = '';
        document.getElementById('email').value = '';
        document.getElementById('priority').value = 'low';
        formTitle.textContent = 'Add Event';
    }

    document.getElementById('eventForm').classList.add('open');
}

function saveEvent() {
    const id = document.getElementById('eventId').value || Date.now().toString();
    const title = document.getElementById('eventTitle').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const notifyTime = document.getElementById('notifyTime').value;
    const location = document.getElementById('location').value;
    const guests = document.getElementById('guests').value;
    const email = document.getElementById('email').value;
    const priority = document.getElementById('priority').value;
    const date = startTime.split('T')[0];

    const existingEventIndex = events.findIndex(event => event.id === id);

    if (existingEventIndex > -1) {
        events[existingEventIndex] = { id, title, startTime, endTime, notifyTime, location, guests, email, priority, date };
    } else {
        const newEvent = { id, title, startTime, endTime, notifyTime, location, guests, email, priority, date };
        events.push(newEvent);
    }

    saveEvents();
    closeEventForm();
    generateCalendar();
}

function deleteEvent() {
    if (currentEventId) {
        deleteEventById(currentEventId);
        closeEventForm();
        generateCalendar();
    }
}

function deleteEventById(eventId) {
    events = events.filter(event => event.id !== eventId);
    saveEvents();
    generateCalendar();
}

function closeEventForm() {
    document.getElementById('eventForm').classList.remove('open');
}

document.getElementById('notifyTime').addEventListener('input', function() {
    document.getElementById('notifyTimeLabel').textContent = `Notification ${this.value} minutes before`;
});

document.addEventListener('DOMContentLoaded', function() {
    generateCalendar();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEventForm();
    }
});
