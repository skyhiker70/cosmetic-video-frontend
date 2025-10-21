# 화장품 인스타그램 영상 자동 생성 서비스 🎬💄

컨셉만 입력하면 AI가 자동으로 인스타그램 릴스 영상을 생성해주는 풀스택 웹 애플리케이션입니다.

## 🎨 기능

- **AI 기반 이미지 생성**: OpenAI DALL-E 3로 4장의 고품질 이미지 생성
- **자동 영상 변환**: ffmpeg로 이미지를 9:16 비율 영상으로 변환
- **스타일 커스터마이징**: 미니멀/럭셔리/내추럴/비비드 스타일 선택
- **컬러 팔레트**: 6가지 뉴트럴 컬러 옵션
- **분위기 조절**: 큐트부터 세련된 느낌까지 무단계 조절
- **실시간 미리보기**: 생성된 영상 즉시 확인
- **다운로드**: MP4 포맷으로 다운로드

## 📁 프로젝트 구조

```
cosmetic-video-app/
├── backend/
│   ├── server.js              # Express 서버
│   ├── promptGenerator.js     # GPT-4로 프롬프트 생성
│   ├── imageGenerator.js      # DALL-E 3로 이미지 생성
│   ├── videoGenerator.js      # ffmpeg로 영상 생성
│   ├── package.json
│   ├── .env.example           # 환경변수 예시
│   └── .env                   # 실제 환경변수 (생성 필요)
├── frontend/
│   └── index.html             # 웹 인터페이스
└── output/
    ├── images/                # 생성된 이미지 저장
    └── videos/                # 생성된 영상 저장
```

## 🚀 설치 및 실행

### 1. 사전 요구사항

- **Node.js** 16+ 설치
- **ffmpeg** 설치 (영상 변환용)
  ```bash
  # Ubuntu/Debian
  sudo apt-get install ffmpeg
  
  # macOS
  brew install ffmpeg
  
  # Windows
  # https://ffmpeg.org/download.html 에서 다운로드
  ```

### 2. OpenAI API 키 발급

1. https://platform.openai.com/api-keys 접속
2. "Create new secret key" 클릭
3. API 키 복사 (한 번만 표시됨!)

### 3. 백엔드 설정

```bash
cd backend

# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env
nano .env  # 또는 메모장으로 열어서 OPENAI_API_KEY 입력
```

**.env 파일 내용:**
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
```

### 4. 서버 실행

```bash
# 백엔드 서버 실행
cd backend
npm start

# 또는 개발 모드 (자동 재시작)
npm run dev
```

서버가 실행되면:
```
🚀 Server running on http://localhost:3000
📁 Output directory: /path/to/output
```

### 5. 프론트엔드 실행

브라우저로 `frontend/index.html` 파일을 열거나:

```bash
# 간단한 HTTP 서버 실행
cd frontend
python3 -m http.server 8080

