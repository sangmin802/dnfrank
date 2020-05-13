import api from './api.js';
import { path } from './location.js';

// webpack용 css 연결
// import '../css/main.css';
// import '../css/reset.css';

// 해결필요
// 1. 검색등 (fetch작업중)일때는 검색 못하게 해야할듯

class Main {
  constructor(){
    // 로그인 여부
    const loginToken = document.cookie.includes('dnfUser=');
    const searchForm = document.querySelector('.searchForm');
    const signUp = document.querySelector('.signUp');
    const signIn = document.querySelector('.signIn');

    this.userDetail = document.querySelector('.userDetail');
    this.btnWrap = document.querySelector('.btnContent');
    this.userContent = document.querySelector('.userContent');
    this.perData = 40;
    this.data = null;
    this.userObj = null;

    // 로그인 상태 파악 후, 출력물
    if(!loginToken){
      signUp.addEventListener('click', () => {
        path('/signUp')
      })
      signIn.addEventListener('click', () => {
        path('/signIn')
      })
    }else{
      // 메인케릭터 정보 입력
      this.setMainCharInfo();
    }

    // 입력된 유저 검색
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.userDetail.innerHTML = '';
      this.getSearchedData(e)
      .then(_callback => {
        // 유저 검색 이후 메소드
        _callback();
      });
    });
  }

  setMainCharInfo(){
    const mainChar = document.querySelector('.mainChar');
    if(mainChar.textContent.includes('메인캐릭터를 설정하세요')){

    }else{
      const mainCharId = mainChar.children[0].dataset.id;
      const mainCharServer = mainChar.children[0].dataset.server;
      fetch(`https://cors-anywhere.herokuapp.com/https://api.neople.co.kr/df/servers/${mainCharServer}/characters/${mainCharId}?apikey=${api}`)
      .then(res => res.json())
      .then(data => {
        mainChar.children[0].innerHTML = `
          <div class="mainCharImg">
            <img src="https://img-api.neople.co.kr/df/servers/${mainCharServer}/characters/${mainCharId}?zoom=3" alt="${data.characterName}">
          </div>
          <div class="mainCharRoot">Lv${data.level} ${data.characterName}</div>
          <div class="mainCharClass">${data.jobName} ${data.jobGrowName}</div>        
        `;

        document.querySelector('.mainCharImg').addEventListener('click', () => {
          this.getUserDetailData(mainCharId,mainCharServer);
        })
      })
    }
  }

  getSearchedData(e){
    // cors에러 발생. 서로 다른 도메인간 교차요청이기때문에, 보안상 막힌건데 res.header에서 교차요청 허가해주는것은 api를 제공하는 서버에서 설정해야하는것이라, 다른 방법이없다.
    // 1. Proxy서버를 이용한다.
    // 2. Proxy서버를 개설한다.

    // 본래, 타이핑을 치면 검색리스트 출력되도록 하려했는데, proxy서버에서 한번 거쳐오는거라 지연되는게 있어, 그냥 검색누르면 나오는걸로
    return new Promise((resolve, reject) => {
      const name = e.target.searchName.value; 
      const url = `https://cors-anywhere.herokuapp.com/https://api.neople.co.kr/df/servers/all/characters?characterName=${name}&limit=200&wordType=full&apikey=${api}`;
      this.userContent.innerHTML='<div class="loading">Loading...</div>'
      this.btnWrap.innerHTML = '';
      fetch(url)
      .then(res => res.json())
      .then(({rows}) => {
        this.data = rows;
        const btnLength = Math.ceil(this.data.length / this.perData);
        this.createBtn(btnLength);
        // 초기 출력은 무조건 첫번째
        this.createUser(1);
        return resolve(this.afterCreated);
      })
    })
  }

  // 유저 검색 이후 실행 메소드
  afterCreated = () => {
    const chooseMainChar = document.querySelectorAll('.chooseMainChar');
    const searchedUser = document.querySelectorAll('.searchedUser');
    let uid = null;

    if(document.querySelector('.mainCharInfo')){
      uid = document.querySelector('.mainCharInfo').dataset.uid
    }else if(document.querySelector('.noMainCharInfo')){
      uid = document.querySelector('.noMainCharInfo').dataset.uid;
    }
    // 메인 캐릭터 설정
    Array.from(chooseMainChar).forEach(res => {
      res.addEventListener('click', () => {
        const {dataset : {id, server}} = res;
        fetch('/mainChar/chooseMainChar', {
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({id, server, uid})
        })
        .then(res => res.json())
        .then(({result}) => {
          if(result){
            path('/');
          }
        })
      });
    });

    // 검색된 유저 상세보기
    Array.from(searchedUser).forEach(user => {
      user.addEventListener('click', (e) => {
        const {dataset : {id, server}} = user.children[0];
        this.getUserDetailData(id, server);
      })
    })
  };

  // 유저 정보 출력하기
  getUserDetailData(_id, _server){
    this.reqDetailuser(_id, _server)
    .then(user => {
      // 능력치 장비 아바타
      const userUrl = `https://img-api.neople.co.kr/df/servers/${_server}/characters/${_id}?zoom=3`

      this.userContent.innerHTML = '';
      this.btnWrap.innerHTML = '';
      this.userDetail.innerHTML = `
      <div class="userItemLeft">
        <div class="userItem SHOULDER"></div>
        <div class="userItem JACKET"></div>
        <div class="userItem PANTS"></div>
        <div class="userItem WAIST"></div>
        <div class="userItem SHOES"></div>
      </div>
      <img class="sUserImg" src="${userUrl}">
      <div class="userItemRight">
        <div class="userItem WEAPON"></div>
        <div class="userItem TITLE"></div>
        <div class="userItem RING"></div>
        <div class="userItem AMULET"></div>
        <div class="userItem SUPPORT"></div>
        <div class="userItem WRIST"></div>
        <div class="userItem EARRING"></div>
        <div class="userItem MAGIC_STON"></div>
      </div>
      `;
      this.userObj = [...user];
    })
    .then(() => {
      const {equipment} = this.userObj[1];
      this.fillingItem(this.userDetail.childNodes, equipment);
    })
    .then(() => { 
      this.userDetailNavigation();
      this.setUserInform('status');
    });
  }

  // 네비게이션바
  userDetailNavigation(){
    this.userContent.innerHTML = `
      <div class="navigation">
        <div data-nav="status" class="navBtn navBtnTarget">능력치</div>
        <div data-nav="equipment" class="navBtn">장비</div>
        <div data-nav="avatar" class="navBtn">아바타</div>
      </div>
      <div class="detailContentWrap"></div>
    `

    const nav = document.querySelectorAll('.navBtn');
    [...nav].forEach(res => {
      res.addEventListener('click', (e) => {
        const navValue = e.target.dataset.nav;
        [...nav].forEach(btn => {
          btn.classList.remove('navBtnTarget');
        })
        res.classList.add('navBtnTarget');
        this.setUserInform(navValue);
      })
    })
  }

  // 장비 세부옵션
  setUserInform(type){
    const wrap = document.querySelector('.detailContentWrap');
    wrap.innerHTML = '';
    const basicUrl = 'https://img-api.neople.co.kr/df/items/';
    switch(type){
      case 'status' : { // 능력치
        const {status} = this.userObj[0];
        if(!status){
          wrap.innerHTML = '조회할 수 없습니다.';
          return;
        }
        status.forEach(({name, value}) => {
          wrap.innerHTML += `
          <div class="dStatusInfo">
            <div class="dStatusName">${name}</div>
            <div class="dStatusValue">${value}</div>
          </div>          
          `
        })
      }break;
      case 'equipment' : { // 장비
        const {equipment} = this.userObj[1];
        equipment.forEach(({itemAvailableLevel, itemId, itemName, reinforce, itemRarity, itemType, itemTypeDetail}) => {
          wrap.innerHTML +=  `
          <div class="dItemInfo">
            <div class="dItemImg">
              <span class="dItemLevel">Lv${itemAvailableLevel}</span>
              <img src="${basicUrl+itemId}" alt="${itemName}">
              <span class="dItemReinforce">+${reinforce}</span>
            </div>
            <div class="dItemRarity dItem">${itemRarity}</div>
            <div class="dItemType dItem">${itemType}</div>
            <div class="dItemTypeDetail dItem">${itemTypeDetail}</div>
            <div class="dItemName dItem">${itemName}</div>
          </div>
          `
        })
      }break;
      case 'avatar' : { // 아바타
        const {avatar} = this.userObj[2];
        wrap.innerHTML = `
        <div class="dAvatarInfo">
          <div class="dAvatar dAvatarHEADGEAR">No HEADGEAR Avatar</div>
          <div class="dAvatar dAvatarHAIR">No HAIR Avatar</div>
          <div class="dAvatar dAvatarFACE">No FACE Avatar</div>
          <div class="dAvatar dAvatarJACKET">No JACKET Avatar</div>
          <div class="dAvatar dAvatarPANTS">No PANTS Avatar</div>
          <div class="dAvatar dAvatarSHOES">No SHOES Avatar</div>
          <div class="dAvatar dAvatarBREAST">No BREAST Avatar</div>
          <div class="dAvatar dAvatarWAIST">No WAIST Avatar</div>
          <div class="dAvatar dAvatarSKIN">No SKIN Avatar</div>
          <div class="dAvatar dAvatarAURORA">No AURORA Avatar</div>
        </div>
        `
        avatar.forEach(({slotId, slotName, itemId, itemName, itemRarity, clone, optionAbility, emblems}) => {
          const target = document.querySelector(`.dAvatar${slotId}`);
          if(itemId){
            let img = null;
            let emblem = '';

            if(clone.itemId){
              img = `
                <img src="${basicUrl+itemId}" alt="${itemName}" class="basicAvatar">
                <img src="${basicUrl+clone.itemId}" alt="${clone.itemName}" class="cloneAvatar">
              `
            }else{
              img = `
                <img src="${basicUrl+itemId}" alt="${itemName}" class="basicAvatar">
              `
            };

            if(emblems.length !== 0){
              emblems.forEach(({slotColor, itemName, itemRarity}) => {
                emblem = emblem + `
                  <div class="emblem">
                    <div class="emblemColor">${slotColor}</div>
                    <div class="emblemName">${itemName}</div>
                    <div class="emblemRairity">${itemRarity}</div>
                  </div>
                `
              })
            }else{
              emblem = 'No Emblems';
            }

            target.innerHTML = `
            <div class="dAvatarImg">
              ${img}
            </div>
            <div class="dAvatarRarity dAvatarParts">${itemRarity}</div>
            <div class="dAvatarName dAvatarParts">${slotName}</div>
            <div class="dAvatarStatus dAvatarParts">${optionAbility}</div>
            <div class="dAvatarEmblems dAvatarParts">${emblem}</div>
            `
          }
        })
      }break;
    }
  }


  // 총 유저 갯수 확인 후, 페이지네이션 생성
  createBtn(_btnLength){
    this.btnWrap.innerHTML = '';
    for(let i=1; i<_btnLength+1; i++){
      this.btnWrap.innerHTML += `
        <span class="btn">${i}</span>
      `;
    };
    const allBtn = document.querySelectorAll('.btn');
    Array.from(allBtn).forEach((res, index) => {
      res.addEventListener('click', () => {
        window.scrollTo({
          top : 0,
          left : 0,
        });
        // 이후 페이지네이션 클릭시 이후 정보 출력
        this.createUser(index+1);
      });
    })
  }

  // 검색된 유저 출력 40개단위
  createUser(_num){
    const immuData = Array.from(this.data);
    const value = immuData.length/this.perData;
    const rest = immuData.length%this.perData;
    let filteredData = null;
    if(rest === 0){
      filteredData = immuData.splice((_num-1)*this.perData, this.perData*_num);
    }else{
      if(_num === value){
        filteredData = immuData.splice((_num-1)*this.perData, rest);
      }else{
        filteredData = immuData.splice((_num-1)*this.perData, this.perData*_num);
      }
    }
    this.userContent.innerHTML = '';
    filteredData.forEach(res => {
      this.userContent.innerHTML += `
      <div class="searchedUser">
        <div class="chooseMainChar" data-id=${res.characterId} data-server=${res.serverId}>♥</div>
        <div class="searchedUserImg">
          <img src="https://img-api.neople.co.kr/df/servers/${res.serverId}/characters/${res.characterId}?zoom=1" alt="${res.characterName}">
        </div>
        <div class="searchedUserDesc">
          <div class="searchedUserServer">${this.serverIdtoKorean(res.serverId)}</div>
          <div class="searchedUserName">${res.characterName}</div>
        </div>
      </div>
      `
    })
  }

  // 아이템 채우기.
  fillingItem = (child, _equi) => {
    Array.from(child).forEach(chi => {
      if(chi.nodeType !== 3){
        if(Array.from(chi.classList).includes('userItem')){
          const itemType = chi.classList[1];
          const basicUrl = 'https://img-api.neople.co.kr/df/items/';
          const matchdArr = _equi.find(eq => {
            if(eq.slotId === itemType){
              return eq;
            }else{
              return null;
            }
          })
          if(matchdArr){
            chi.innerHTML=`<img src="${basicUrl+matchdArr.itemId}">` // 있는 아이템일 경우
          }else{
            chi.innerHTML=`<span><b>${itemType}</b></span>` // 없는 아이템일 경우
          }
        }else{
          this.fillingItem(chi.childNodes, _equi);
        }
      }
    })
  }

  // 서버명 한글로 변환
  serverIdtoKorean(_serverId){
    const serverEng = ['anton', 'bakal', 'cain', 'casillas', 'diregie', 'hilder', 'prey', 'siroco'];
    const serverKor = ['안톤', '바칼', '카인', '카시야스', '디레지에', '힐더', '프레이', '시로코'];
    const index = serverEng.indexOf(_serverId);
    return serverKor[index];
  }

  // 세부정보 요청 유저
  reqDetailuser = (_id, _server) => {
    return new Promise(resolve => {
      const urlArr = [
        // 장비가 너~ 무 많아서 몇개만 추림.
        'status', // 능력치
        'equip/equipment', // 장비
        'equip/avatar', // 아바타
      ]
      Promise.all(
        urlArr.map(url => {
          const fullUrl = `https://cors-anywhere.herokuapp.com/https://api.neople.co.kr/df/servers/${_server}/characters/${_id}/${url}?apikey=${api}`
          return fetch(fullUrl)
          .then(res2 => res2.json())
        })
      ).then(data => {
        return resolve(data);
      })
    })
  }

};

new Main();