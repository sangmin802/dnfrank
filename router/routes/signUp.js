const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('../../auth/passport.js');
const JWT = require('jsonwebtoken');
const jwtObj = require('../../auth/jwt.js');

const middleWare = require('../../lib/middleware.js');

router.get('/', middleWare.checkToken, (req, res) => {
  res.sendFile(path.join(__dirname+'../../../build/html/signUp.html'))
  // res.sendFile(path.join(__dirname+'../../../public/signUp.html'))
})

// passport-session
// router.post('/signUp_progress', (req, res) => {
//   passport.authenticate('signUp', (err, result, info) => {
//     if(err) throw err;
//     if(!result){
//       return res.json({type : false, info});
//     }else{
//       return req.login(info, (loginErr) => {
//         if(loginErr) throw loginErr;
//         let immUser = {...info};
//         delete immUser.upw;
//         return res.json({type : true, user : immUser});
//       });
//     };
//   })(req, res);
// })

// passport-jwt
router.post('/signUp_progress', (req, res) => {
  passport.authenticate('signUp', {session : false}, (err, result, info) => {
    if(err) throw err;
    if(!result){
      return res.json({type : false, info});
    }else{
      return req.login(info, {session : false}, (loginErr) => {
        if(loginErr) throw loginErr;
        const priId = info.id
        let immUser = {...info};
        delete immUser.upw;
        const token = JWT.sign({priId}, jwtObj.secret);
        // const token = JWT.sign({priId}, jwtObj.secret, {
        //   expiresIn : '1m'
        // });
        res.cookie('dnfUser', token);
        return res.json({type : true, info : immUser});
      });
    };
  })(req, res);
})

module.exports = router;