# 브라우저에서 http://localhost:8080 접속
```

## 💡 사용 방법

1. **컨셉 입력**: "비건 립스틱, 핑크톤, 럭셔리 무드" 같은 내용 입력
2. **스타일 선택**: 미니멀/럭셔리/내추럴/비비드 중 선택
3. **컬러 선택**: 6가지 뉴트럴 톤 중 선택
4. **분위기 조절**: 슬라이더로 큐트~세련됨 조절
5. **영상 생성하기** 버튼 클릭
6. **1-2분 대기** (AI 이미지 생성 + 영상 변환)
7. **미리보기 확인** 후 다운로드

## 🔧 기술 스택

### Frontend
- HTML5 / CSS3 / Vanilla JavaScript
- 모바일 우선 반응형 디자인
- 미니멀 럭셔리 UI/UX

### Backend
- Node.js + Express.js
- OpenAI API (GPT-4, DALL-E 3)
- ffmpeg (fluent-ffmpeg)
- CORS 지원

### AI Models
- **GPT-4**: 컨셉을 상세한 이미지 프롬프트로 변환
- **DALL-E 3**: 1024x1792 해상도 이미지 생성 (9:16 비율)

## 📊 API 명세

### POST `/api/generate`

**Request:**
```json
{
  "concept": "비건 립스틱, 핑크톤, 럭셔리 무드",
  "style": "luxury",
  "color": "nude",
  "mood": 75
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-here",
  "videoUrl": "/output/videos/uuid-here.mp4",
  "imageUrls": [
    "/output/images/uuid-here_1.png",
    "/output/images/uuid-here_2.png",
    "/output/images/uuid-here_3.png",
    "/output/images/uuid-here_4.png"
  ],
  "concept": "비건 립스틱, 핑크톤, 럭셔리 무드",
  "style": "luxury",
  "color": "nude",
  "mood": 75
}
```

## ⚙️ 설정 커스터마이징

### 영상 길이 조절

`backend/videoGenerator.js` 파일에서:
```javascript
const listContent = imagePaths.map(imgPath => 
    `file '${imgPath}'\nduration 2`  // 2초 → 원하는 초로 변경
).join('\n');
```

### 이미지 개수 조절

`backend/promptGenerator.js` 파일에서:
```javascript
// 4장 → 원하는 개수로 변경
Generate 4 detailed image prompts
```

### 영상 해상도 조절

`backend/videoGenerator.js` 파일에서:
```javascript
'-vf scale=1080:1920',  // 9:16 Instagram Reel
// 다른 비율: 1080:1350 (4:5), 1080:1080 (1:1)
```

## 💰 비용 예상

OpenAI API 사용 비용 (2024년 기준):
- **GPT-4**: ~$0.03/요청 (프롬프트 생성)
- **DALL-E 3**: $0.04/이미지 (1024x1792)
- **총 비용**: 약 $0.19/영상 (4이미지 + 프롬프트)

## 🐛 문제 해결

### 1. "OPENAI_API_KEY not set" 오류
→ `.env` 파일에 API 키를 정확히 입력했는지 확인

### 2. "FFmpeg not found" 오류
→ ffmpeg가 시스템에 설치되어 있고 PATH에 포함되어 있는지 확인

### 3. "Generation failed" 오류
→ OpenAI API 키가 유효한지, 잔액이 충분한지 확인

### 4. CORS 오류
→ 백엔드 서버가 실행 중인지 확인, 프론트엔드에서 올바른 URL 사용 중인지 확인

### 5. 이미지가 생성되지 않음
→ DALL-E 3 프롬프트가 OpenAI 정책을 위반하지 않는지 확인

## 🚀 배포 가이드

### Vercel/Netlify (프론트엔드)
1. `frontend` 폴더를 배포
2. 환경변수에 백엔드 API URL 설정

### Railway/Render (백엔드)
1. `backend` 폴더를 배포
2. 환경변수에 `OPENAI_API_KEY` 설정
3. ffmpeg buildpack 추가

### Docker (전체)
```dockerfile
# Dockerfile 예시
FROM node:18
RUN apt-get update && apt-get install -y ffmpeg
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
CMD ["npm", "start"]
```

## 🎯 향후 개선 사항

- [ ] 배경음악 추가 (AI 음악 생성)
- [ ] 텍스트 오버레이 커스터마이징
- [ ] 더 많은 트랜지션 효과
- [ ] 브랜드 로고 삽입 기능
- [ ] 템플릿 시스템
- [ ] 사용자 계정 및 저장 기능
- [ ] 여러 AI 모델 지원 (Midjourney, Stable Diffusion)
- [ ] 실시간 생성 진행률 표시

## 📄 라이선스

MIT License

## 👨‍💻 개발자

스하 선생님 - AI, 디자인, 영상 크리에이터

## 🙋‍♀️ 지원

문제가 있거나 개선 제안이 있으시면 이슈를 등록해주세요!
