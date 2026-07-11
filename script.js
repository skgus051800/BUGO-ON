JAVA

const firebaseConfig = {
  apiKey: "AIzaSyBcjSuTkJ9Y0CJ0ENS7gaTWmHJTs6BhVtw",
  authDomain: "bugo-on-433d8.firebaseapp.com",
  projectId: "bugo-on-433d8",
  storageBucket: "bugo-on-433d8.firebasestorage.app",
  messagingSenderId: "893288575370",
  appId: "1:893288575370:web:118bb1a17fb74466ccd873",
  measurementId: "G-G3WFCDY19X"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPanel = document.getElementById("adminPanel");

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const scheduleList = document.getElementById("scheduleList");

const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const addScheduleBtn = document.getElementById("addScheduleBtn");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupSubject = document.getElementById("popupSubject");
const popupDate = document.getElementById("popupDate");
const popupContent = document.getElementById("popupContent");
const closePopup = document.getElementById("closePopup");
const timetable = document.getElementById("timetable");

let currentDate = new Date();
let schedules = [];
let isAdmin = false;
let timetableData = {
  mon: ["", "", "", "", "", "", ""],
  tue: ["", "", "", "", "", "", ""],
  wed: ["", "", "", "", "", "", ""],
  thu: ["", "", "", "", "", "", ""],
  fri: ["", "", "", "", "", "", ""]
};

function formatDate(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function renderCalendar() {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthTitle.textContent = `${year}년 ${month + 1}월`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateString = formatDate(year, month, day);

    const dayBox = document.createElement("div");
dayBox.className = "day";

const today = new Date();

if(
  year === today.getFullYear() &&
  month === today.getMonth() &&
  day === today.getDate()
){
  dayBox.classList.add("today");
}

    const dayNumber = document.createElement("div");
    dayNumber.className = "day-number";
    dayNumber.textContent = day;
    dayBox.appendChild(dayNumber);

    const daySchedules = schedules.filter(item => item.date === dateString);

    daySchedules.forEach(item => {

      const event = document.createElement("div");
      event.className = "event";
      const subjectColors = {
  "국어": "#FFD8BE",     // 파스텔 살구
  "영어": "#FFD6E7",     // 파스텔 핑크
  "수학": "#CFE8FF",     // 파스텔 하늘
  "과학": "#D8F5D0",     // 파스텔 민트
  "한국사": "#E6D8FF",   // 파스텔 보라
  "사회": "#FFF4B8",     // 파스텔 노랑
  "정보": "#D6F4F4",     // 파스텔 청록
  "기타": "#EEEEEE"      // 회색
};

event.style.backgroundColor =
  subjectColors[item.subject] || subjectColors["기타"];

      // 제목
      const subjectIcons = {
  "국어": "📖",
  "영어": "🔤",
  "수학": "📘",
  "과학": "🧪",
  "한국사": "🏛",
  "사회": "🌍",
  "정보": "💻"
};

const icon = subjectIcons[item.subject] || "📌";

const title = document.createElement("div");
title.textContent = `${icon} ${item.title}`;
title.style.wordBreak = "keep-all";
title.style.fontSize = "8px";
title.style.lineHeight = "1.1";
title.style.fontWeight = "500";

event.appendChild(title);

      // D-Day 계산
      const today = new Date();
      today.setHours(0,0,0,0);

      const target = new Date(item.date);
      target.setHours(0,0,0,0);

      const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

      const dday = document.createElement("div");

      if (diff === 0) {
        dday.textContent = "🔥 TODAY";
        dday.style.color = "red";
      } else if (diff > 0) {
        dday.textContent = `D-${diff}`;

        if (diff <= 3) {
          dday.style.color = "red";
        } else if (diff <= 7) {
          dday.style.color = "orange";
        } else {
          dday.style.color = "#2346a0";
        }

      } else {
        dday.textContent = "✔ 완료";
        dday.style.color = "gray";
      }

      dday.style.fontWeight = "bold";
      dday.style.fontSize = "7px";

      event.appendChild(dday);

      event.onclick = () => {
        openPopup(item);
      };

      dayBox.appendChild(event);

    });

    calendar.appendChild(dayBox);
  }
}

function renderScheduleList() {
  scheduleList.innerHTML = "";

  schedules.forEach(item => {
    if (!item.title && !item.subject && !item.date && !item.content) {
  return;
}
    const div = document.createElement("div");
    div.className = "schedule-item";

    const title = document.createElement("h3");
    title.textContent = item.title || "제목 없음";

    const subject = document.createElement("p");
    subject.textContent = "과목: " + (item.subject || "없음");

    const date = document.createElement("p");
    date.textContent = "날짜: " + (item.date || "없음");

    const content = document.createElement("p");
    content.textContent = "내용: " + (item.content || "내용 없음");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "삭제";

    deleteBtn.onclick = async () => {
      if (confirm("이 일정을 삭제할까요?")) {
        await db.collection("schedules").doc(item.id).delete();
        alert("삭제되었습니다.");
      }
    };

    div.appendChild(title);
    div.appendChild(subject);
    div.appendChild(date);
    div.appendChild(content);
    if (isAdmin) {
  div.appendChild(deleteBtn);
}

    scheduleList.appendChild(div);
  });
}

function renderDday(){

  const ddayList = document.getElementById("ddayList");

  ddayList.innerHTML="";

  const today = new Date();
  today.setHours(0,0,0,0);

const upcoming = schedules
  .filter(item => {
    const date = new Date(item.date);
    date.setHours(0,0,0,0);
    return date >= today;
  })
  .sort((a,b)=> new Date(a.date)-new Date(b.date))
  .slice(0,5);


  upcoming.forEach(item=>{

    const target = new Date(item.date);
    target.setHours(0,0,0,0);

    const diff = Math.ceil(
      (target-today)/(1000*60*60*24)
    );

    let text="";

    if(diff===0){
      text="🔥 TODAY";
    }
    else if(diff>0){
      text=`D-${diff}`;
    }
    else{
      text="완료";
    }


    ddayList.innerHTML += `
      <div class="dday-item">
        <span>${item.title}</span>
        <span class="dday-date">${text}</span>
      </div>
    `;

  });

}

function renderTimetable() {

  const rows = document.querySelectorAll("#timetable tbody tr");

  const days = ["mon","tue","wed","thu","fri"];

  rows.forEach((row, rowIndex)=>{

    const cells = row.querySelectorAll("td");

    days.forEach((day, dayIndex)=>{

      const cell = cells[dayIndex + 1];

      cell.textContent = timetableData[day][rowIndex] || "";

      cell.onclick = async () => {

  if (!isAdmin) return;

  const subject = prompt(
    "과목을 입력하세요",
    timetableData[day][rowIndex] || ""
  );

  if(subject === null) return;

  timetableData[day][rowIndex] = subject;

  cell.textContent = subject;

  await db.collection("settings")
    .doc("timetable")
    .set(timetableData);

};

    });

  });

}

function loadTimetable(){

  db.collection("settings")
    .doc("timetable")
    .get()
    .then(doc => {

      if(doc.exists){

        const data = doc.data();

        timetableData = {
          mon: data.mon || ["","","","","","",""],
          tue: data.tue || ["","","","","","",""],
          wed: data.wed || ["","","","","","",""],
          thu: data.thu || ["","","","","","",""],
          fri: data.fri || ["","","","","","",""]
        };

      }

      renderTimetable();

    });

}

function openPopup(item) {

  popupTitle.textContent = item.title;
  popupSubject.textContent = item.subject;
  popupDate.textContent = item.date;
  popupContent.textContent = item.content || "내용 없음";

  popup.classList.remove("hidden");
}

closePopup.onclick = () => {
  popup.classList.add("hidden");
};

function loadSchedules() {
  db.collection("schedules").onSnapshot(snapshot => {
    schedules = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    renderCalendar();
    renderScheduleList();
    renderDday();
  });
}

loginBtn.onclick = async () => {
  const email = prompt("관리자 이메일을 입력하세요.");
  const password = prompt("비밀번호를 입력하세요.");

  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert("관리자로 로그인되었습니다.");
  } catch (error) {
    alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
  }
};

