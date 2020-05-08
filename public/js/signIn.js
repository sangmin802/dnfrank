import { path } from './location.js';

class SignIn {
  constructor(){
    const logIn = document.querySelector('.logIn');
    const alert = document.querySelector('.alert');

    logIn.addEventListener('submit', (e) => {
      e.preventDefault();
      const uid = e.target.uid.value;
      const upw = e.target.upw.value;
      fetch('/signIn/checkUser', {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({uid, upw})
      })
      .then(res => res.json())
      .then(data => {
        const {type, info} = data;
        if(!type){
          alert.innerHTML = info.reason;
        }else{
          path('/');
        }
      })
    })
  }
}

new SignIn();