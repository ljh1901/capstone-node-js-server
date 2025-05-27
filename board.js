// board.js => SpringBoot와 Node.js를 연결하는 Nodejs Server-Module

const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const app = express(); // board.html 전광판 파일 서빙
const server = http.createServer(app);
const currentTickets = []; // 전광판에 반환된 티켓 저장 - 새로고침 시 불러오기 위함

// Socket.IO 서버 생성 (CORS 설정 포함)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
//1. Socket.IO 서버에서 정적 파일 제공 막기: board-server.js 또는 app.js 중 socket.io 서버인데
    // app.use(express.static('public')); //Static express() 서버에서 static 서빙 금지 시켜야함.
// CORS, JSON 파싱, 정적 파일(public 폴더) 서빙 설정
app.use(cors());
app.use(bodyParser.json());

//1. Socket.IO 서버에서 정적 파일 제공 막기: board-server.js 또는 app.js 중 socket.io 서버인데
    // app.use(express.static('public')); //Static express() 서버에서 static 서빙 금지 시켜야함.


// 클라이언트 연결 시 로그 출력
io.on('connection', (socket) => {
    console.log('📡 전광판 클라이언트 연결됨:', socket.id);
    // 현재 티켓 목록 전송
    socket.emit('initial-tickets', currentTickets);
});

// Spring Boot에서 ticketNumber 전송 시 실행되는 핸들러
app.post('/display', (req, res) => {
    const { ticketNumber, categoryName } = req.body;
    // 유효성 검사
    if (!ticketNumber && !categoryName) {
        return res.status(400).send('ticketNumber 없음');
    }
    // 중복 방지 후 저장
    currentTickets.push({ ticketNumber, categoryName });

    // 콘솔 로그 + 클라이언트에 실시간 이벤트 전송
    console.log(`ticketNumber 수신: ${ticketNumber}`);
    console.log(`categoryName 수신: ${categoryName}`);
    io.emit('new-ticket', { ticketNumber, categoryName });

    // 전송 성공 응답
    res.sendStatus(200);
});
// 폐기, 픽업 완료: 번호 제거
app.post('/remove-ticket', (req, res) => {
    const { ticketNumber, categoryName } = req.body;
    // 배열에서 삭제
    const index = currentTickets.findIndex(t => t.ticketNumber === ticketNumber);
    if (index !== -1) {
        currentTickets.splice(index, 1);
    }
    console.log(`ticketNumber 제거: ${ticketNumber}`);
    console.log(`categoryName 수신: ${categoryName}`);
    io.emit('remove-ticket', { ticketNumber, categoryName });
    res.sendStatus(200);
});

// board.html 대신에 /board로 변경
app.get('/board', (req, res) => {
    res.sendFile(__dirname + '/public/board.html');
});
// 서버 시작
const PORT = 4000;
const IP = '0.0.0.0';

server.listen(PORT, IP, () => {
    console.log(`전광판 서버 실행 중: http://localhost:${PORT}`);
});