logoutBtn.onclick = async () => {
  await auth.signOut();
};

auth.onAuthStateChanged(user => {
  if (user) {
    isAdmin = true;
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    adminPanel.classList.remove("hidden");
  } else {
    isAdmin = false;
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    adminPanel.classList.add("hidden");
  }

  renderScheduleList();
});

addScheduleBtn.onclick = async () => {
  const title = document.getElementById("titleInput").value;
  const subject = document.getElementById("subjectInput").value;
  const date = document.getElementById("dateInput").value;
  const content = document.getElementById("contentInput").value;

  if (!title || !subject || !date) {
    alert("제목, 과목, 날짜는 꼭 입력해야 합니다.");
    return;
  }

  await db.collection("schedules").add({
    title,
    subject,
    date,
    content,
    createdAt: new Date()
  });

  document.getElementById("titleInput").value = "";
  document.getElementById("subjectInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("contentInput").value = "";

  alert("일정이 추가되었습니다.");
};

prevMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

loadSchedules();
loadTimetable();

async function loadMeal(){

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth()+1).padStart(2,"0");
  const day = String(today.getDate()).padStart(2,"0");

  const date = `${year}${month}${day}`;

  const url =
  `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=N10&SD_SCHUL_CODE=C035903&MLSV_YMD=${date}`;

  const response = await fetch(url);
  const data = await response.json();

  const meal = document.getElementById("meal");

  if(!data.mealServiceDietInfo){
    meal.textContent = "오늘 급식 정보가 없습니다.";
    return;
  }

  const meals = data.mealServiceDietInfo[1].row;

  const hour = new Date().getHours();
const minute = new Date().getMinutes();

let targetMeal = "";

if(hour < 8 || (hour === 8 && minute < 30)){
  targetMeal = "조식";
}
else if(hour < 12 || (hour === 12 && minute < 30)){
  targetMeal = "중식";
}
else{
  targetMeal = "석식";
}


let html = "";

meals.forEach(item => {

  if(item.MMEAL_SC_NM !== targetMeal) return;

  let title = "";

  if(item.MMEAL_SC_NM === "조식"){
    title = "🌅 아침";
  }
  else if(item.MMEAL_SC_NM === "중식"){
    title = "🍚 점심";
  }
  else if(item.MMEAL_SC_NM === "석식"){
    title = "🌙 저녁";
  }


  html += `
    <div class="current-meal">
      <h3>${title}</h3>
      <p>${item.DDISH_NM.replaceAll("<br/>","<br>")}</p>
    </div>
  `;

});

  meal.innerHTML = html;

}

loadMeal();
