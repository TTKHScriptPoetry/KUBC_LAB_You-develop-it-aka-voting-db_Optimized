const express = require('express');
const db = require('./db/connection');
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3007;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // pivot point

app.get('/', (req, res) => {
   res.json({
     message: 'Hello World'
   });
 });

app.get('/api/parties', (req, res) => {
const sqlSelectAll = `SELECT * FROM parties`;
   db.query(sqlSelectAll, (err, rows) => {
      if (err) {
         res.status(500).json({ error: err.message });
         return;
      }
      res.json({
         message: 'success',
         data: rows
      });
   });
}); 

app.get('', (req, res) => {
   const sqlSelectById =  `SELECT * FROM parties WHERE id = ?`;
   const params = [req.params.id];
   db.query(sqlSelectById, params, (err, rows) => {
      if (err){
         res.status(400).json({ error: err.message });
         return;
      }
      res.json({
         message: 'success',
         data: rows
      });
   });
});

// Table Candidates Stuff: ////////////////////////////////////////////////////////////////////

// Build more routes

// The affected row's id should always be part of the route (e.g., /api/candidate/2) 
// while the actual fields we're updating should be part of the body.
app.put('/api/candidate/:id', (req, res) => {
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
app.get('/api/candidates', (req, res) => {
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
app.get('/api/candidate/:id', (req, res) => {
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
app.delete('/api/candidate/:id', (req, res) => {
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
app.post('/api/candidate', ({ body }, res) => {   
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

// // Create a candidate
// app.post('/api/candidate', ({ body }, res) => {
//    const errors = inputCheck(
//      body,
//      'first_name',
//      'last_name',
//      'industry_connected'
//    );
//    if (errors) {
//      res.status(400).json({ error: errors });
//      return;
//    }
//  
//    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
//      VALUES (?,?,?)`;
//    const params = [body.first_name, body.last_name, body.industry_connected];
//  
//    db.query(sql, params, (err, result) => {
//      if (err) {
//        res.status(400).json({ error: err.message });
//        return;
//      }
//      res.json({
//        message: 'success',
//        data: body
//      });
//    });
//  });

// //  // -- Query Actions - Testing purpose only
// // db.query(`SELECT * FROM candidates`, (err, rows) => { // the err = the error response, and rows = the database query response
// //    console.log(rows);
// // }); 
// // 
// // // GET a single candidate -- If there are no errors, the err response returns as null
// // db.query(`SELECT * FROM candidates WHERE id = ?`, 1, (err, row) => {
// //    if (err) {
// //      console.log(err);
// //    }
// //    console.log(row);
// //  });
// // 
// // db.query(`DELETE FROM candidates WHERE id = ?`, 2, (err, row) => {
// //    if (err){
// //       console.log(err);
// //    }
// //    console.log(row);
// // }) 
// // 
// // // Create a candidate
// // const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
// //             VALUES (?,?,?,?)`;
// //             
// // const params = [1, 'Ronald', 'Firbank', 1];
// // 
// // db.query(sql, params, (err, result) => {
// //   if (err) {
// //     console.log(err);
// //   }
// //   console.log(result);
// // });

//  Catchall Route: Default response for any other request (Not Found)
//  This catchall route will override all others—so make sure that this is the last one

app.use((req, res) => {
   res.status(404).end();
 });

// This will start the Express.js server on port 3001
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
   console.log(`Example app listening at http://localhost:${PORT}/api/candidates`);
   console.log(`Example app listening at http://localhost:${PORT}/api/candidate/`);
 });

// Out put in order:
// Connected to the election database.
// Server running on port 3001
// Example app listening at http://localhost:3001/ 