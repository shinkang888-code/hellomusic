# Hello Music Academy — 고객 납품 기획서

> lc_aca · Hello Music Academy · 2026-06-26  
> 참고: [hellomusic.co.kr](https://hellomusic.co.kr/) · [네이버 블로그](https://blog.naver.com/hellomusic0104) · helloap · HelloManager PDF

## 컨셉

**Play. Learn. Grow.** — 서울 관악 기반 피아노 전문 학원. 1:1 맞춤 레슨 + 1층 Academy Floor Plan + AI 학원관리(HelloManager) + 2D chibi 캐릭터 AI 애니메이터형 학원 사이트.

## 브랜드

| 항목 | 값 |
|------|-----|
| 이름 | Hello Music Academy (헬로뮤직) |
| 슬로건 | 음악으로 마음을 여는 헬로뮤직 |
| 컬러 | 버건디 `#9B2335` · 골드 `#B8860B` · 네이비 `#1e2a4a` |
| 배포 | https://lc-aca.vercel.app |

## 1층 평면도 (Academy Floor Plan)

| 구역 | 도면 라벨 | 조직 |
|------|-----------|------|
| 원장실 | Office | 김원장 · 이부원장 |
| 행정실 | Theory Room | 행정팀장 · 수납 · 상담 |
| 강사실 | Grand Piano Studio | 박서연 · 최민준 · 이지원 · 한성인 |
| 원생학습실 | Piano Practice 1–5 · Lecture Hall | 반 팀장 + 원생 |

## 캐릭터 (2D 2등신 chibi)

`public/characters/chibi/` — director-male/female, teacher-male/female, student-boy/girl

## 주요 URL

- 홈: `/`
- 학원 소개 (HelloManager PDF 반영): `/about`
- 수업 안내: `/services`
- AI 학원 평면도: `/office`
- Blog (구 그렌드 버튼): https://blog.naver.com/hellomusic0104

## DB 재시드

```bash
DATABASE_URL=... npm run init-db
```

---

*Hello Music Academy · 고객 납품용*
