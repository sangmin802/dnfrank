# dnfrank (Vanila JavaScript)  
* 네오플 Open API를 활용한 유저 검색기능  
  * RESTful API 활용  
  * 다른 도메인 || 포트로 인한 CORS ERROR -> 오픈 프록시 서버 활용(보안상 비추천)  
* Node.js + MySQL 연동을 통한 회원가입, 로그인 기능  
  * 로그인 || 회원가입 passport활용  
  * JWT, Session 둘 다 구현되어있음. 현재 적용되있는것은 JWT방식. Session은 주석처리  
* Node.js Express를 통한 개인서버  
* webpack 적용 예정    
* !db.js, apikey.js는 gitignore로 제외하였음.