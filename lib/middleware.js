const express = require('express');
const app = express();
const JWT = require('jsonwebtoken');
const jwtObj = require('../auth/jwt.js');

module.exports = {
  checkToken : (req, res, next) => {
    const token = req.cookies.dnfUser;
    if(token){
      JWT.verify(token, jwtObj.secret, (decodedErr, decoded) => {
        if(decodedErr){
          res.clearCookie('dnfUser');
          next();
        }else{
          res.redirect('/');
        }
      })
    }else{
      next();
    }
  }
}