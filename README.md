# lonex AI

lawygoai 특허 협상 플랫폼을 위한 **오픈소스 AI 모델 카탈로그**.
Hugging Face `lonex` 컬렉션(184개 항목)에서 핵심 모델을 큐레이션해 보여줍니다.

## 스택

- **Next.js 16** (App Router, Turbopack)
- **Neon** (Serverless PostgreSQL)
- **Vercel** (배포)
- **Tailwind CSS 4**

## 기능

- Neon DB 기반 모델 카탈로그 (다운로드 순 정렬)
- `GET /api/models` — 모델 목록 API
- `POST /api/waitlist` — 대기자 이메일 등록
- 카테고리별 색상 배지 (한국어 LLM, 특허, 법률, 임베딩, 코딩, OCR 등)

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # DATABASE_URL 입력
npm run dev                  # http://localhost:3000
```

## 데이터베이스 스키마

```sql
CREATE TABLE models (
  id SERIAL PRIMARY KEY,
  repo_id TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  downloads BIGINT DEFAULT 0,
  likes INT DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Vercel 배포

```bash
# 환경변수 등록
vercel env add DATABASE_URL production

# 배포
vercel --prod
```

또는 Vercel 대시보드에서 GitHub 저장소를 import 하고 `DATABASE_URL`을 환경변수로 등록.

## 관련 링크

- [Hugging Face lonex 컬렉션](https://huggingface.co/collections/shinkang/lonex-6a3c2d46b16593fecb629a4b)
- 모델 큐레이션 문서: `../docs/huggingface-resources.md`
