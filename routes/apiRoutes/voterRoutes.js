const express = require('express');
const routerVoter = express.Router();

const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

routerVoter.get('/voters', (req, res) => {
  const sqlSelectAll = `SELECT * FROM voters ORDER BY id`;

  db.query(sqlSelectAll, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

// Get single voter
routerVoter.get('/voter/:id', (req, res) => {
  const sqlUnique = `SELECT * FROM voters WHERE id = ?`;
  const params = [req.params.id];

  db.query(sqlUnique, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});


routerVoter.get('/voters/lastcreated', (req, res) => {
  const sqlSelect1LastCreated = `SELECT * FROM voters ORDER BY created_at DESC LIMIT 1`;

  db.query(sqlSelect1LastCreated, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

// Create voter
routerVoter.post('/voter', ({ body }, res) => {
  // Data validation
  const errors = inputCheck(body, 'first_name', 'last_name', 'email'); // pass in 3 fields
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sqlInsert = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.email];

  db.query(sqlInsert, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Update voter email
routerVoter.put('/voter/:id', (req, res) => {
  // Data validation
  const errors = inputCheck(req.body, 'email'); // passed in 1 field only
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sqlUpdate = `UPDATE voters SET email = ? WHERE id = ?`;
  const params = [req.body.email, req.params.id];

  db.query(sqlUpdate, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Voter not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete a voter record
routerVoter.delete('/voter/:id', (req, res) => {
  const sqlDelete = `DELETE FROM voters WHERE id = ?`;

  db.query(sqlDelete, req.params.id, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Voter not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = routerVoter;