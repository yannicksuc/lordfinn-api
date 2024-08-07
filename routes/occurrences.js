const express = require('express');
const router = express.Router();
const db = require('../db');

// Create Occurrence
router.post('/', (req, res, next) => {
    const occurrence = req.body;
    const sql = 'INSERT INTO Occurrences SET ?';
    db.query(sql, occurrence, (err, result) => {
        if (err) {
            console.error('Error creating occurrence:', err.message);
            return next(err);
        }
        res.status(201).send(`Occurrence added with ID: ${result.insertId}`);
    });
});

// Read all Occurrences with pagination
router.get('/', (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM Occurrences LIMIT ${limit} OFFSET ${offset}`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching occurrences:', err.message);
            return next(err);
        }
        res.json(results);
    });
});

// Read single Occurrence
router.get('/:id', (req, res, next) => {
    const sql = 'SELECT * FROM Occurrences WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(`Error fetching occurrence with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.length === 0) {
            return res.status(404).send({ error: 'Occurrence not found' });
        }
        res.json(result[0]);
    });
});

// Update Occurrence
router.put('/:id', (req, res, next) => {
    const sql = 'UPDATE Occurrences SET ? WHERE id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
        if (err) {
            console.error(`Error updating occurrence with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Occurrence not found' });
        }
        res.send(`Occurrence updated with ID: ${req.params.id}`);
    });
});

// Delete Occurrence
router.delete('/:id', (req, res, next) => {
    const sql = 'DELETE FROM Occurrences WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(`Error deleting occurrence with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Occurrence not found' });
        }
        res.send(`Occurrence deleted with ID: ${req.params.id}`);
    });
});

module.exports = router;
