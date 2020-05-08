import { path } from './location.js';

class SignUp {
  constructor(){
    const signUp = document.querySelector('.signUp');
    const alert = document.querySelector('.alert');

    signUp.addEventListener('submit', (e) => {
      e.preventDefault();
      const uid = e.target.uid.value;
      const upw = e.target.upw.value;
      fetch('/signUp/signUp_progress', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({uid, upw})
      })
      .then(res => res.json())
      .then(user => {
        if(!user.type){
          alert.innerHTML = user.info.reason;
        }else{
          path('/');
        }
      });
    });
  };
};

new SignUp();