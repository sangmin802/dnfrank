const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('../../auth/passport.js');
const jwtObj = require('../../auth/jwt.js');
const JWT = require('jsonwebtoken');

const middleWare = require('../../lib/middleware.js');

router.get('/', middleWare.checkToken, (req, res) => {
  res.sendFile(path.join(__dirname+'../../../public/signIn.html'))
})

// passport-session
// router.post('/checkUser', (req, res) => {
//   passport.authenticate('signIn', (err, result, info) => {
//     if(err) throw err;
//     if(!result){
//       return res.json({type : false, info});
//     }else{
//       return req.login(info, (loginErr) => {
//         if(loginErr) throw loginErr;
//         let immUser = {...info};
//         delete immUser.upw;
//         return res.json({type : true, user : immUser});
//       })
//     }
//   })(req, res);
// })

// passport-jwt
router.post('/checkUser', (req, res) => {
  passport.authenticate('signIn', {session : false}, (err, result, info) => {
    if(err) throw err;
    if(!result){
      return res.json({type : false, info});
    }else{
      return req.login(info, {session : false}, (loginErr) => {
        if(loginErr) throw loginErr;
        const priId = info.id
        const token = JWT.sign(priId, jwtObj.secret);
        // const token = JWT.sign(immUser, jwtObj.secret, {
        //   expiresIn : '1m'
        // });
        res.cookie('dnfUser', token);
        return res.json({type : true, priId});
      })
    }
  })(req, res);
})

module.exports = router;