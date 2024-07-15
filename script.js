function addEvent() {
    const title = document.getElementById('eventTitle').value;
    const startTime = new Date(document.getElementById('startTime').value);
    const endTime = new Date(document.getElementById('endTime').value);
    const notifyTime = document.getElementById('notifyTime').value;
    const location = document.getElementById('location').value;
    const guests = document.getElementById('guests').value;
    const email = document.getElementById('email').value;
    const priority = document.getElementById('priority').value;

    // Generate ICS content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${formatICalDate(startTime)}
DTEND:${formatICalDate(endTime)}
LOCATION:${location}
DESCRIPTION:Event details:
 Title: ${title}
 Start Time: ${startTime.toISOString()}
 End Time: ${endTime.toISOString()}
 Notification: ${notifyTime} minutes before
 Location: ${location}
 Guests: ${guests}
 Priority: ${priority}
END:VEVENT
END:VCALENDAR`;

    // Create Blob from ICS content
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });

    // Create URL for Blob
    const url = URL.createObjectURL(blob);

    // Create email link with ICS file as attachment
    const subject = `Event: ${title}`;
    const body = `Event Details attached as .ics file.\n\nTitle: ${title}\nStart Time: ${startTime}\nEnd Time: ${endTime}\nNotification: ${notifyTime} minutes before\nLocation: ${location}\nGuests: ${guests}\nPriority: ${priority}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&attach=${url}`;

    // Open email client
    window.open(mailtoUrl);

    // Clean up Blob URL after use
    URL.revokeObjectURL(url);
}

function formatICalDate(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
}
document.getElementById('saveNoteBtn').addEventListener('click', saveNote);

function saveNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value.trim();
    if (noteText) {
        const notesList = document.getElementById('notesList');
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.textContent = noteText;
        notesList.appendChild(noteItem);

        // Save to local storage
        saveToLocalStorage(noteText);

        noteInput.value = '';
    }
}

function saveToLocalStorage(note) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotes() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.getElementById('notesList');

    notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.textContent = note;
        notesList.appendChild(noteItem);
    });
}

// Load notes on page load
document.addEventListener('DOMContentLoaded', loadNotes);
