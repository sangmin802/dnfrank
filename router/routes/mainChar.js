const express = require('express');
const router = express.Router();
const db = require('../../db/db.js');

router.post('/chooseMainChar', (req, res) => {
  const {body : {id, server, uid}} = req;
  db.query('update user set server = ?, mainchar = ? where id = ?', [server, id, uid], (err, result) => {
    if(err) throw err;
    db.query('select * from user where id = ?', [uid], (err2, user) => {
      if(err2) throw err2;
      let immUser = {...user[0]};
      delete immUser.upw;
      res.json({result : true, immUser});
    })
  })
})

module.exports = router;