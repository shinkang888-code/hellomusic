/**
 * Lonex Logshield — 보안 엔진 시뮬레이터
 * HuggingFace 모델 출력 형식을 시뮬레이션합니다:
 * - willchen0011/SecEBL (행동-의도 레이블)
 * - Transformer+GNN UEBA (세션 위협 스코어)
 * - nvidia/gliner-PII (55+ 엔티티 탐지)
 * - PerkinsFund/AURA (PE 헤더 악성코드 분류)
 * - LaBackDoor/trafficgpt (네트워크 트래픽 의도 분류)
 */

// ── MITRE ATT&CK ───────────────────────────────────────────────────────────
export const MITRE_TECHNIQUES = [
  { id: "T1041", name: "Exfiltration Over C2 Channel", tactic: "Exfiltration" },
  { id: "T1048", name: "Exfil. Over Alternative Protocol", tactic: "Exfiltration" },
  { id: "T1071", name: "Application Layer Protocol", tactic: "Command and Control" },
  { id: "T1078", name: "Valid Accounts", tactic: "Defense Evasion" },
  { id: "T1110", name: "Brute Force", tactic: "Credential Access" },
  { id: "T1486", name: "Data Encrypted for Impact", tactic: "Impact" },
  { id: "T1059", name: "Command and Scripting Interpreter", tactic: "Execution" },
  { id: "T1055", name: "Process Injection", tactic: "Defense Evasion" },
  { id: "T1046", name: "Network Service Scanning", tactic: "Discovery" },
  { id: "T1083", name: "File and Directory Discovery", tactic: "Discovery" },
  { id: "T1005", name: "Data from Local System", tactic: "Collection" },
  { id: "T1564", name: "Hide Artifacts", tactic: "Defense Evasion" },
  { id: "T1547", name: "Boot/Logon Autostart Execution", tactic: "Persistence" },
  { id: "T1027", name: "Obfuscated Files or Information", tactic: "Defense Evasion" },
];

// ── SecEBL 행동 레이블 ─────────────────────────────────────────────────────
export const SECEBL_LABELS = [
  "file_collection", "data_staging", "credential_access",
  "lateral_movement", "network_reconnaissance", "privilege_escalation",
  "persistence_mechanism", "defense_evasion", "normal_operation",
  "file_transfer", "process_injection", "command_execution",
  "data_exfiltration", "c2_communication",
];

// ── PII 엔티티 타입 ────────────────────────────────────────────────────────
export const PII_ENTITY_TYPES = [
  { type: "person", label: "개인 성명", severity: 2 },
  { type: "email", label: "이메일 주소", severity: 2 },
  { type: "phone", label: "전화번호", severity: 2 },
  { type: "address", label: "주소", severity: 2 },
  { type: "account_number", label: "계좌번호", severity: 4 },
  { type: "ssn", label: "주민등록번호", severity: 5 },
  { type: "credit_card", label: "신용카드번호", severity: 5 },
  { type: "passport", label: "여권번호", severity: 4 },
  { type: "employee_id", label: "사원번호", severity: 2 },
  { type: "salary", label: "급여정보", severity: 4 },
  { type: "medical", label: "의료정보", severity: 4 },
  { type: "secret_key", label: "비밀키/API키", severity: 5 },
];

// 민감도 등급 분류
export type SensitivityLevel = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "TOP_SECRET";

export function classifySensitivity(
  piiEntities: Array<{ type: string; count: number; confidence: number }>
): SensitivityLevel {
  const maxSev = piiEntities.reduce((max, e) => {
    const found = PII_ENTITY_TYPES.find((p) => p.type === e.type);
    return Math.max(max, found ? found.severity : 0);
  }, 0);
  const totalCount = piiEntities.reduce((s, e) => s + e.count, 0);

  if (maxSev >= 5 || (maxSev >= 4 && totalCount > 5)) return "TOP_SECRET";
  if (maxSev >= 4 || (maxSev >= 2 && totalCount > 10)) return "CONFIDENTIAL";
  if (totalCount > 0) return "INTERNAL";
  return "PUBLIC";
}

// ── SecEBL L1 행동 레이블 시뮬레이터 ────────────────────────────────────────
export interface SecEBLResult {
  top_labels: Array<{ label: string; score: number }>;
  verdict: "normal_operation" | "suspicious" | "intrusion";
  confidence: number;
}

