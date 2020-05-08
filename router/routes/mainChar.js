const express = require('express');
const router = express.Router();
const db = require('../../db/db.js');

router.post('/chooseMainChar', (req, res) => {
  const {body : {id, server, uid}} = req;
  db.query('update user set server = ?, mainchar = ? where id = ?', [server, id, uid], (err, result) => {
    if(err) throw err;
    res.json({result : true});
  })
})

module.exports = router;