import {
  simulateSecEBL,
  simulateTrafficGPT,
  mapToMITRE,
  type TrafficGPTResult,
} from "./security-engine";

export type SecurityFinding = {
  id: string;
  category: "availability" | "headers" | "traffic" | "behavior" | "integrity";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  detail: string;
  mitre?: string;
  engine?: string;
};

const SECURITY_HEADERS = [
  { key: "strict-transport-security", title: "HSTS 미설정", severity: "medium" as const },
  { key: "content-security-policy", title: "CSP 미설정", severity: "medium" as const },
  { key: "x-frame-options", title: "Clickjacking 방어 헤더 없음", severity: "low" as const },
  { key: "x-content-type-options", title: "MIME 스니핑 방어 없음", severity: "low" as const },
];

export async function scanSiteSecurity(
  name: string,
  url: string,
  status: string,
  httpCode: number | null,
): Promise<{ findings: SecurityFinding[]; traffic: TrafficGPTResult | null }> {
  const findings: SecurityFinding[] = [];

  if (status === "down") {
    findings.push({
      id: "avail-down",
      category: "availability",
      severity: "critical",
      title: "서비스 가용성 장애",
      detail: `${name} (${url}) — HTTP ${httpCode ?? "연결 실패"}`,
      mitre: "T1499",
      engine: "LogShield Uptime",
    });
    return { findings, traffic: null };
  }

  let hostname = "";
  try {
    hostname = new URL(url).hostname;
  } catch {
    findings.push({
      id: "url-invalid",
      category: "availability",
      severity: "high",
      title: "잘못된 URL",
      detail: url,
      engine: "LogShield Uptime",
    });
    return { findings, traffic: null };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);

    for (const h of SECURITY_HEADERS) {
      if (!res.headers.get(h.key)) {
        findings.push({
          id: `hdr-${h.key}`,
          category: "headers",
          severity: h.severity,
          title: h.title,
          detail: `${hostname} 응답 헤더에 ${h.key} 없음`,
          mitre: "T1190",
          engine: "LogShield WebShield",
        });
      }
    }

    if (httpCode && httpCode >= 500) {
      findings.push({
        id: "http-5xx",
        category: "availability",
        severity: "high",
        title: "서버 오류 응답",
        detail: `HTTP ${httpCode}`,
        engine: "LogShield Uptime",
      });
    }
  } catch {
    findings.push({
      id: "hdr-scan-skip",
      category: "headers",
      severity: "info",
      title: "헤더 심층 스캔 생략",
      detail: "HEAD 요청 실패 — 가용성만 확인됨",
      engine: "LogShield WebShield",
    });
  }

  const traffic = simulateTrafficGPT(hostname, status === "up" ? "ALLOW" : "BLOCK", "업무 SaaS");
  if (traffic.intent !== "normal") {
    findings.push({
      id: "traffic-gpt",
      category: "traffic",
      severity: traffic.intent === "data_exfil" ? "high" : "medium",
      title: `TrafficGPT: ${traffic.cyberbert_class}`,
      detail: `${hostname} — ${traffic.intent} (신뢰도 ${(traffic.confidence * 100).toFixed(0)}%)`,
      mitre: traffic.mitre?.id,
      engine: "TrafficGPT / LaBackDoor",
    });
  }

  const secebl = simulateSecEBL("NETWORK", `${name} ${hostname}`, status === "up" ? "허용" : "차단");
  if (secebl.verdict !== "normal_operation") {
    const mitre = mapToMITRE("NETWORK", hostname, secebl.top_labels[0]?.label ?? "");
    findings.push({
      id: "secebl",
      category: "behavior",
      severity: secebl.verdict === "intrusion" ? "critical" : "high",
      title: `SecEBL: ${secebl.top_labels[0]?.label ?? "suspicious"}`,
      detail: `${name} 외부 노출面 행동 분석 — ${secebl.verdict}`,
      mitre: mitre?.id,
      engine: "willchen0011/SecEBL",
    });
  }

  findings.push({
    id: "integrity-ok",
    category: "integrity",
    severity: "info",
    title: "블록체인 무결성 앵커",
    detail: `Hyperledger Fabric ledger에 ${hostname} 점검 기록 예정 (데모)`,
    engine: "LogShield Fabric 2.5",
  });

  return { findings, traffic };
}

export function summarizeFindings(findings: SecurityFinding[]) {
  const score = findings.reduce((s, f) => {
    const w =
      f.severity === "critical"
        ? 40
        : f.severity === "high"
          ? 25
          : f.severity === "medium"
            ? 12
            : f.severity === "low"
              ? 5
              : 0;
    return s + w;
  }, 0);
  const grade =
    score >= 60 ? "critical" : score >= 35 ? "high" : score >= 15 ? "medium" : "low";
  return { score: Math.min(100, score), grade };
}
