const now = new Date();

let sideYear = now.getFullYear();
let sideMonth = now.getMonth() + 1;

let mainYear = sideYear;
let mainMonth = sideMonth;

const datesContainerDiv = document.querySelector(".dates.container");
const dateBoxDiv = document.querySelector(".date.box");

// 사이드 캘린더
const setCalendar = (year, month) => {
    const titleyearmonthDiv = document.querySelector(".yearmonth");
    titleyearmonthDiv.innerHTML = `${year}.${String(month).padStart(2, "0")}`;

    const firstDateDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();

    datesContainerDiv.replaceChildren();

    for (let d = 1; d <= lastDate; d++) {
        const dateItemDiv = document.createElement("div");
        dateItemDiv.classList.add("date", "item");
        dateItemDiv.innerHTML = d;

        if (
            year === now.getFullYear() &&
            month === now.getMonth() + 1 &&
            d === now.getDate()
        ) {
            dateItemDiv.classList.add("today");
        }

        datesContainerDiv.appendChild(dateItemDiv);
    }

    const firstDateDiv = datesContainerDiv.firstElementChild;
    firstDateDiv.style.gridColumnStart = firstDateDay + 1;

    datesContainerDiv
        .querySelectorAll(`.date.item:nth-child(7n+${7 - firstDateDay})`)
        .forEach(d => d.style.color = "blue");

    datesContainerDiv
        .querySelectorAll(`.date.item:nth-child(7n+${(8 - firstDateDay) % 7})`)
        .forEach(d => d.style.color = "red");
};

// 날짜에 맞는 일정 반환
const getEventsForDate = (dateStr) => {
    const events = JSON.parse(localStorage.getItem("events") || "[]");
    return events.filter(ev => {
        const start = ev.startDate || "";
        const end = ev.endDate || ev.startDate || "";
        return dateStr >= start && dateStr <= end;
    });
};

// 메인 캘린더
const setMainCalendar = (year, month) => {
    const titleyearmonthDiv2 = document.querySelector(".year-month");
    titleyearmonthDiv2.innerHTML = `${year}.${String(month).padStart(2, "0")}`;

    dateBoxDiv.replaceChildren();

    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        dateBoxDiv.appendChild(document.createElement("div"));
    }

    for (let d = 1; d <= lastDate; d++) {
        const cell = document.createElement("div");
        cell.className = "date-item";

        const dayIndex = (firstDay + d - 1) % 7;
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        if (dayIndex === 0) cell.style.color = "red";
        if (dayIndex === 6) cell.style.color = "blue";

        const num = document.createElement("div");
        num.className = "date-number";
        num.textContent = d;
        cell.appendChild(num);

        const eventsWrap = document.createElement("div");
        eventsWrap.className = "day-events";

        getEventsForDate(dateStr).forEach(ev => {
            const bar = document.createElement("div");
            bar.className = "calendar-event";
            bar.textContent = ev.title;
            bar.style.backgroundColor = "#5B9BFF";
            bar.onclick = e => {
                e.stopPropagation();
                location.href = `html/eventAdd.html?id=${ev.id}`;
            };
            eventsWrap.appendChild(bar);
        });

        cell.appendChild(eventsWrap);

        if (
            year === now.getFullYear() &&
            month === now.getMonth() + 1 &&
            d === now.getDate()
        ) {
            cell.style.background = "#E8F0FE";
        }

        dateBoxDiv.appendChild(cell);
    }
};
setCalendar(sideYear, sideMonth);
setMainCalendar(mainYear, mainMonth);

// 이전달 아이콘 클릭 시 캘린더 이동
document.querySelector(".left").onclick = () => {
    sideMonth--;
    if (sideMonth === 0) {
        sideYear--;
        sideMonth = 12;
    }
    setCalendar(sideYear, sideMonth);
};

document.querySelector(".right").onclick = () => {
    sideMonth++;
    if (sideMonth === 13) {
        sideYear++;
        sideMonth = 1;
    }
    setCalendar(sideYear, sideMonth);
};

