# LC Academy (lc_aca) 기능 안내

> AI 학원관리 프로그램 — lonex_client 기반 커스터마이징 원천 소스  
> 버전 1.0.0 · 2026-06-26

## 개요

LC Academy는 lonex AI 오피스 플랫폼을 **학원 관리**에 맞게 변형한 프로젝트입니다.  
기능 학습 및 향후 학원 매니저 커스터마이징을 위한 **원천 소스**로 사용됩니다.

| 항목 | 내용 |
|------|------|
| 리포 | https://github.com/shinkang888-code/lc_aca |
| 배포 | https://lc-aca.vercel.app |
| DB | Neon PostgreSQL (lc_aca 전용) |
| 상위 리포 | lonex_client → lonex (마스터) |

---

## 조직도 구조

**원장 > 팀장 > 직원** 3단계 알고리즘을 따릅니다.

```
원장(대표) ── 4F 원장실
    │
    ├── 행정팀장 ── 3F 행정실 ── 수납·상담·등록 직원
    ├── 강사팀장 ── 2F 강사실 ── 수학·영어·과학·코딩 강사
    └── 반 팀장  ── 1F 원생학습실 ── 원생
```

### 층별 구성 (4개 부서)

| 층 | slug | 인원 | 역할 |
|----|------|------|------|
| 4F 원장실 | `floor-director` | 2명 | 원장, 부원장 |
| 3F 행정실 | `floor-admin` | 4명 | 행정팀장 + 행정직원 |
| 2F 강사실 | `floor-teachers` | 8명 | 과목별 팀장 + 강사 |
| 1F 원생학습실 | `floor-students` | 10명 | 반별 팀장 + 원생 |

총 **24명** (기존 217명/16부서 대비 경량화)

---

## 빌딩 평면도 UI

`/office` 페이지에서 **상단 내려다보기 평면도**로 4층을 표시합니다.

- **4F** — 원장실 (보라)
- **3F** — 행정실 (파랑)
- **2F** — 강사실 (초록)
- **1F** — 원생학습실 (주황)

각 층은 그리드 방(칸)으로 나뉘며, 팀장·직원 캐릭터를 클릭하면 업무 지시가 가능합니다.

---

## 주요 페이지

| 경로 | 기능 |
|------|------|
| `/` | 홈 (마케팅) |
| `/office` | 학원 빌딩 평면도 + 층별 뷰 + 업무지시방 |
| `/console` | 직원(원장·강사·원생) 상태 관리 콘솔 |
| `/control-tower` | LogShield 사이트 가용성 관제탑 |

---

## 데이터 소스

| 파일 | 설명 |
|------|------|
| `src/data/agency.json` | 학원 조직 마스터 데이터 |
| `scripts/seed.mjs` | Neon DB 시드 (departments, employees, sites) |
| `src/lib/db.ts` | DB 타입 정의 |

### 시드 실행

```bash
# .env.local에 DATABASE_URL 설정 후
npm run seed
```

---

## 환경 변수

```env
DATABASE_URL=postgresql://...@...neon.tech/lc_aca?sslmode=require
```

---

## 커스터마이징 가이드

### 1. 조직 추가/변경

`src/data/agency.json`의 `agents` 배열에 항목 추가:

```json
{
  "division": "floor-teachers",
  "role": "staff",
  "name": "새강사",
  "slug": "teacher-new",
  ...
}
```

- 각 `division`의 **첫 번째 agent** = 팀장(대표)으로 UI에 표시
- `role`: `director` | `team-lead` | `staff` | `student`

### 2. 층/방 레이아웃 변경

`src/app/office/building-scene.tsx`의 `FLOORS` 상수 수정:

```typescript
const FLOORS = [
  { floor: 4, slug: "floor-director", cols: 2, room: "원장실" },
  ...
];
```

### 3. 캐릭터 매핑

`src/app/office/avatars.ts` — 부서 slug → 캐릭터 이미지

### 4. 실무 담당(사람) 프로필

층별 뷰에서 부서 카드 → 실무 담당(강사·행정) 이름·사진 등록

---

## API

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/company` | GET | 부서·직원·사이트 일괄 조회 |
| `/api/employees/[id]` | PATCH | 직원 상태/업무 변경 |
| `/api/departments/[slug]/profile` | PATCH | 실무 담당 프로필 |
| `/api/events` | GET | 활동 로그 |
| `/api/sites/check` | GET/POST | 사이트 가용성 점검 (cron 5분) |

---

## 배포

### Vercel

```bash
vercel --prod
# 프로젝트명: lc-aca
# 환경변수: DATABASE_URL
```

### Neon

1. Neon 콘솔에서 `lc_aca` 프로젝트/DB 생성
2. Connection string을 Vercel `DATABASE_URL`에 설정
3. `npm run seed`로 초기 데이터 입력

---

## Git 브랜치·리포 계층

```
lonex (마스터, 보호)
  └── lonex_client (클라이언트)
        └── lc_aca (학원관리 원천소스)
```

---

## 라이선스·용도

- 기능 학습 및 학원 매니저 커스터마이징 **원천 소스**
- lonex 플랫폼 기반 — 상업적 재배포 시 원저작자 정책 확인 필요

---

*LC Academy · AI 학원관리 프로그램*