export function simulateSecEBL(
  eventType: string,
  detail: string,
  action: string
): SecEBLResult {
  const detailLower = (detail + " " + action).toLowerCase();

  let primary: string;
  let score: number;
  let verdict: SecEBLResult["verdict"] = "normal_operation";

  if (detailLower.includes("mega") || detailLower.includes("wetransfer") || detailLower.includes("dropbox")) {
    primary = "data_exfiltration"; score = 0.94; verdict = "intrusion";
  } else if (detailLower.includes("torrent") || detailLower.includes("tor ")) {
    primary = "c2_communication"; score = 0.89; verdict = "intrusion";
  } else if (detailLower.includes("대량") || detailLower.includes("bulk") || detailLower.includes("847")) {
    primary = "data_staging"; score = 0.82; verdict = "suspicious";
  } else if (detailLower.includes("usb") && detailLower.includes("차단")) {
    primary = "file_collection"; score = 0.76; verdict = "suspicious";
  } else if (detailLower.includes("야간") || detailLower.includes("22:") || detailLower.includes("02:")) {
    primary = "credential_access"; score = 0.71; verdict = "suspicious";
  } else if (eventType === "UEBA") {
    primary = "data_staging"; score = 0.88; verdict = "intrusion";
  } else if (detailLower.includes("sharepoint") || detailLower.includes("teams")) {
    primary = "normal_operation"; score = 0.95; verdict = "normal_operation";
  } else {
    primary = "normal_operation"; score = 0.72 + Math.random() * 0.2; verdict = "normal_operation";
  }

  const secondLabel = SECEBL_LABELS.filter((l) => l !== primary)[Math.floor(Math.random() * 5)];
  return {
    top_labels: [
      { label: primary, score: score },
      { label: secondLabel, score: score * 0.3 + Math.random() * 0.1 },
    ],
    verdict,
    confidence: score,
  };
}

// ── MITRE ATT&CK 매핑 ──────────────────────────────────────────────────────
export function mapToMITRE(
  eventType: string,
  detail: string,
  seceblLabel: string
): typeof MITRE_TECHNIQUES[0] | null {
  const d = detail.toLowerCase();

  if (seceblLabel === "data_exfiltration") return MITRE_TECHNIQUES.find((t) => t.id === "T1048") ?? null;
  if (seceblLabel === "c2_communication") return MITRE_TECHNIQUES.find((t) => t.id === "T1071") ?? null;
  if (seceblLabel === "data_staging") return MITRE_TECHNIQUES.find((t) => t.id === "T1005") ?? null;
  if (seceblLabel === "file_collection") return MITRE_TECHNIQUES.find((t) => t.id === "T1083") ?? null;
  if (seceblLabel === "credential_access") return MITRE_TECHNIQUES.find((t) => t.id === "T1078") ?? null;
  if (seceblLabel === "process_injection") return MITRE_TECHNIQUES.find((t) => t.id === "T1055") ?? null;
  if (seceblLabel === "persistence_mechanism") return MITRE_TECHNIQUES.find((t) => t.id === "T1547") ?? null;
  if (d.includes("ransom") || d.includes("encrypt")) return MITRE_TECHNIQUES.find((t) => t.id === "T1486") ?? null;
  if (d.includes("scan")) return MITRE_TECHNIQUES.find((t) => t.id === "T1046") ?? null;
  return null;
}

// ── nvidia/gliner-PII 시뮬레이터 ────────────────────────────────────────────
export interface PIIDetectionResult {
  entities: Array<{ type: string; label: string; count: number; confidence: number }>;
  sensitivity_level: SensitivityLevel;
  requires_approval: boolean;
  total_entities: number;
}

const FILE_PII_MAP: Record<string, Array<{ type: string; count: number }>> = {
  "급여명세서": [{ type: "person", count: 1 }, { type: "account_number", count: 1 }, { type: "salary", count: 1 }, { type: "employee_id", count: 1 }],
  "인사발령": [{ type: "person", count: 12 }, { type: "employee_id", count: 12 }, { type: "salary", count: 12 }],
  "계약서": [{ type: "person", count: 3 }, { type: "email", count: 2 }, { type: "phone", count: 2 }, { type: "address", count: 1 }],
  "고객제안서": [{ type: "person", count: 2 }, { type: "email", count: 3 }, { type: "phone", count: 2 }],
  "개발계획서": [{ type: "employee_id", count: 2 }, { type: "email", count: 1 }],
  "마케팅전략": [{ type: "person", count: 1 }, { type: "email", count: 2 }],
  "소스코드": [{ type: "secret_key", count: 2 }, { type: "email", count: 1 }],
};

