var editingEventId = null;
(function() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) return;
    var events = JSON.parse(localStorage.getItem('events') || '[]');
    var ev = events.find(function(e) { return e.id === id; });
    if (!ev) return;
    editingEventId = id;
    document.getElementById('eventFormTitle').textContent = '이벤트 수정';
    document.getElementById('eventTitle').value = ev.title || '';
    if (document.getElementById('location')) document.getElementById('location').value = ev.location || '';
    if (document.getElementById('startDate')) document.getElementById('startDate').value = ev.startDate || '';
    if (document.getElementById('endDate')) document.getElementById('endDate').value = ev.endDate || '';
    if (document.getElementById('startTime')) document.getElementById('startTime').value = ev.startTime || '12:00';
    if (document.getElementById('endTime')) document.getElementById('endTime').value = ev.endTime || '12:00';
    var showFree = document.getElementById('showFree');
    if (showFree) showFree.checked = !!ev.allDay;
    var calendarSelect = document.getElementById('calendar');
    if (calendarSelect) {
        for (var i = 0; i < calendarSelect.options.length; i++) {
            if (calendarSelect.options[i].value === (ev.calendar || 'my')) {
                calendarSelect.selectedIndex = i;
                break;
            }
        }
        var opt = calendarSelect.options[calendarSelect.selectedIndex];
        if (opt && opt.getAttribute('data-color')) calendarSelect.style.setProperty('--calendar-color', opt.getAttribute('data-color'));
    }
    var categorySelect = document.getElementById('category');
    if (categorySelect && ev.category) {
        for (var j = 0; j < categorySelect.options.length; j++) {
            if (categorySelect.options[j].value === ev.category) {
                categorySelect.selectedIndex = j;
                break;
            }
        }
    }
    if (document.getElementById('memo')) document.getElementById('memo').value = ev.memo || '';
    var alarmSelect = document.getElementById('alarmTime');
    if (alarmSelect && ev.alarm) {
        for (var k = 0; k < alarmSelect.options.length; k++) {
            if (alarmSelect.options[k].value === String(ev.alarm)) {
                alarmSelect.selectedIndex = k;
                break;
            }
        }
    }
    document.getElementById('deleteEventBtn').style.display = 'inline-block';
})();

// 현재 날짜 설정 (수정 모드가 아닐 때만)
if (!editingEventId) {
    var today = new Date();
    var todayString = today.toISOString().split('T')[0];
    var startDateEl = document.getElementById('startDate');
    var endDateEl = document.getElementById('endDate');
    if (startDateEl) startDateEl.value = todayString;
    if (endDateEl) endDateEl.value = todayString;
}

// 체크박스 이벤트
const allDayCheckbox = document.getElementById('showFree');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
if (allDayCheckbox && startTimeInput && endTimeInput) {
allDayCheckbox.addEventListener('change', function() {
    if (this.checked) {
        endTimeInput.disabled = true;
        startTimeInput.disabled = true;
        endTimeInput.style.backgroundColor = '#F0F0F0';
        startTimeInput.style.backgroundColor = '#F0F0F0';
    } else {
        endTimeInput.disabled = false;
        startTimeInput.disabled = false;
        endTimeInput.style.backgroundColor = '#FFF';
        startTimeInput.style.backgroundColor = '#FFF';
    }
});
}

// 스티커 클릭 시 active 적용
const iconItems = document.querySelectorAll('.icon-item');
iconItems.forEach(item => {
    item.addEventListener('click', function() {
        iconItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// 알림 버튼 클릭 시 active 적용
const alarmTypeBtns = document.querySelectorAll('.alarm-wrapper .btn');
alarmTypeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        alarmTypeBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
    });
});

// 달력 색상 변경
const calendarSelect = document.getElementById('calendar');
if (calendarSelect) {
    calendarSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const color = selectedOption && selectedOption.getAttribute('data-color');
        if (color) this.style.setProperty('--calendar-color', color);
    });
}

// 이벤트 저장 후 index로 이동
function saveEvent() {
    var titleEl = document.getElementById('eventTitle');
    var title = titleEl ? titleEl.value.trim() : '';
    if (!title) {
        alert('제목을 입력해 주세요.');
        if (titleEl) titleEl.focus();
        return;
    }

    var calendarSelect = document.getElementById('calendar');
    var calendarOption = calendarSelect && calendarSelect.options[calendarSelect.selectedIndex];
    var color = calendarOption && calendarOption.getAttribute('data-color');
    if (!color) color = '#5B9BFF';

    var eventData = {
        id: editingEventId || ('event_' + Date.now()),
        title: title,
        location: document.getElementById('location') ? document.getElementById('location').value : '',
        startDate: document.getElementById('startDate') ? document.getElementById('startDate').value : '',
        endDate: document.getElementById('endDate') ? document.getElementById('endDate').value : '',
        startTime: document.getElementById('startTime') ? document.getElementById('startTime').value : '',
        endTime: document.getElementById('endTime') ? document.getElementById('endTime').value : '',
        allDay: document.getElementById('showFree') ? document.getElementById('showFree').checked : false,
        calendar: calendarSelect ? calendarSelect.value : 'my',
        color: color,
        category: document.getElementById('category') ? document.getElementById('category').value : '',
        memo: document.getElementById('memo') ? document.getElementById('memo').value : '',
        alarm: document.getElementById('alarmTime') ? document.getElementById('alarmTime').value : ''
    };

    var events = JSON.parse(localStorage.getItem('events') || '[]');
    if (editingEventId) {
        var idx = events.findIndex(function(e) { return e.id === editingEventId; });
        if (idx !== -1) events[idx] = eventData;
    } else {
        events.push(eventData);
    }
    localStorage.setItem('events', JSON.stringify(events));
    alert(editingEventId ? '일정이 수정되었습니다.' : '일정이 저장되었습니다.');
    window.location.href = '../index.html';
}

var saveBtn = document.getElementById('saveBtn');
var saveBtnBottom = document.getElementById('saveBtnBottom');
if (saveBtn) saveBtn.addEventListener('click', saveEvent);
if (saveBtnBottom) saveBtnBottom.addEventListener('click', saveEvent);

// 일정 삭제 버튼
var deleteEventBtn = document.getElementById('deleteEventBtn');
if (deleteEventBtn) {
    deleteEventBtn.addEventListener('click', function() {
        if (!editingEventId) return;
        if (!confirm('이 일정을 삭제하시겠습니까?')) return;
        var events = JSON.parse(localStorage.getItem('events') || '[]');
        events = events.filter(function(e) { return e.id !== editingEventId; });
        localStorage.setItem('events', JSON.stringify(events));
        alert('일정이 삭제되었습니다.');
        window.location.href = '../index.html';
    });
}

// 시작일이 종료일보다 늦을 경우 자동 조정
var startDateInput = document.getElementById('startDate');
var endDateInput = document.getElementById('endDate');
if (startDateInput) {
    startDateInput.addEventListener('change', function() {
        var start = new Date(this.value);
        var end = new Date(endDateInput ? endDateInput.value : 0);
        if (endDateInput && start > end) endDateInput.value = this.value;
    });
}
if (endDateInput) {
    endDateInput.addEventListener('change', function() {
        var start = new Date(startDateInput ? startDateInput.value : 0);
        var end = new Date(this.value);
        if (startDateInput && end < start) startDateInput.value = this.value;
    });
};