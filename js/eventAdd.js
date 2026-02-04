var editingEventId = null;

(function () {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) return;

    var events = JSON.parse(localStorage.getItem('events') || '[]');
    var ev = events.find(e => e.id === id);
    if (!ev) return;

    editingEventId = id;

    document.getElementById('eventFormTitle').textContent = '이벤트 수정';
    document.getElementById('eventTitle').value = ev.title || '';
    document.getElementById('location').value = ev.location || '';
    document.getElementById('startDate').value = ev.startDate || '';
    document.getElementById('endDate').value = ev.endDate || '';
    document.getElementById('startTime').value = ev.startTime || '12:00';
    document.getElementById('endTime').value = ev.endTime || '12:00';
    document.getElementById('showFree').checked = !!ev.allDay;
    document.getElementById('memo').value = ev.memo || '';

    // 알림 toggle 복원
    const alarmToggle = document.getElementById('check');
    if (alarmToggle) {
        alarmToggle.checked = !!ev.alarmEnabled;
    }

    // 스티커 복원
    const iconItems = document.querySelectorAll('.icon-item');
    if (ev.sticker) {
        iconItems.forEach(item => {
            if (item.dataset.icon === ev.sticker) {
                item.classList.add('active');
            }
        });
    }

    document.getElementById('deleteEventBtn').style.display = 'inline-block';
})();

// 현재 날짜 설정 (수정 모드가 아닐 때만)
if (!editingEventId) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    document.getElementById('endDate').value = today;
}

// 체크박스 이벤트
const allDayCheckbox = document.getElementById('showFree');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');

allDayCheckbox.addEventListener('change', function () {
    const disabled = this.checked;
    startTimeInput.disabled = disabled;
    endTimeInput.disabled = disabled;
    startTimeInput.style.backgroundColor = disabled ? '#F0F0F0' : '#FFF';
    endTimeInput.style.backgroundColor = disabled ? '#F0F0F0' : '#FFF';
});

// 스티커 클릭 시 active 적용
const iconItems = document.querySelectorAll('.icon-item');
iconItems.forEach(item => {
    item.addEventListener('click', function () {
        iconItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// 이벤트 저장
function saveEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    if (!title) {
        alert('제목을 입력해 주세요.');
        return;
    }

    // 선택한 스티커
    const selectedIcon = document.querySelector('.icon-item.active');
    const sticker = selectedIcon ? selectedIcon.dataset.icon : null;

    // 알림 toggle
    const alarmEnabled = document.getElementById('check').checked;

    const eventData = {
        id: editingEventId || ('event_' + Date.now()),
        title: title,
        location: document.getElementById('location').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        allDay: document.getElementById('showFree').checked,
        memo: document.getElementById('memo').value,

        alarmEnabled: alarmEnabled, 
        sticker: sticker            
    };

    let events = JSON.parse(localStorage.getItem('events') || '[]');

    if (editingEventId) {
        const index = events.findIndex(e => e.id === editingEventId);
        if (index !== -1) events[index] = eventData;
    } else {
        events.push(eventData);
    }

    localStorage.setItem('events', JSON.stringify(events));
    alert(editingEventId ? '일정이 수정되었습니다.' : '일정이 저장되었습니다.');
    window.location.href = '../index.html';
}

// 버튼 이벤트
document.getElementById('saveBtnBottom').addEventListener('click', saveEvent);

// 일정 삭제
document.getElementById('deleteEventBtn').addEventListener('click', function () {
    if (!editingEventId) return;
    if (!confirm('이 일정을 삭제하시겠습니까?')) return;

    let events = JSON.parse(localStorage.getItem('events') || '[]');
    events = events.filter(e => e.id !== editingEventId);
    localStorage.setItem('events', JSON.stringify(events));

    alert('일정이 삭제되었습니다.');
    window.location.href = '../index.html';
});

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