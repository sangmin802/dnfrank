export default {
  mainChar(data, server, id){
    return `
      <div class="mainCharImg">
        <img src="https://img-api.neople.co.kr/df/servers/${server}/characters/${id}?zoom=3" alt="${data.characterName}">
      </div>
      <div class="mainCharRoot">Lv${data.level} ${data.characterName}</div>
      <div class="mainCharClass">${data.jobName} ${data.jobGrowName}</div>        
    `;
  },
  userItem(userUrl){
    return `
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
    `
  },
  navBtn(){
    return `
      <div class="navigation">
        <div data-nav="status" class="navBtn navBtnTarget">능력치</div>
        <div data-nav="equipment" class="navBtn">장비</div>
        <div data-nav="avatar" class="navBtn">아바타</div>
      </div>
      <div class="detailContentWrap"></div>
    `
  },
  equipment(itemAvailableLevel, itemId, itemName, reinforce, itemRarity, itemType, itemTypeDetail, basicUrl){
    return `
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
  },
  avatar(){
    return `
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
  },
  searchedUser(res){
    return `
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
  },
  // 서버명 한글로 변환
  serverIdtoKorean(_serverId){
    const serverEng = ['anton', 'bakal', 'cain', 'casillas', 'diregie', 'hilder', 'prey', 'siroco'];
    const serverKor = ['안톤', '바칼', '카인', '카시야스', '디레지에', '힐더', '프레이', '시로코'];
    const index = serverEng.indexOf(_serverId);
    return serverKor[index];
  }
}