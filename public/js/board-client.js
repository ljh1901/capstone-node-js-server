// public/js/board-client.js

const socket = io('http://localhost:4000');
// const socket = io('http://your-domain:4000'); //board.js에서 접근하는 socket.io 진입점 -> http://your-domain:4000
// const socket = io('http://public ip:4000'); //board.js에서 접근하는 socket.io 진입점 -> http://public ip:4000
const maxSlots = 5;
const categoryIdMap = {
    '양식/분식': 'bunsik',
    '라면/김밥': 'ramen',
    '시그니처 코너': 'signiture'
};

// 각 카테고리 슬롯별 현재 티켓 번호 저장 (slotNum이 아닌, 슬롯별 티켓 번호)
// 예: { bunsik: ['', '', '', '', ''], ramen: [...], ... }
const slotsState = {
    bunsik: Array(maxSlots).fill(''),
    ramen: Array(maxSlots).fill(''),
    signiture: Array(maxSlots).fill('')
};

function findEmptySlot(category) {
    return slotsState[category].findIndex(t => t === '');
}

function addTicketToBoard(ticketNumber, categoryName) {
    const category = categoryIdMap[categoryName];
    if (!category) {
        console.warn('알 수 없는 카테고리:', categoryName);
        return;
    }

    // 빈 슬롯 찾기
    let emptyIndex = findEmptySlot(category);

    // 빈 슬롯 없으면 가장 앞(0) 슬롯 덮어쓰기 (또는 원하는 정책 적용)
    if (emptyIndex === -1) emptyIndex = 0;

    // 슬롯 상태 업데이트
    slotsState[category][emptyIndex] = ticketNumber;

    // 실제 DOM에 반영
    const slotId = `${category}-${emptyIndex + 1}`;
    const slot = document.getElementById(slotId);
    if (slot) {
        slot.textContent = ticketNumber;
        slot.classList.add('highlight');
    }
}

function removeTicketFromBoard(ticketNumber) {
    Object.keys(slotsState).forEach(category => {
        const idx = slotsState[category].findIndex(t => t === ticketNumber);
        if (idx !== -1) {
            slotsState[category][idx] = '';
            const slotId = `${category}-${idx + 1}`;
            const slot = document.getElementById(slotId);
            if (slot) {
                slot.textContent = '';
                slot.classList.remove('highlight');
            }
        }
    });
}

// 페이지 로드 시 초기 티켓 세팅
socket.on('initial-tickets', (tickets) => {
    // 초기화
    Object.keys(slotsState).forEach(category => {
        slotsState[category] = Array(maxSlots).fill('');
    });

    tickets.forEach(({ ticketNumber, categoryName }) => {
        const category = categoryIdMap[categoryName];
        if (!category) return;

        // 빈 슬롯에 넣기
        let emptyIndex = findEmptySlot(category);
        if (emptyIndex === -1) emptyIndex = 0;
        slotsState[category][emptyIndex] = ticketNumber;

        const slotId = `${category}-${emptyIndex + 1}`;
        const slot = document.getElementById(slotId);
        if (slot) {
            slot.textContent = ticketNumber;
            slot.classList.add('highlight');
        }
    });
});

// 새로운 티켓 추가 이벤트
socket.on('new-ticket', (data) => {
    addTicketToBoard(data.ticketNumber, data.categoryName);
});

// 티켓 제거 이벤트
socket.on('remove-ticket', (data) => {
    removeTicketFromBoard(data.ticketNumber);
});
