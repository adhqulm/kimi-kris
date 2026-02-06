/* floating hearts */
(function floatingHearts(){
  const box = document.getElementById('hearts');
  function spawnHeart(){
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 10 + Math.random()*12;
    h.style.width = h.style.height = size+'px';
    h.style.left = Math.random()*100 + 'vw';
    h.style.bottom = '-20px';
    h.style.animation = `rise ${4+Math.random()*3}s linear forwards`;
    box.appendChild(h);
    setTimeout(()=>h.remove(),7000);
  }
  setInterval(spawnHeart,600);
})();

/* candle interactivity */
const candle = document.getElementById('candle');
const smokeBox = document.getElementById('smoke');
let canBlow = false;

(function checkDate(){
  const note = document.getElementById('note');
  const now = new Date();
  now.setHours(0);
  now.setMilliseconds(0);
  now.setMinutes(0); 
  now.setSeconds(0);
  const specialDate = new Date(now.getFullYear(), 7, 17); 
  if(now.getTime() === specialDate.getTime()){
        canBlow = true;
        note.innerText = "blow out the candle, babe ♥";
  }
  else{
    canBlow = false;
    note.innerText = "not today :(";
    candle.classList.toggle('blown')
    return;
  }
})();

// (async function changeQuote() {
//   const proxyUrl = 'https://corsproxy.io/?';
//   const targetUrl = 'https://zenquotes.io/api/quotes/';
//   const response = await fetch(proxyUrl + targetUrl);
//   const quote = await response.json();
//   const quoteBox = document.getElementById('i-love-kristina');
//   quoteBox.innerText = quote[0].q;
// })();

candle.addEventListener('click', () => {
  if(!canBlow) return;
  candle.classList.toggle('blown');
  if(candle.classList.contains('blown')){
    for(let i=0;i<5;i++){
      setTimeout(()=>{
        const s = document.createElement('span');
        smokeBox.appendChild(s);
        setTimeout(()=>s.remove(),2000);
      }, i*300);
    }
  }
});

/* confetti */
window.addEventListener('load', () => {
  if(!canBlow){
    return;
  }
  confetti({
    particleCount: 200,
    spread: 90,
    origin: { y: 0.6 }
  });
});

/* ==== relationship counter ==== */
const START_DATE = new Date(2025, 7, 17); // 17 Aug 2025

function diffYMD(from, to){
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();

  if (d < 0) {
    const prevMonthLastDay = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    d += prevMonthLastDay;
    m -= 1;
  }
  if (m < 0) {
    m += 12;
    y -= 1;
  }
  return {years:y, months:m, days:d};
}

function updateCounter(){
  const now = new Date();
  const {years, months, days} = diffYMD(START_DATE, now);
  document.getElementById('counter').innerHTML =
    `<i>${years} years, ${months} months, and ${days} days together!</i>`;
}

function scheduleDailyUpdate(){
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 50);
  setTimeout(() => {
    updateCounter();
    scheduleDailyUpdate();
  }, nextMidnight - now);
}

updateCounter();
scheduleDailyUpdate();