const express = require('express');
const router = express.Router();

const main = require('./routes/main.js');
const signUp = require('./routes/signUp.js');
const signIn = require('./routes/signIn.js');
const logOut = require('./routes/logOut.js');
const mainChar = require('./routes/mainChar.js');

router.use('/', main)
router.use('/signUp', signUp)
router.use('/signIn', signIn)
router.use('/logOut', logOut)
router.use('/mainChar', mainChar)

module.exports = router;