document.querySelector(".lef").onclick = () => {
    mainMonth--;
    if (mainMonth === 0) {
        mainYear--;
        mainMonth = 12;
    }

    setMainCalendar(mainYear, mainMonth);

    sideYear = mainYear;
    sideMonth = mainMonth;
    setCalendar(sideYear, sideMonth);
};

document.querySelector(".rig").onclick = () => {
    mainMonth++;
    if (mainMonth === 13) {
        mainYear++;
        mainMonth = 1;
    }

    setMainCalendar(mainYear, mainMonth);

    sideYear = mainYear;
    sideMonth = mainMonth;
    setCalendar(sideYear, sideMonth);
};

document.getElementById("dday").onclick = () => {
    const today = new Date();
    mainYear = today.getFullYear();
    mainMonth = today.getMonth() + 1;

    setMainCalendar(mainYear, mainMonth);

    sideYear = mainYear;
    sideMonth = mainMonth;
    setCalendar(sideYear, sideMonth);
};

document.querySelector(".menu i").onclick = () => {
    document.getElementById("nav-calendar").classList.toggle("hidden");
};

document.getElementById("event-add").onclick = () => {
    location.href = "html/eventAdd.html";
};

dateBoxDiv.onclick = (e) => {
    if (e.target.closest(".calendar-event")) return;
    
    // 클릭한 날짜 셀 찾기
    const dateCell = e.target.closest(".date-item");
    if (dateCell) {
        const dateNumber = dateCell.querySelector(".date-number");
        if (dateNumber) {
            const day = parseInt(dateNumber.textContent);
            const selectedDate = `${mainYear}-${String(mainMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            location.href = `html/eventAdd.html?date=${selectedDate}`;
            return;
        }
    }
    
    location.href = "html/eventAdd.html";
};

// 캘린더 정렬 버튼 toggle
const btnMonth = document.getElementById("btnMonth");
const btnList = document.getElementById("btnList");

const monthView = document.getElementById("monthView");
const listView = document.getElementById("listView");

listView.classList.add("hidden");

btnMonth.onclick = () => {
    btnMonth.classList.add("active");
    btnList.classList.remove("active");

    monthView.classList.remove("hidden");
    listView.classList.add("hidden");
};

btnList.onclick = () => {
    btnList.classList.add("active");
    btnMonth.classList.remove("active");

    monthView.classList.add("hidden");
    listView.classList.remove("hidden");

    renderListView();
};

// 리스트 뷰
const renderListView = () => {
    const listView = document.getElementById("listView");
    listView.replaceChildren();

    const events = JSON.parse(localStorage.getItem("events") || "[]");

    if (events.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "일정이 없습니다.";
        listView.appendChild(empty);
        return;
    }

    const expandedEvents = [];

    events.forEach(ev => {
        const start = new Date(ev.startDate);
        const end = ev.endDate ? new Date(ev.endDate) : new Date(ev.startDate);

        for (
            let d = new Date(start);
            d <= end;
            d.setDate(d.getDate() + 1)
        ) {
            expandedEvents.push({
                date: d.toISOString().slice(0, 10),
                title: ev.title,
                id: ev.id
            });
        }
    });

    // 날짜순 정렬
    expandedEvents.sort((a, b) => a.date.localeCompare(b.date));

    let currentDate = "";

    expandedEvents.forEach(ev => {
        if (ev.date !== currentDate) {
            currentDate = ev.date;
            const dateDiv = document.createElement("div");
            dateDiv.className = "list-date";
            dateDiv.textContent = currentDate;
            listView.appendChild(dateDiv);
        }

        const item = document.createElement("div");
        item.className = "list-event";
        item.textContent = ev.title;
        item.onclick = () => {
            location.href = `html/eventAdd.html?id=${ev.id}`;
        };

        listView.appendChild(item);
    });
};