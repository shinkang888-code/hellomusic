import { format, subMinutes, subHours, subDays } from "date-fns";
import { simulatePIIDetection, simulateAURA, simulateTrafficGPT } from "./security-engine";

export const now = new Date();

// ── 대시보드 통계 ──────────────────────────────────────────────
export const dashboardStats = {
  endpoints: 247,
  activeAlerts: 3,
  blockedEvents: 1284,
  usbRequests: 5,
  threatScore: 42,
  integrityOk: 99.6,
};

// ── 실시간 이벤트 피드 (SecEBL/MITRE 레이블 포함) ──────────────
export const recentEvents = [
  { id: 1, time: subMinutes(now, 1), user: "kim.junho", type: "USB", action: "차단", detail: "SanDisk Ultra 32GB (VID:0781)", severity: "high", secebl_label: "file_collection", mitre_technique: "T1052.001", mitre_name: "USB 매체 반출" },
  { id: 2, time: subMinutes(now, 3), user: "lee.sooyeon", type: "PRINT", action: "워터마크 적용", detail: "급여명세서_2026Q2.xlsx (12p)", severity: "medium", secebl_label: "data_staging", mitre_technique: "T1041", mitre_name: "Exfiltration Over C2" },
  { id: 3, time: subMinutes(now, 7), user: "park.minjae", type: "NETWORK", action: "차단", detail: "mega.nz → 파일 업로드 시도", severity: "high", secebl_label: "data_exfiltration", mitre_technique: "T1048", mitre_name: "Exfil. Alt. Protocol" },
  { id: 4, time: subMinutes(now, 12), user: "choi.yuna", type: "FILE", action: "감지", detail: "대용량 파일 복사 1.2GB → USB", severity: "high", secebl_label: "data_staging", mitre_technique: "T1005", mitre_name: "Data from Local System" },
  { id: 5, time: subMinutes(now, 18), user: "jung.hyunwoo", type: "USB", action: "승인", detail: "Kingston 16GB (읽기전용 해제)", severity: "low", secebl_label: "normal_operation", mitre_technique: null, mitre_name: null },
  { id: 6, time: subMinutes(now, 25), user: "oh.sujin", type: "NETWORK", action: "허용", detail: "sharepoint.microsoft.com 접근", severity: "low", secebl_label: "normal_operation", mitre_technique: null, mitre_name: null },
  { id: 7, time: subMinutes(now, 34), user: "yoon.taehyun", type: "PRINT", action: "워터마크 적용", detail: "개발계획서_v3.pptx (35p)", severity: "medium", secebl_label: "data_staging", mitre_technique: "T1041", mitre_name: "Exfiltration Over C2" },
  { id: 8, time: subMinutes(now, 41), user: "shin.boyoung", type: "UEBA", action: "이상 탐지", detail: "야간 대량 데이터 접근 (Score: 0.87)", severity: "critical", secebl_label: "data_staging", mitre_technique: "T1083", mitre_name: "File/Dir Discovery" },
  { id: 9, time: subMinutes(now, 55), user: "lim.changhyun", type: "FILE", action: "허용", detail: "정상 패턴 파일 저장", severity: "low", secebl_label: "normal_operation", mitre_technique: null, mitre_name: null },
  { id: 10, time: subMinutes(now, 68), user: "kang.jiyoung", type: "NETWORK", action: "차단", detail: "torrent 프로토콜 감지", severity: "high", secebl_label: "c2_communication", mitre_technique: "T1071", mitre_name: "Application Layer Protocol" },
];

