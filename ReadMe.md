# Node.js 서버 개발 환경 구축 가이드

## 🔹 Node.js: JavaScript로 서버를 만들 수 있게 해주는 런타임 환경  
→ 파일 처리, 네트워크 요청 등 서버 기능을 JavaScript로 구현 가능 (REST API, 실시간 통신 등)

## 🔹 JavaScript는 원래 브라우저 전용  
→ Node.js 덕분에 서버에서도 JavaScript 사용 가능  
→ JS로 웹 서버, API 서버, 실시간 통신 서버 등 구현 가능

---

##  Node.js에서 socket.io 사용 가능  
- Node.js 버전: `20.14.0`  
- npm 버전: `10.7.0`
- pm2: Node.js를 관리해주는 관리자 도구 서버에서 안정적으로 사용하기 위해 사용
- npx pm2 kill -> cmd에서 pm2 process
---

## 설치 순서 (CMD 기준)

// 1. nvm 설치
nvm (Node Version Manager)
Node.js의 다양한 버전을 쉽게 다운그레이드(Downgrade) 또는 마이그레이션(Migration) 할 수 있는 도구

유형	다운그레이드	마이그레이션
예시	낮은 버전으로 변경 (예: 20 → 18)	환경/기술/버전 변경 (예: DB 변경, 구조 변경 등)
주 목적	호환성, 안정성 확보	기능 확장, 최신 기술 적용
코드 변경	거의 없음	많음 (DB, API 등 변경 수반)
명령어 예	npm install express@4.17.1	MySQL → PostgreSQL, Node14 → Node20 등


user> scoop install nvm

// 2. npm (Node Package Manager)
Node.js에서 외부 모듈(패키지)를 설치하고 관리하는 도구

express, react, axios, socket.io 같은 패키지 설치

package.json을 통해 프로젝트 설정 및 의존성 관리


user> npm init -y

// 3. express, cors, socket.io 설치

user> npm install express
1. express: Node.js에서 웹 서버를 간단히 만들 수 있는 프레임워크
HTTP 요청 처리 (GET, POST, PUT, DELETE 등)

라우팅 설정 (/login, /board, /cart 등)

미들웨어 사용 (로그인 체크, JSON 파싱 등)

user> npm install cors
1. cors: 다른 출처의 요청을 허용할 수 있도록 도와주는 미들웨어
브라우저는 보안상 다른 도메인(API 서버 등)에서의 요청을 차단함

cors는 CORS 오류를 해결해줌

특정 origin만 허용 가능

user> npm install socket.io
1. socket.io: 실시간 통신(웹소켓 기반)을 쉽게 구현할 수 있는 라이브러리
서버 ↔ 클라이언트 실시간 메시지 교환 가능

채팅, 실시간 알림, 게임 서버 등에 유용

WebSocket을 기반으로 하며, 자동 재연결 등도 지원

다양한 브라우저에서 사용 가능

// 4. Node.js 서버 실행 방법
user> node board.js   # 또는 node 파일이름.js