const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/db.js');

// passport middleware
// signIn
passport.use('signIn', new LocalStrategy({
  usernameField : 'uid',
  passwordField : 'upw'
}, (uid, upw, done) => {
  db.query(`select * from user where uid = ?`, [uid], (err, user) => {
    if(err) throw err;
    if(!user[0]){
      return done(null, false, {reason : '등록되지 않은 아이디 입니다.'})
    }else{
      if(upw === user[0].upw){
        return done(null, true, user[0]);
      }else{
        return done(null, false, {reason : '비밀번호가 틀렸습니다.'});
      };
    };
  });
}));

// signUp
passport.use('signUp', new LocalStrategy({
  usernameField : 'uid',
  passwordField : 'upw',
}, (uid, upw, done) => {
  db.query(`select * from user where uid = ?`, [uid], (err, user) => {
    if(err) throw err;
    if(!user[0]){
      db.query('insert into user (uid, upw) values (? ,?)', [uid, upw], (insertErr, result) => {
        if(insertErr) throw insertErr;
        db.query('select * from user where id = ?', [result.insertId], (selectErr, user) => {
          if(selectErr) throw selectErr;
          return done(null, true, user[0]);
        })
      })
    }else{
      return done(null, false, {reason : '이미 사용중인 아이디 입니다.'});
    }
  })
}))

// passport-session일 경우만
// serializeUser, deserializeUser
// passport.serializeUser((user, done) => {
//   return done(null, user.id);
// })

// passport.deserializeUser((id, done) => {
//   db.query(`select * from user where id = ?`, [id], (err, result) => {
//     if(err) throw err;
//     if(result[0]){
//       let immUser = {...result[0]};
//       delete immUser.upw;
//       return done(null, immUser)
//     }else{
//       return;
//     }
//   })
// })

module.exports = passport;