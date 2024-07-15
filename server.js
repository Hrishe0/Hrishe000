const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const eventsFile = path.join(__dirname, 'events.json');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to get events
app.get('/events', (req, res) => {
    fs.readFile(eventsFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading events file' });
        }
        const events = JSON.parse(data || '[]');
        res.json(events);
    });
});

// Route to add or update an event
app.post('/events', (req, res) => {
    const newEvent = req.body;
    fs.readFile(eventsFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading events file' });
        }
        let events = JSON.parse(data || '[]');
        const existingEventIndex = events.findIndex(event => event.id === newEvent.id);
        if (existingEventIndex >= 0) {
            events[existingEventIndex] = newEvent;
        } else {
            events.push(newEvent);
        }
        fs.writeFile(eventsFile, JSON.stringify(events), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving events' });
            }
            res.json({ message: 'Event saved successfully' });
        });
    });
});

// Route to delete an event
app.delete('/events/:id', (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    fs.readFile(eventsFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading events file' });
        }
        let events = JSON.parse(data || '[]');
        events = events.filter(event => event.id !== eventId);
        fs.writeFile(eventsFile, JSON.stringify(events), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving events' });
            }
            res.json({ message: 'Event deleted successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
