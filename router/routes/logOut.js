const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  // passport-session
  // req.logout();

  // passport-jwt
  res.clearCookie('dnfUser');
  res.redirect('/');
})

module.exports = router;