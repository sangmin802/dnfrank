const express = require('express');
const router = express.Router();
const JWT = require('jsonwebtoken');
const jwtObj = require('../../auth/jwt.js');
const db = require('../../db/db.js');

router.get('/', (req, res) => {
  // passport-session
  // res.render('main', {user : req.user})

  // passport-jwt
  const token = req.cookies.dnfUser;
  let user = null;
  if(token){
    jwtVerfiy(token)
    .then(_user => {
      res.render('main', {user : _user})
    })
    .catch(_user => {
      // 만기되었을 경우, 쿠키삭제후 로그인화면으로 이동
      res.clearCookie('dnfUser');
      res.render('main', {user : _user})
    })
  }else{
    res.render('main', {user : user})
  }
})

jwtVerfiy = (_token) => {
  return new Promise((resolve, reject) => {
    let user = null;
    if(_token){
      JWT.verify(_token, jwtObj.secret, (decodedErr, decoded) => {
        if(decodedErr){
          user = null;
          // 만기된 토큰(쿠키) 시 reject 실행
          return reject(user);
        }else{
          priId = decoded;
          db.query('select * from user where id = ?', [priId], (err, result) => {
            if(err) throw err;
            const immUser = {...result[0]};
            delete immUser.upw;
            // 사용 가능한 토큰(쿠키) 시 해독 후 resolve 실행
            return resolve(immUser);
          });
        };
      });
    };
  })
}
module.exports = router;