const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const PORT = process.env.PORT || 3009;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // pivot point
app.use('/api', apiRoutes);

// Table Candidates Stuff: ////////////////////////////////////////////////////////////////////

// Build more routes

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
   console.log(`Example app listening at http://localhost:${PORT}/api/parties`);
   
 });

// // Start server after DB connection
// db.connect(err => {
//   if (err) throw err;
//   console.log('Database connected.');
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// });

// Out put in order:
// Connected to the election database.
// Server running on port 3001
// Example app listening at http://localhost:3001/ 