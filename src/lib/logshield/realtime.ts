/**
 * 실시간 이벤트 시뮬레이터
 * 실제 환경에서는 WebSocket/SSE로 교체
 */

const USERS = ["kim.junho", "lee.sooyeon", "park.minjae", "choi.yuna", "jung.hyunwoo", "shin.boyoung", "yoon.taehyun", "oh.sujin"];
const TYPES = ["USB", "PRINT", "NETWORK", "FILE", "UEBA"] as const;
const ACTIONS: Record<string, string[]> = {
  USB: ["차단", "승인 요청", "허용"],
  PRINT: ["워터마크 적용", "감사 로그 기록"],
  NETWORK: ["차단", "허용"],
  FILE: ["암호화 감지", "대량 복사 감지", "허용"],
  UEBA: ["이상 탐지", "행동 분석 완료"],
};
const DOMAINS = ["mega.nz", "dropbox.com", "teams.microsoft.com", "github.com", "wetransfer.com", "sharepoint.microsoft.com"];
const SEVERITIES = ["critical", "high", "medium", "low"] as const;
const SEVERITY_WEIGHTS = [0.05, 0.2, 0.35, 0.4];

function weightedRandom<T>(items: readonly T[], weights: number[]): T {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < weights.length; i++) {
    cum += weights[i];
    if (r < cum) return items[i];
  }
  return items[items.length - 1];
}

let _idCounter = 1000;

export function generateEvent() {
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  const user = USERS[Math.floor(Math.random() * USERS.length)];
  const actions = ACTIONS[type];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const severity = weightedRandom(SEVERITIES, SEVERITY_WEIGHTS);

  let detail = "";
  if (type === "NETWORK") detail = `${DOMAINS[Math.floor(Math.random() * DOMAINS.length)]} → ${action === "차단" ? "업로드 차단" : "접근 허용"}`;
  else if (type === "USB") detail = `${["SanDisk", "Kingston", "Samsung"][Math.floor(Math.random() * 3)]} USB ${(Math.random() * 60 + 8).toFixed(0)}GB`;
  else if (type === "PRINT") detail = `문서_${Math.floor(Math.random() * 9999)}.pdf (${Math.floor(Math.random() * 40 + 1)}p)`;
  else if (type === "FILE") detail = `파일 ${(Math.random() * 2 + 0.1).toFixed(1)}GB 작업 감지`;
  else detail = `행동 스코어 ${(Math.random() * 0.4 + 0.5).toFixed(2)} (임계값 0.70)`;

  return {
    id: ++_idCounter,
    time: new Date(),
    user,
    type,
    action,
    detail,
    severity,
  };
}

export function generateStats() {
  return {
    endpoints: 247 + Math.floor(Math.random() * 3 - 1),
    activeAlerts: Math.floor(Math.random() * 5) + 1,
    blockedEvents: 1284 + Math.floor(Math.random() * 20),
    usbRequests: Math.floor(Math.random() * 4) + 2,
    threatScore: Math.floor(Math.random() * 15 + 35),
    integrityOk: parseFloat((99 + Math.random() * 0.9).toFixed(1)),
  };
}

/** CSV 다운로드 유틸 */
export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => {
        const val = r[h];
        const str = val instanceof Date ? val.toISOString() : String(val ?? "");
        return `"${str.replace(/"/g, '""')}"`;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
