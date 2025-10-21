# 🚀 빠른 시작 가이드

5분 안에 화장품 영상 메이커를 실행해보세요!

## ⚡ 빠른 설정 (3단계)

### 1️⃣ OpenAI API 키 발급 (2분)

1. https://platform.openai.com/api-keys 접속
2. 로그인/회원가입
3. **"Create new secret key"** 클릭
4. 이름 입력 (예: "cosmetic-video")
5. **API 키 복사** (sk-proj-로 시작하는 긴 문자열)
   ⚠️ 한 번만 표시되니 꼭 복사하세요!

💳 **참고**: 신규 계정은 $5 무료 크레딧 제공
영상 1개당 약 $0.19 소요 → 약 25개 영상 무료 생성 가능

---

### 2️⃣ 서버 실행 (2분)

```bash
# 1. 백엔드 폴더로 이동
cd backend

# 2. 패키지 설치
npm install

# 3. 환경변수 파일 생성
cp .env.example .env

# 4. API 키 입력 (메모장/nano 등으로)
nano .env
# 또는
code .env  # VS Code
# 또는
notepad .env  # Windows

# 아래 내용 입력 후 저장:
# OPENAI_API_KEY=sk-proj-여기에_복사한_API키_붙여넣기
# PORT=3000

# 5. 서버 시작!
npm start
```

**성공 메시지:**
```
🚀 Server running on http://localhost:3000
📁 Output directory: /path/to/output
```

---

### 3️⃣ 웹페이지 열기 (30초)

**방법 1: 파일 직접 열기**
```bash
# frontend/index.html 파일을 더블클릭
# 또는 브라우저로 드래그 앤 드롭
```

**방법 2: HTTP 서버 사용**
```bash
cd frontend
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

---

## ✨ 첫 영상 생성해보기!

1. **컨셉 입력**
   ```
   예시: 비건 립스틱, 핑크톤, 럭셔리 무드
   ```

2. **스타일 선택**: 럭셔리 ✨

3. **컬러 선택**: Nude (첫 번째 색상)

4. **분위기 조절**: 슬라이더를 오른쪽으로 (세련된 느낌)

5. **"🎬 영상 생성하기"** 버튼 클릭!

6. **1-2분 대기** ⏳
   - AI가 4장의 이미지 생성
   - 자동으로 영상 변환
   
7. **결과 확인** 📱
   - 미리보기에서 영상 재생
   - 마음에 들면 다운로드!

---

## 🎬 생성 과정 (무슨 일이 일어나는지)

```
컨셉 입력
    ↓
[GPT-4] 프롬프트 4개 생성
    ↓
[DALL-E 3] 이미지 4장 생성 (각 ~15초)
    ↓
[ffmpeg] 이미지 → 영상 변환 (~10초)
    ↓
완성! 🎉
```

**총 소요시간**: 약 1-2분

---

## 💡 추천 컨셉 예시

### 미니멀 스타일
```
무광 립스틱, 베이지 톤, 깔끔한 이미지
자연주의 쿠션, 맨얼굴, 촉촉한 피부
```

### 럭셔리 스타일
```
프리미엄 앰플, 골드 패키징, 고급스러운 분위기
디올 립스틱, 레드 컬러, 시크한 무드
```

### 내추럴 스타일
```
비건 선크림, SPF50, 자연 성분, 친환경
식물성 페이스 오일, 그린 보틀, 유기농
```

### 비비드 스타일
```
네온 아이섀도우, 컬러풀, 트렌디한 메이크업
글리터 립글로스, 핑크 펄, 화려한 텍스처
```

---

## ❗ 문제 해결

### "Server connection failed"
```bash
# 백엔드 서버가 실행 중인지 확인
curl http://localhost:3000/api/health

# 응답: {"status":"ok"}
```

### "OPENAI_API_KEY not set"
```bash
# .env 파일 확인
cd backend
cat .env

# OPENAI_API_KEY가 제대로 설정되어 있는지 확인
# sk-proj-로 시작해야 함
```

### "FFmpeg not found"
```bash
# ffmpeg 설치 확인
ffmpeg -version

# 설치되지 않았다면:
# Ubuntu/Debian: sudo apt-get install ffmpeg
# macOS: brew install ffmpeg
# Windows: https://ffmpeg.org/download.html
```

### 이미지가 이상하게 생성됨
→ 컨셉을 더 구체적으로 작성해보세요
→ 스타일/컬러를 조정해보세요

---

## 📊 시스템 요구사항

- **Node.js**: 16 이상
- **메모리**: 최소 2GB RAM
- **디스크**: 1GB 여유 공간 (생성물 저장용)
- **인터넷**: 안정적인 연결 필요 (API 호출)

---

## 💰 비용 관리

### OpenAI API 사용량 확인
https://platform.openai.com/usage

### 비용 절약 팁
1. **프롬프트 최적화**: 명확하게 작성하면 재생성 횟수 감소
2. **이미지 개수 조절**: 4장 → 3장으로 줄이면 25% 절약
3. **GPT-4 대신 GPT-3.5**: promptGenerator.js에서 모델 변경 가능

---

## 🎯 다음 단계

✅ 첫 영상 생성 완료!

이제 시도해보세요:
- [ ] 다양한 스타일 조합 실험
- [ ] 자신의 브랜드 컨셉으로 영상 생성
- [ ] 영상 길이 조절 (videoGenerator.js)
- [ ] 트랜지션 효과 추가
- [ ] 배경음악 넣기

---

## 🆘 도움이 필요하신가요?

- **README.md**: 전체 문서 확인
- **GitHub Issues**: 버그 리포트
- **OpenAI Docs**: https://platform.openai.com/docs

Happy Creating! 🎨✨
