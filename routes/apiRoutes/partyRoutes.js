const express = require('express');
const router = express.Router();

const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.get('/parties', (req, res) => {
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

   
router.get('/party/:id', (req, res) => {
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
   
router.delete('/party/:id', (req, res) => {
   const sqlDelete = `DELETE FROM parties WHERE id = ?`;
   const params = [req.params.id];
   db.query(sqlDelete, params, (err, result) => {
      if (err) {
         res.status(400).json({ error: res.message }); // res message not err message here
         // checks if anything was deleted
      } else if (!result.affectedRows) {
         res.json({
            message: 'Party not found'
         });
      } else {
         res.json({
            message: 'deleted',
            rowchanges: result.affectedRows,
            id: req.params.id
         });
      }
   });
});
   
module.exports = router;