export function simulatePIIDetection(fileName: string, pages: number): PIIDetectionResult {
  let rawEntities: Array<{ type: string; count: number }> = [];

  for (const [key, entities] of Object.entries(FILE_PII_MAP)) {
    if (fileName.includes(key)) {
      rawEntities = entities;
      break;
    }
  }

  if (rawEntities.length === 0 && pages > 20) {
    rawEntities = [{ type: "person", count: Math.floor(pages / 5) }, { type: "email", count: Math.floor(pages / 8) }];
  }

  const entities = rawEntities.map((e) => {
    const piiType = PII_ENTITY_TYPES.find((p) => p.type === e.type)!;
    return {
      type: e.type,
      label: piiType?.label ?? e.type,
      count: e.count,
      confidence: 0.82 + Math.random() * 0.15,
    };
  });

  const sensitivity_level = classifySensitivity(entities);
  return {
    entities,
    sensitivity_level,
    requires_approval: sensitivity_level === "CONFIDENTIAL" || sensitivity_level === "TOP_SECRET",
    total_entities: entities.reduce((s, e) => s + e.count, 0),
  };
}

// ── PerkinsFund/AURA PE 스캐너 시뮬레이터 ────────────────────────────────────
export interface AURAResult {
  classification: "benign" | "malware";
  confidence: number;
  malware_family?: string;
  pe_entropy: number;
  packer_detected: boolean;
  risk_indicators: string[];
}

const RANSOMWARE_FAMILIES = ["Conti", "LockBit", "Ryuk", "Revil", "Darkside", "Phobos", "Dharma"];

export function simulateAURA(fileName: string, fileSizeKB: number): AURAResult {
  const nameLower = fileName.toLowerCase();
  const isSuspicious =
    nameLower.includes(".exe") ||
    nameLower.includes(".bat") ||
    nameLower.includes(".ps1") ||
    (fileSizeKB < 50 && nameLower.endsWith(".exe"));

  const isHighRisk = fileSizeKB < 20 && nameLower.endsWith(".exe");
  const entropy = isHighRisk ? 7.2 + Math.random() * 0.6 : 5.1 + Math.random() * 1.5;
  const classification: AURAResult["classification"] = isHighRisk && Math.random() > 0.3 ? "malware" : "benign";

  const indicators: string[] = [];
  if (entropy > 7.0) indicators.push("고 엔트로피 — 패킹/암호화 가능성");
  if (isHighRisk) indicators.push("비정상적으로 작은 PE 크기");
  if (nameLower.includes("update") || nameLower.includes("install")) indicators.push("업데이터 위장 패턴 감지");
  if (classification === "malware") indicators.push("악성코드 서명 패턴 매칭");

  return {
    classification,
    confidence: classification === "malware" ? 0.87 + Math.random() * 0.1 : 0.91 + Math.random() * 0.08,
    malware_family: classification === "malware" ? RANSOMWARE_FAMILIES[Math.floor(Math.random() * RANSOMWARE_FAMILIES.length)] : undefined,
    pe_entropy: entropy,
    packer_detected: entropy > 6.8,
    risk_indicators: indicators,
  };
}

// ── TrafficGPT 네트워크 의도 분류 시뮬레이터 ────────────────────────────────
export type TrafficIntent = "normal" | "c2_beacon" | "data_exfil" | "vpn_tunnel" | "dns_tunnel" | "port_scan";

export interface TrafficGPTResult {
  intent: TrafficIntent;
  cyberbert_class: "BENIGN" | "DoS" | "BruteForce" | "PortScan" | "Botnet" | "Exfiltration";
  confidence: number;
  mitre?: typeof MITRE_TECHNIQUES[0];
  cti_match?: { source: string; score: number };
  flow_features_summary: { bytes_ratio: number; packet_rate: number; duration_sec: number };
}

const HIGH_RISK_DOMAINS = [
  "mega.nz", "wetransfer.com", "1337x.to", "thepiratebay.org",
  "dropbox.com", "sendspace.com", "anonfiles.com",
];
const CTI_SOURCES = ["AbuseIPDB", "VirusTotal", "OpenPhish", "URLhaus"];

