const express = require('express');
const router = express.Router();
const db = require('../db');

// Create Event
router.post('/', (req, res, next) => {
    const event = req.body;
    const sql = 'INSERT INTO Events SET ?';
    db.query(sql, event, (err, result) => {
        if (err) {
            console.error('Error creating event:', err.message);
            return next(err);
        }
        res.status(201).send(`Event added with ID: ${result.insertId}`);
    });
});

// Read all Events with pagination
router.get('/', (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = `
        SELECT Events.*, Files.filepath AS image_path 
        FROM Events 
        LEFT JOIN Files ON Events.background_id = Files.id 
        LIMIT ? OFFSET ?`;

    db.query(sql, [limit, offset], (err, results) => {
        if (err) {
            console.error('Error fetching events:', err.message);
            return next(err);
        }
        res.json(results);
    });
});

// Read single Event
router.get('/:id', (req, res, next) => {
    const sql = `
        SELECT Events.*, Files.filepath AS image_path 
        FROM Events 
        LEFT JOIN Files ON Events.background_id = Files.id 
        WHERE Events.id = ?`;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(`Error fetching event with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.length === 0) {
            return res.status(404).send({ error: 'Event not found' });
        }
        res.json(result[0]);
    });
});

// Update Event
router.put('/:id', (req, res, next) => {
    const sql = 'UPDATE Events SET ? WHERE id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
        if (err) {
            console.error(`Error updating event with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Event not found' });
        }
        res.send(`Event updated with ID: ${req.params.id}`);
    });
});

// Delete Event
router.delete('/:id', (req, res, next) => {
    const sql = 'DELETE FROM Events WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(`Error deleting event with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Event not found' });
        }
        res.send(`Event deleted with ID: ${req.params.id}`);
    });
});

module.exports = router;
