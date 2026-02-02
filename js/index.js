var now = new Date();
var year = now.getFullYear();
var month = now.getMonth() + 1;
var date = now.getDate();

const datesContainerDiv = document.querySelectorAll(".dates.container")[0];
const dateBoxDiv = document.querySelectorAll(".date.box")[0];

const setCalendar = (year, month) => {
    
    // 년월 표시
    const titleyearmonthDiv = document.getElementsByClassName("yearmonth")[0];
    const titleyearmonthDiv2 = document.getElementsByClassName("year-month")[0];
    
    titleyearmonthDiv.innerHTML = `${year}.${String(month).padStart(2, '0')}`;
    titleyearmonthDiv2.innerHTML = `${year}.${String(month).padStart(2, '0')}`;
    
    // 해당 월의 1일이 무슨 요일인지, 해당 월의 마지막 날짜가 며칠인지 : 다음달의 1일 하루 전날(0일)
    var firstDateDay = new Date(year, month - 1, 1).getDay();
    var lastDate = new Date(year, month, 0).getDate();

    // 원래 있던 달력의 .date.item clear
    datesContainerDiv.replaceChildren();

    // .date.item{$} * lastDate
    // for 1 ~ lastDate
    for(let date=1; date<=lastDate; date++) {
        let dateItemDiv = document.createElement("div");
        dateItemDiv.classList.add("date"); 
        dateItemDiv.classList.add("item"); 
        dateItemDiv.innerHTML = date; 

        // 오늘 날짜 표시
        if (year === now.getFullYear() && month === (now.getMonth()+1) && date === now.getDate()) {
            dateItemDiv.classList.add("today");
        }

        // HTML에 .dates.container 자식으로 넣기
        datesContainerDiv.appendChild(dateItemDiv);
    }

    // 1일을 firstDateDay로 옮기기 5 -> 6
    // .dates.container의 자식 중 첫째자식(1일) style-grid-column-start: 6 (9월달의경우)
    let firstDateDiv = datesContainerDiv.firstElementChild;
    // CSS { grid-column-start: firstDateDay + 1; }
    firstDateDiv.style.gridColumnStart = firstDateDay + 1;

    // 토요일은 파랑색으로
    let saturdayDivs = datesContainerDiv.querySelectorAll(`.date.item:nth-child(7n+${7-firstDateDay})`);
    for (let dateItem of saturdayDivs) {
        dateItem.style.color = "blue";
    }

    // 일요일은 빨강색으로
    let sundayDivs = datesContainerDiv.querySelectorAll(`.date.item:nth-child(7n+${(8-firstDateDay)%7})`);
    for (let dateItem of sundayDivs) {
        dateItem.style.color = "red";
    }

}

const setMainCalendar = (year, month) => {
    dateBoxDiv.replaceChildren();

    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();

    // 빈칸
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.classList.add("date-item");
        dateBoxDiv.appendChild(empty);
    }

    // 날짜
    for (let d = 1; d <= lastDate; d++) {
        const cell = document.createElement("div");
        cell.classList.add("date-item");

        const dayIndex = (firstDay + d - 1) % 7;

        // 요일 색상
        if (dayIndex === 0) {
            cell.style.color = "red";   // 일요일
        } else if (dayIndex === 6) {
            cell.style.color = "blue";  // 토요일
        }

        cell.innerHTML = `<div class="date-number">${d}</div>`;

        // 오늘 표시
        if (
            year === now.getFullYear() &&
            month === now.getMonth() + 1 &&
            d === now.getDate()
        ) {
            cell.style.background = "#e8f0fe";
        }

        dateBoxDiv.appendChild(cell);
    }
};

setCalendar(year, month);
setMainCalendar(year, month);

// 이전달 아이콘 클릭 시 캘린더 변경
const leftDiv = document.getElementsByClassName("left")[0];
const lefDiv = document.getElementsByClassName("lef")[0];
leftDiv.onclick = () => {
    month--;
    if(month == 0) {
        year--;
        month = 12;
    }
    setCalendar(year, month);
    setMainCalendar(year, month);
}
lefDiv.onclick = () => {
    month--;
    if(month == 0) {
        year--;
        month = 12;
    }
    setCalendar(year, month);
    setMainCalendar(year, month);
}

// 이후달 아이콘 클릭 시 캘린더 변경
const rightDiv = document.getElementsByClassName("right")[0];
const rigDiv = document.getElementsByClassName("rig")[0];
rightDiv.onclick = () => {
    month++;
    if(month == 13) {
        year++;
        month = 1;
    }
    setCalendar(year, month);
    setMainCalendar(year, month);
}
rigDiv.onclick = () => {
    month++;
    if(month == 13) {
        year++;
        month = 1;
    }
    setCalendar(year, month);
    setMainCalendar(year, month);
}

// 이번달/Today 텍스트 클릭 시 이번달로 이동
const thismonthDiv = document.getElementsByClassName("yearmonth")[0];
const thismonthDiv2 = document.getElementById("dday");
thismonthDiv.onclick = () => {
    now = new Date();
    year = now.getFullYear();
    month = now.getMonth()+1;
    setCalendar(year, month);
    setMainCalendar(year, month);   
}
thismonthDiv2.onclick = () => {
    now = new Date();
    year = now.getFullYear();
    month = now.getMonth()+1;
    setCalendar(year, month);
    setMainCalendar(year, month);
}

const menuIcon = document.querySelector('.menu i');
const navCalendar = document.getElementById('nav-calendar');

menuIcon.onclick = () => {
    navCalendar.classList.toggle('hidden');
}

const eventAddBtn = document.getElementById('event-add');
eventAddBtn.onclick = () => {
    window.location.href = 'html/eventAdd.html';
}

dateBoxDiv.onclick = () => {
    window.location.href = 'html/eventAdd.html';
} 