export function simulateTrafficGPT(domain: string, action: string, category: string): TrafficGPTResult {
  const isHighRisk = HIGH_RISK_DOMAINS.includes(domain) || category.includes("토렌트") || category.includes("파일 전송");
  const isC2 = domain.includes(".onion") || domain.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);

  let intent: TrafficIntent = "normal";
  let cyberbert_class: TrafficGPTResult["cyberbert_class"] = "BENIGN";

  if (category.includes("토렌트")) { intent = "vpn_tunnel"; cyberbert_class = "Botnet"; }
  else if (isHighRisk && action === "BLOCK") { intent = "data_exfil"; cyberbert_class = "Exfiltration"; }
  else if (isC2) { intent = "c2_beacon"; cyberbert_class = "Botnet"; }
  else if (category.includes("업무")) { intent = "normal"; cyberbert_class = "BENIGN"; }

  const mitre = intent === "data_exfil" ? MITRE_TECHNIQUES.find((t) => t.id === "T1048") :
    intent === "c2_beacon" ? MITRE_TECHNIQUES.find((t) => t.id === "T1071") : undefined;

  const cti_match = isHighRisk ? {
    source: CTI_SOURCES[Math.floor(Math.random() * CTI_SOURCES.length)],
    score: 0.75 + Math.random() * 0.2,
  } : undefined;

  return {
    intent,
    cyberbert_class,
    confidence: 0.88 + Math.random() * 0.1,
    mitre,
    cti_match,
    flow_features_summary: {
      bytes_ratio: isHighRisk ? 0.1 + Math.random() * 0.3 : 0.4 + Math.random() * 0.5,
      packet_rate: isHighRisk ? 180 + Math.random() * 100 : 20 + Math.random() * 50,
      duration_sec: 0.5 + Math.random() * 10,
    },
  };
}

// ── Transformer+GNN UEBA 스코어 시뮬레이터 ───────────────────────────────────
export interface UEBASessionScore {
  transformer_score: number;
  gnn_score: number;
  final_score: number;
  risk_level: "critical" | "high" | "medium" | "low";
  secebl_top_labels: Array<{ label: string; score: number; event_count: number }>;
  anomalies: Array<{ description: string; mitre: string; shap_value: number }>;
  narrative: string;
  baseline_deviation: number;
}

const NARRATIVES: Record<string, string> = {
  "shin.boyoung": "Process lifecycle analysis shows mass file enumeration (T1083) at 02:30 with 847 file access events, followed by USB connection attempt (T1052.001). MITRE ATT&CK: Collection → Exfiltration pattern. Analyst assessment: HIGH CONFIDENCE insider threat — data staging for exfiltration.",
  "choi.yuna": "After-hours access to HR database at 22:15 with bulk record export (T1005). Print job of full employee roster (T1041) followed by attempted email attachment to personal account. MITRE: Collection → Exfiltration. Assess: Medium-High insider threat.",
  "park.minjae": "External cloud upload attempt to mega.nz (T1048) following source code ZIP archive creation (T1074). MITRE: Collection → Exfiltration via Alternative Protocol. Assess: Active data exfiltration attempt.",
  "yoon.taehyun": "Multiple blocked Dropbox upload attempts (T1048.002). Large print job 35 pages (T1041). Pattern consistent with opportunistic data staging. MITRE: Collection phase. Assess: Moderate risk.",
};

export function simulateUEBAScore(user: string, existingScore: number): UEBASessionScore {
  const transformer_score = existingScore + (Math.random() - 0.5) * 0.05;
  const gnn_score = existingScore * 0.9 + Math.random() * 0.15;
  const final_score = Math.min(0.99, (transformer_score + gnn_score) / 2);
  const risk_level = final_score >= 0.75 ? "critical" : final_score >= 0.55 ? "high" : final_score >= 0.35 ? "medium" : "low";

  const anomalyCount = risk_level === "critical" ? 3 : risk_level === "high" ? 2 : 1;
  const mitreTechs = MITRE_TECHNIQUES.filter((t) => ["T1083", "T1005", "T1048", "T1078", "T1041"].includes(t.id));
  const anomalies = Array.from({ length: anomalyCount }, (_, i) => ({
    description: ["야간 대량 파일 접근 패턴", "외부 업로드 시도", "비인가 USB 연결", "대량 인쇄 이상", "이상 네트워크 연결"][i % 5],
    mitre: mitreTechs[i % mitreTechs.length].id,
    shap_value: 0.15 + (anomalyCount - i) * 0.12 + Math.random() * 0.05,
  }));

  return {
    transformer_score,
    gnn_score,
    final_score,
    risk_level,
    secebl_top_labels: [
      { label: "data_staging", score: 0.72 + Math.random() * 0.15, event_count: 12 + Math.floor(Math.random() * 20) },
      { label: "file_collection", score: 0.45 + Math.random() * 0.2, event_count: 6 + Math.floor(Math.random() * 10) },
    ],
    anomalies,
    narrative: NARRATIVES[user] ?? `Automated analysis: User ${user} exhibits ${risk_level} risk behavior patterns. Session analysis via Transformer+GNN model (CERT r6.2 fine-tuned).`,
    baseline_deviation: (final_score - 0.1) / 0.9,
  };
}
