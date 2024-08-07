const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// File upload route
router.post('/', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send({ error: 'Please upload a file' });
    }

    const sql = 'INSERT INTO Files (filename, filepath) VALUES (?, ?)';
    db.query(sql, [file.filename, file.path], (err, result) => {
        if (err) {
            console.error('Error saving file metadata:', err.message);
            return next(err);
        }
        res.status(201).send({ fileId: result.insertId, message: 'File uploaded successfully' });
    });
});

module.exports = router;
