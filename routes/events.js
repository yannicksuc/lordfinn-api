const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper function to format the event object
const formatEvent = (event) => ({
    id: event.id,
    title: event.title,
    subtitle: event.subtitle,
    description: event.description,
    start_time: event.start_time,
    end_time: event.end_time,
    color: event.color,
    created_at: event.created_at,
    updated_at: event.updated_at,
    is_template: event.is_template,
    parent_event_id: event.parent_event_id,
    background_transformation_id: event.background_transformation_id,
    sticker_transformation_id: event.sticker_transformation_id,
    background: {
        x: event.background_x,
        y: event.background_y,
        scale: event.background_scale,
        image_path: event.background_file_path,
        image_name: event.background_file_name,
    },
    sticker: {
        x: event.sticker_x,
        y: event.sticker_y,
        scale: event.sticker_scale,
        image_path: event.sticker_file_path,
        image_name: event.sticker_file_name,
    }
});

// Helper function to execute SQL query and handle the result
const executeQuery = (sql, params, res, next, single = false) => {
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return next(err);
        }

        if (single) {
            if (results.length === 0) {
                return res.status(404).send({ error: 'Event not found' });
            }
            return res.json(formatEvent(results[0]));
        }

        const formattedResults = results.map(formatEvent);
        res.json(formattedResults);
    });
};

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

// Read all Events with pagination and date filtering
router.get('/', (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    console.log(req.query)
    const { start_date, end_date } = req.query;

    let sql = `
        SELECT Events.*, 
               bt.x_coordinate AS background_x, bt.y_coordinate AS background_y, bt.scale AS background_scale,
               btf.filepath AS background_file_path, btf.filename AS background_file_name,
               st.x_coordinate AS sticker_x, st.y_coordinate AS sticker_y, st.scale AS sticker_scale,
               stf.filepath AS sticker_file_path, stf.filename AS sticker_file_name
        FROM Events 
        LEFT JOIN Transformations bt ON Events.background_transformation_id = bt.id
        LEFT JOIN Files btf ON bt.file_id = btf.id
        LEFT JOIN Transformations st ON Events.sticker_transformation_id = st.id
        LEFT JOIN Files stf ON st.file_id = stf.id
    `;

    const params = [limit, offset];

    console.log(start_date, end_date)

    if (start_date && end_date) {
        sql += ` WHERE Events.start_time BETWEEN ? AND ?`;
        params.unshift(start_date, end_date);  // Add date parameters at the beginning
    }

    sql += ` LIMIT ? OFFSET ?`;

    executeQuery(sql, params, res, next);
});

// Read single Event
router.get('/:id', (req, res, next) => {
    const sql = `
        SELECT Events.*, 
               bt.x_coordinate AS background_x, bt.y_coordinate AS background_y, bt.scale AS background_scale,
               btf.filepath AS background_file_path, btf.filename AS background_file_name,
               st.x_coordinate AS sticker_x, st.y_coordinate AS sticker_y, st.scale AS sticker_scale,
               stf.filepath AS sticker_file_path, stf.filename AS sticker_file_name
        FROM Events 
        LEFT JOIN Transformations bt ON Events.background_transformation_id = bt.id
        LEFT JOIN Files btf ON bt.file_id = btf.id
        LEFT JOIN Transformations st ON Events.sticker_transformation_id = st.id
        LEFT JOIN Files stf ON st.file_id = stf.id
        WHERE Events.id = ?`;

    executeQuery(sql, [req.params.id], res, next, true);
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
