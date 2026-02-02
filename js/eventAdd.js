// 현재 날짜 설정
const today = new Date();
const todayString = today.toISOString().split('T')[0];
var startDateEl = document.getElementById('startDate');
var endDateEl = document.getElementById('endDate');
if (startDateEl) startDateEl.value = todayString;
if (endDateEl) endDateEl.value = todayString;

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

var saveBtn = document.getElementById('saveBtn');
var saveBtnBottom = document.getElementById('saveBtnBottom');
if (saveBtn) saveBtn.addEventListener('click', saveEvent);
if (saveBtnBottom) saveBtnBottom.addEventListener('click', saveEvent);

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