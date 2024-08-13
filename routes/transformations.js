const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new Transformation
router.post('/', (req, res, next) => {
    const transformation = req.body;
    const sql = 'INSERT INTO Transformations SET ?';
    db.query(sql, transformation, (err, result) => {
        if (err) {
            console.error('Error creating transformation:', err.message);
            return next(err);
        }
        res.status(201).send(`Transformation added with ID: ${result.insertId}`);
    });
});

// Read all Transformations with pagination
router.get('/', (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sql = 'SELECT * FROM Transformations LIMIT ? OFFSET ?';
    db.query(sql, [limit, offset], (err, results) => {
        if (err) {
            console.error('Error fetching transformations:', err.message);
            return next(err);
        }
        res.json(results);
    });
});

// Read a single Transformation
router.get('/:id', (req, res, next) => {
    const sql = 'SELECT * FROM Transformations WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(`Error fetching transformation with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.length === 0) {
            return res.status(404).send({ error: 'Transformation not found' });
        }
        res.json(result[0]);
    });
});

// Update a Transformation
router.put('/:id', (req, res, next) => {
    const sql = 'UPDATE Transformations SET ? WHERE id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
        if (err) {
            console.error(`Error updating transformation with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Transformation not found' });
        }
        res.send(`Transformation updated with ID: ${req.params.id}`);
    });
});

// Delete a Transformation
router.delete('/:id', (req, res, next) => {
    const sql = 'DELETE FROM Transformations WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error(`Error deleting transformation with ID ${req.params.id}:`, err.message);
            return next(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Transformation not found' });
        }
        res.send(`Transformation deleted with ID: ${req.params.id}`);
    });
});

module.exports = router;
