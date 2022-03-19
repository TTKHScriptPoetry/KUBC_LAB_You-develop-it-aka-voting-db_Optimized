const express = require('express');
const router = express.Router();

const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// The affected row's id should always be part of the route (e.g., /api/candidate/2) 
// while the actual fields we're updating should be part of the body.
router.put('/candidate/:id', (req, res) => {
   // validate input first
   const errors = inputCheck(req.body, 'party_id');
   if (errors) {
   res.status(400).json({ error: errors });
   return; // ENDS
   }
   const sqlUpdate = `UPDATE candidates SET party_id = ? WHERE id = ?`;
   const params = [req.body.party_id, req.params.id];
   db.query(sqlUpdate, params, (err, result) => {
      if(err){
         // no return statement
         res.status(400).json({
            error: err.message
         });
      }
      else if (!result.affectedRows){
         res.json({
            message: 'Candidate not found'
         })
      }
      else {
         res.json({
            message: 'success',
            data: req.body,
            rowchanges: result.affectedRows
         });
      }
   });
});

// Get all candidates
router.get('/candidates', (req, res) => {
   // const sqlSelectAll = `SELECT * FROM candidates`;
   const sqlSelectAll = `SELECT candidates.*, parties.name 
                        AS party_name 
                        FROM candidates 
                        LEFT JOIN parties 
                        ON candidates.party_id = parties.id`;
   db.query(sqlSelectAll, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ // in case err is null [aka there was no errors ] and the response is sent back
         message: 'success',
         data: rows
      });
    });
});

// Get a single candidate
router.get('/candidate/:id', (req, res) => {
   const sqlSelectOne = `SELECT candidates.*, parties.name 
                        AS party_name 
                        FROM candidates 
                        LEFT JOIN parties 
                        ON candidates.party_id = parties.id 
                        WHERE candidates.id = ?`;
   const params = req.params.id;

   db.query(sqlSelectOne, params, (err, rows) =>{
      if (err) {
         res.status(400).json({ error: err.message });
         return;
      }
      res.json({
         message: 'success',
         data: rows
      });
   });
   
});

// Delete a candidate
router.delete('/candidate/:id', (req, res) => {
   const sqlDelete =  `DELETE FROM candidates WHERE id = ?`;
   const params = [req.params.id];

   db.query(sqlDelete, params, (err, result) => {
      if (err){
         res.status(400).json({ error: err.message});
         return;
      }
      else if (!result.affectedRows)
      {
         res.json({
            message: 'Candidate not found'
         });
      }
      else{
         res.json({
            message: 'deleted',
            rowchanges: result.affectedRows,
            id: req.params.id
         });
      }
     
   });

});

// using object destructuring to pull the body property out of the request object
router.post('/candidate', ({ body }, res) => {   
   const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
   if (errors) {
      res.status(400).json({ error: errors.message });
      return;
   }   
   const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
   const params = [body.first_name, body.last_name, body.industry_connected];

   db.query(sql, params, (err, result) => {
      if (err) {
         res.status(400).json({ error: err });
         return;
      }
      res.json({
         message: 'success',
         data: body
      });

   });

});

module.exports = router; // = candidateRouter ??