// ── 시간별 이벤트 트렌드 ───────────────────────────────────────
export const hourlyTrend = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(23 - i).padStart(2, "0")}:00`,
  blocked: Math.floor(Math.random() * 80) + 10,
  allowed: Math.floor(Math.random() * 200) + 50,
  alerts: Math.floor(Math.random() * 15),
})).reverse();

// ── UEBA 위협 히트맵 (사용자 × 시간대) ──────────────────────────
export const uebaHeatmap = [
  { user: "shin.boyoung", scores: [0.1, 0.1, 0.87, 0.82, 0.1, 0.1, 0.1, 0.1, 0.3, 0.4, 0.2, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] },
  { user: "choi.yuna", scores: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.3, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.71, 0.68, 0.4] },
  { user: "park.minjae", scores: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.3, 0.58, 0.5, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] },
  { user: "yoon.taehyun", scores: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.41, 0.38, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] },
  { user: "lee.sooyeon", scores: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.22, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] },
];

// ── USB 요청 목록 (AURA 스캔 결과 포함) ──────────────────────────
export const usbRequests = [
  {
    id: "USB-2026-0847",
    user: "kim.junho",
    dept: "재무팀",
    deviceName: "SanDisk Ultra 32GB",
    deviceId: "VID_0781&PID_5583",
    manufacturer: "SanDisk Corp.",
    requestTime: subMinutes(now, 1),
    status: "pending",
    reason: "외부 발표용 자료 이동",
    riskScore: 0.72,
    files_copied: [
      { name: "급여명세서_전체.xlsx", sizeKB: 2048, sha256: "a3f7c2d8e1b495...", aura_score: 0.12, pii_detected: true },
      { name: "인사DB_백업.zip", sizeKB: 15360, sha256: "b4e8d3c9f2a506...", aura_score: 0.09, pii_detected: true },
    ],
  },
  {
    id: "USB-2026-0846",
    user: "park.minjae",
    dept: "개발팀",
    deviceName: "Samsung T7 SSD 1TB",
    deviceId: "VID_04E8&PID_6155",
    manufacturer: "Samsung Electronics",
    requestTime: subMinutes(now, 8),
    status: "pending",
    reason: "프로젝트 백업",
    riskScore: 0.55,
    files_copied: [
      { name: "source_code.zip", sizeKB: 51200, sha256: "c5f9e4d0g3b617...", aura_score: 0.08, pii_detected: false },
      { name: "setup_helper.exe", sizeKB: 18, sha256: "d6g0f5e1h4c728...", aura_score: 0.87, pii_detected: false },
    ],
  },
  {
    id: "USB-2026-0845",
    user: "jung.hyunwoo",
    dept: "영업팀",
    deviceName: "Kingston DT100 16GB",
    deviceId: "VID_0951&PID_1665",
    manufacturer: "Kingston Technology",
    requestTime: subMinutes(now, 35),
    status: "approved",
    reason: "고객사 미팅 자료",
    riskScore: 0.15,
    files_copied: [
      { name: "제안서_B사.pptx", sizeKB: 4096, sha256: "e7h1g6f2i5d839...", aura_score: 0.03, pii_detected: false },
    ],
  },
  {
    id: "USB-2026-0844",
    user: "choi.yuna",
    dept: "인사팀",
    deviceName: "Transcend JetFlash 8GB",
    deviceId: "VID_8564&PID_1000",
    manufacturer: "Transcend Info.",
    requestTime: subHours(now, 2),
    status: "rejected",
    reason: "개인 용도",
    riskScore: 0.88,
    files_copied: [
      { name: "직원명부_전체.xlsx", sizeKB: 1024, sha256: "f8i2h7g3j6e940...", aura_score: 0.05, pii_detected: true },
      { name: "급여대장.xlsx", sizeKB: 512, sha256: "g9j3i8h4k7f051...", aura_score: 0.06, pii_detected: true },
    ],
  },
  {
    id: "USB-2026-0843",
    user: "oh.sujin",
    dept: "마케팅팀",
    deviceName: "LG울트라 USB 64GB",
    deviceId: "VID_043E&PID_70FA",
    manufacturer: "LG Electronics",
    requestTime: subHours(now, 3),
    status: "approved",
    reason: "전시회 홍보물 배포",
    riskScore: 0.08,
    files_copied: [
      { name: "홍보영상.mp4", sizeKB: 204800, sha256: "h0k4j9i5l8g162...", aura_score: 0.02, pii_detected: false },
    ],
  },
];

// USB 화이트리스트
export const usbWhitelist = [
  { id: "WL-001", vid: "VID_0781", pid: "PID_5581", manufacturer: "SanDisk Corp.", model: "Ultra Series (Authorized)", dept: "재무팀", expires: format(subDays(now, -180), "yyyy-MM-dd"), status: "active" },
  { id: "WL-002", vid: "VID_04E8", pid: "PID_6155", manufacturer: "Samsung Electronics", model: "T7 SSD (Dev Team)", dept: "개발팀", expires: format(subDays(now, -90), "yyyy-MM-dd"), status: "active" },
  { id: "WL-003", vid: "VID_0951", pid: "PID_1665", manufacturer: "Kingston Technology", model: "DT100 G3 (Sales)", dept: "영업팀", expires: format(subDays(now, -30), "yyyy-MM-dd"), status: "expiring" },
  { id: "WL-004", vid: "VID_046D", pid: "PID_C52F", manufacturer: "Logitech", model: "USB Receiver (Allowed)", dept: "전체", expires: format(subDays(now, -365), "yyyy-MM-dd"), status: "active" },
];

// ── 네트워크 로그 (TrafficGPT 분류 포함) ──────────────────────────
export const networkLogs = [
  { id: 1, time: subMinutes(now, 2), user: "park.minjae", domain: "mega.nz", action: "BLOCK", category: "클라우드 스토리지", bytes: "0", direction: "업로드", risk: "high", traffic_intent: "data_exfil", cyberbert_class: "Exfiltration", mitre: "T1048", cti_source: "VirusTotal" },
  { id: 2, time: subMinutes(now, 5), user: "kang.jiyoung", domain: "1337x.to", action: "BLOCK", category: "토렌트", bytes: "0", direction: "다운로드", risk: "critical", traffic_intent: "vpn_tunnel", cyberbert_class: "Botnet", mitre: "T1071", cti_source: "AbuseIPDB" },
  { id: 3, time: subMinutes(now, 11), user: "lee.sooyeon", domain: "sharepoint.microsoft.com", action: "ALLOW", category: "업무 허용", bytes: "4.2MB", direction: "업로드", risk: "low", traffic_intent: "normal", cyberbert_class: "BENIGN", mitre: null, cti_source: null },
  { id: 4, time: subMinutes(now, 15), user: "yoon.taehyun", domain: "dropbox.com", action: "BLOCK", category: "클라우드 스토리지", bytes: "0", direction: "업로드", risk: "high", traffic_intent: "data_exfil", cyberbert_class: "Exfiltration", mitre: "T1048", cti_source: "URLhaus" },
  { id: 5, time: subMinutes(now, 22), user: "jung.hyunwoo", domain: "teams.microsoft.com", action: "ALLOW", category: "업무 허용", bytes: "1.1MB", direction: "업로드", risk: "low", traffic_intent: "normal", cyberbert_class: "BENIGN", mitre: null, cti_source: null },
  { id: 6, time: subMinutes(now, 28), user: "lim.changhyun", domain: "github.com", action: "ALLOW", category: "개발 허용", bytes: "342KB", direction: "업로드", risk: "low", traffic_intent: "normal", cyberbert_class: "BENIGN", mitre: null, cti_source: null },
  { id: 7, time: subMinutes(now, 33), user: "shin.boyoung", domain: "wetransfer.com", action: "BLOCK", category: "파일 전송", bytes: "0", direction: "업로드", risk: "high", traffic_intent: "data_exfil", cyberbert_class: "Exfiltration", mitre: "T1048", cti_source: "OpenPhish" },
  { id: 8, time: subMinutes(now, 45), user: "choi.yuna", domain: "docs.google.com", action: "BLOCK", category: "외부 문서", bytes: "0", direction: "업로드", risk: "medium", traffic_intent: "data_exfil", cyberbert_class: "Exfiltration", mitre: "T1048", cti_source: null },
  { id: 9, time: subMinutes(now, 52), user: "park.minjae", domain: "192.168.99.254", action: "BLOCK", category: "비인가 서버", bytes: "0", direction: "아웃바운드", risk: "critical", traffic_intent: "c2_beacon", cyberbert_class: "Botnet", mitre: "T1071", cti_source: "AbuseIPDB" },
  { id: 10, time: subMinutes(now, 61), user: "kim.junho", domain: "onedrive.live.com", action: "ALLOW", category: "업무 허용", bytes: "2.3MB", direction: "업로드", risk: "low", traffic_intent: "normal", cyberbert_class: "BENIGN", mitre: null, cti_source: null },
];

// 킬체인 시나리오
export const killchainScenario = {
  attacker: "shin.boyoung",
  stages: [
    { phase: "정찰", time: "02:15", event: "내부망 포트 스캔 감지", mitre: "T1046", severity: "medium" },
    { phase: "초기 침투", time: "02:22", event: "비인가 USB 연결 시도", mitre: "T1052", severity: "high" },
    { phase: "수집", time: "02:30", event: "대량 파일 접근 847건", mitre: "T1005", severity: "critical" },
    { phase: "데이터 준비", time: "02:45", event: "ZIP 압축 및 스테이징", mitre: "T1074", severity: "critical" },
    { phase: "유출 시도", time: "03:02", event: "mega.nz 업로드 시도 (차단)", mitre: "T1048", severity: "critical" },
  ],
};

// ── 프린트 로그 (GLiNER-PII 탐지 결과 포함) ───────────────────────
export const printLogs = [
  { id: 1, time: subMinutes(now, 3), user: "lee.sooyeon", file: "급여명세서_2026Q2.xlsx", pages: 12, printer: "HP LaserJet-3F", watermark: true, ip: "192.168.1.45", dept: "재무팀", pii: simulatePIIDetection("급여명세서", 12), approved: true },
  { id: 2, time: subMinutes(now, 7), user: "yoon.taehyun", file: "개발계획서_v3.pptx", pages: 35, printer: "Canon imageRUNNER-5F", watermark: true, ip: "192.168.2.112", dept: "개발팀", pii: simulatePIIDetection("개발계획서", 35), approved: true },
  { id: 3, time: subMinutes(now, 15), user: "oh.sujin", file: "마케팅전략_2026.pdf", pages: 24, printer: "HP LaserJet-3F", watermark: true, ip: "192.168.1.87", dept: "마케팅팀", pii: simulatePIIDetection("마케팅전략", 24), approved: true },
  { id: 4, time: subMinutes(now, 28), user: "kim.junho", file: "계약서_A사.docx", pages: 8, printer: "Konica Minolta-2F", watermark: true, ip: "192.168.0.234", dept: "재무팀", pii: simulatePIIDetection("계약서", 8), approved: true },
  { id: 5, time: subMinutes(now, 42), user: "jung.hyunwoo", file: "고객제안서_B사.pptx", pages: 45, printer: "Canon imageRUNNER-5F", watermark: true, ip: "192.168.2.56", dept: "영업팀", pii: simulatePIIDetection("고객제안서", 45), approved: true },
  { id: 6, time: subHours(now, 1), user: "park.minjae", file: "소스코드_리뷰.pdf", pages: 6, printer: "HP LaserJet-3F", watermark: true, ip: "192.168.2.101", dept: "개발팀", pii: simulatePIIDetection("소스코드", 6), approved: true },
  { id: 7, time: subHours(now, 1.5), user: "choi.yuna", file: "인사발령_2026H2.xlsx", pages: 3, printer: "Konica Minolta-2F", watermark: true, ip: "192.168.0.178", dept: "인사팀", pii: simulatePIIDetection("인사발령", 3), approved: false },
];

// ── UEBA 위협 분석 (Transformer+GNN 스코어 포함) ─────────────────
export const uebaThreats = [
  { user: "shin.boyoung", dept: "개발팀", score: 0.87, anomalies: ["야간(02:30) 대량 파일 접근 847건", "USB 비인가 연결 시도 3회", "VPN 외부 접속 후 내부망 데이터 다운로드"], riskLevel: "critical", lastActivity: subMinutes(now, 55), transformer_score: 0.89, gnn_score: 0.85, narrative: "Mass file collection + staging detected. MITRE T1083→T1074→T1048 kill chain.", shap_top: [{ factor: "야간 접근", shap: 0.31 }, { factor: "파일 접근량", shap: 0.28 }, { factor: "USB 시도", shap: 0.18 }] },
  { user: "choi.yuna", dept: "인사팀", score: 0.71, anomalies: ["근무시간 외 인사DB 접근 (22:15)", "대량 레코드 출력 (직원 전체 명단)", "개인 이메일로 첨부파일 전송 시도"], riskLevel: "high", lastActivity: subHours(now, 2), transformer_score: 0.73, gnn_score: 0.68, narrative: "After-hours HR database access with bulk export. T1078→T1005→T1041 pattern.", shap_top: [{ factor: "시간외 접근", shap: 0.25 }, { factor: "대량 출력", shap: 0.22 }, { factor: "이메일 전송", shap: 0.15 }] },
  { user: "park.minjae", dept: "개발팀", score: 0.58, anomalies: ["외부 클라우드 업로드 시도 (Mega.nz)", "소스코드 ZIP 압축 후 이메일 전송"], riskLevel: "high", lastActivity: subMinutes(now, 5), transformer_score: 0.60, gnn_score: 0.55, narrative: "Source code exfiltration attempt via cloud storage. T1074→T1048.", shap_top: [{ factor: "클라우드 업로드", shap: 0.32 }, { factor: "ZIP 압축", shap: 0.18 }] },
  { user: "yoon.taehyun", dept: "개발팀", score: 0.41, anomalies: ["Dropbox 업로드 시도 4회 차단", "이례적인 대량 인쇄 (35페이지)"], riskLevel: "medium", lastActivity: subMinutes(now, 33), transformer_score: 0.42, gnn_score: 0.39, narrative: "Multiple blocked cloud uploads + large print job. T1048 attempt pattern.", shap_top: [{ factor: "업로드 차단 횟수", shap: 0.28 }, { factor: "인쇄량", shap: 0.12 }] },
  { user: "lee.sooyeon", dept: "재무팀", score: 0.22, anomalies: ["급여 데이터 정기 접근 (정상 패턴)"], riskLevel: "low", lastActivity: subMinutes(now, 3), transformer_score: 0.22, gnn_score: 0.21, narrative: "Regular payroll data access within authorized hours. Normal operation.", shap_top: [{ factor: "접근 빈도", shap: 0.08 }] },
];

export const uebaScoreTrend = Array.from({ length: 14 }, (_, i) => ({
  date: format(subDays(now, 13 - i), "MM/dd"),
  shin: Math.min(0.99, 0.45 + i * 0.035 + Math.random() * 0.05),
  choi: Math.min(0.99, 0.35 + i * 0.025 + Math.random() * 0.06),
  park: Math.min(0.99, 0.28 + i * 0.02 + Math.random() * 0.07),
}));

// ── 블록체인 무결성 ────────────────────────────────────────────
export const integrityRecords = [
  { id: "BLK-20260625-001", file: "logshield-agent.exe", hash: "a3f7c2d8e1b4950f6c21d3a8f7e2b1c4", status: "verified", blockHeight: 10847, txId: "0x8f4a2d1e9b3c7f5a", timestamp: subMinutes(now, 5), channel: "logshield-channel", recoveryUrl: null },
  { id: "BLK-20260625-002", file: "policy-config.enc", hash: "b4e8d3c9f2a5061g7d32e4b9g8f3c2d5", status: "verified", blockHeight: 10846, txId: "0x7e3b1c0d8a2f6e4b", timestamp: subMinutes(now, 15), channel: "logshield-channel", recoveryUrl: null },
  { id: "BLK-20260625-003", file: "minifilter-drv.sys", hash: "c5f9e4d0g3b6172h8e43f5c0h9g4d3e6", status: "verified", blockHeight: 10845, txId: "0x6d2a0b9c7e1f5d3c", timestamp: subMinutes(now, 30), channel: "logshield-channel", recoveryUrl: null },
  { id: "BLK-20260625-004", file: "wfp-callout.sys", hash: "d6g0f5e1h4c7283i9f54g6d1i0h5e4f7", status: "verified", blockHeight: 10844, txId: "0x5c1f9a8b6d0e4c2a", timestamp: subHours(now, 1), channel: "logshield-channel", recoveryUrl: null },
  { id: "BLK-20260625-005", file: "ai-model-config.json", hash: "e7h1g6f2i5d8394j0g65h7e2j1i6f5g8", status: "tampered", blockHeight: 10843, txId: "0x4b0e8f7a5c9d3b1f", timestamp: subHours(now, 2), channel: "logshield-channel", recoveryUrl: "https://storage.logshield.io/backup/ai-model-config.json" },
  { id: "BLK-20260624-089", file: "cert-store.p12", hash: "f8i2h7g3j6e9405k1h76i8f3k2j7g6h9", status: "verified", blockHeight: 10820, txId: "0x3a9d7e6f4b8c2a0e", timestamp: subHours(now, 6), channel: "logshield-channel", recoveryUrl: null },
];

// Fabric 블록 타임라인
export const fabricTimeline = Array.from({ length: 20 }, (_, i) => ({
  blockHeight: 10847 - i,
  txCount: Math.floor(Math.random() * 5) + 1,
  timestamp: subMinutes(now, i * 5 + Math.random() * 3),
  channel: "logshield-channel",
  hasAlert: i === 4,
}));

export type EventSeverity = "critical" | "high" | "medium" | "low";
export type UsbStatus = "pending" | "approved" | "rejected";
export type SensitivityLevel = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "TOP_SECRET";
