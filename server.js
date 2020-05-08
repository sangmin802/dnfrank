const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./router/routes.js');
const session = require('express-session');
const sessionSet = require('./auth/sessionset.js');
const passport = require('passport');
const app = express();
const port = 3000;
const db = require('./db/db.js');
db.connect();

app.set('view engine', 'ejs');

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); // 뒤로가기 버튼을 눌렀을 때, 캐시가아닌 reload를 하도록 함. (path를 정상적으로 읽고 작동함)
  next();
})
app.use(cookieParser());
// session 셋팅 순서가 매우중요. session 셋팅이 맨먼저
// app.use(session({...sessionSet}));
app.use(passport.initialize());
// app.use(passport.session());
app.use(router);

app.listen(port, () => {
  console.log(`Server is connected on port ${port}!`);
})