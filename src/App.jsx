import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const STEP1_OPTIONS = [
  { id: "cn-unicom",  label: "中国扫描器 (联通)", next: "中国-徐州3-QY300M" },
  { id: "cn-telecom", label: "中国扫描器 (电信)",  next: "中国-徐州3-QY300M" },
  { id: "cn-mobile",  label: "中国扫描器 (移动)",  next: "中国-徐州3-QY300M" },
  { id: "cn-xuzhou",  label: "中国-徐州3-QY300M",  next: "日本1-akamai" },
  { id: "jp-akamai",  label: "日本1-akamai",       next: "美国-LA11-ZEN-出" },
  { id: "us-la-zen",  label: "美国-LA11-ZEN-出",   next: "Google.com" },
];

const TIME_RANGES = [
  { label: "15分钟", points: 15, stepMin: 1 },
  { label: "1小时",  points: 12, stepMin: 5 },
  { label: "3小时",  points: 18, stepMin: 10 },
  { label: "6小时",  points: 24, stepMin: 15 },
  { label: "12小时", points: 24, stepMin: 30 },
  { label: "24小时", points: 24, stepMin: 60 },
];

const CONN_RANGES = [
  { label: "1小时",  points: 12, stepMin: 5 },
  { label: "6小时",  points: 24, stepMin: 15 },
  { label: "12小时", points: 24, stepMin: 30 },
  { label: "24小时", points: 48, stepMin: 30 },
];

const ALERT_TYPES = ["全部", "疑似不通", "延迟超标", "丢包"];
const ISP_TYPES   = ["全部", "联通", "电信", "移动"];

const ALERT_STYLE = {
  "疑似不通": { bg: "#fee2e2", color: "#dc2626" },
  "延迟超标": { bg: "#fef3c7", color: "#d97706" },
  "丢包":     { bg: "#ede9fe", color: "#7c3aed" },
};

const TRIGGER_LOGS = [
  { type: "疑似不通", src: "—",              dst: "—",           isp: "全部", value: "超时 20s",              time: "2026-05-14 13:40:00" },
  { type: "延迟超标", src: "中国扫描器 (联通)", dst: "日本1-akamai", isp: "联通", value: "45ms → 198ms (+153ms)", time: "2026-05-14 14:01:00" },
  { type: "延迟超标", src: "中国扫描器 (移动)", dst: "日本1-akamai", isp: "移动", value: "45ms → 210ms (+165ms)", time: "2026-05-14 14:03:00" },
  { type: "丢包",     src: "中国扫描器 (电信)", dst: "日本1-akamai", isp: "电信", value: "14%（14/100 包）",      time: "2026-05-14 14:10:00" },
  { type: "丢包",     src: "日本1-akamai",    dst: "美国-LA11-ZEN-出", isp: "—", value: "23%（23/100 包）",      time: "2026-05-14 14:18:00" },
  { type: "延迟超标", src: "美国-LA11-ZEN-出", dst: "Google.com",  isp: "—",   value: "8ms → 超时（>20s）",    time: "2026-05-14 14:55:00" },
  { type: "疑似不通", src: "—",              dst: "—",           isp: "全部", value: "超时 20s",              time: "2026-05-14 15:22:00" },
  { type: "延迟超标", src: "中国扫描器 (联通)", dst: "日本1-akamai", isp: "联通", value: "45ms → 163ms (+118ms)", time: "2026-05-14 15:35:00" },
  { type: "丢包",     src: "中国扫描器 (电信)", dst: "日本1-akamai", isp: "电信", value: "11%（11/100 包）",      time: "2026-05-14 15:48:00" },
  { type: "延迟超标", src: "中国扫描器 (移动)", dst: "日本1-akamai", isp: "移动", value: "60ms → 188ms (+128ms)", time: "2026-05-14 16:20:00" },
  { type: "丢包",     src: "中国扫描器 (联通)", dst: "日本1-akamai", isp: "联通", value: "9%（9/100 包）",        time: "2026-05-14 16:35:00" },
  { type: "延迟超标", src: "中国扫描器 (移动)", dst: "日本1-akamai", isp: "移动", value: "32ms → 145ms (+113ms)", time: "2026-05-14 16:50:00" },
  { type: "疑似不通", src: "—",              dst: "—",           isp: "全部", value: "超时 20s",              time: "2026-05-14 17:05:00" },
  { type: "丢包",     src: "日本1-akamai",    dst: "美国-LA11-ZEN-出", isp: "—", value: "18%（18/100 包）",      time: "2026-05-14 17:20:00" },
  { type: "延迟超标", src: "中国扫描器 (电信)", dst: "日本1-akamai", isp: "电信", value: "50ms → 230ms (+180ms)", time: "2026-05-14 17:40:00" },
  { type: "丢包",     src: "中国扫描器 (移动)", dst: "日本1-akamai", isp: "移动", value: "27%（27/100 包）",      time: "2026-05-14 17:55:00" },
  { type: "延迟超标", src: "美国-LA11-ZEN-出", dst: "Google.com",  isp: "—",   value: "15ms → 超时（>20s）",   time: "2026-05-14 18:10:00" },
  { type: "疑似不通", src: "—",              dst: "—",           isp: "全部", value: "超时 20s",              time: "2026-05-14 18:30:00" },
  { type: "丢包",     src: "中国扫描器 (电信)", dst: "日本1-akamai", isp: "电信", value: "33%（33/100 包）",      time: "2026-05-14 18:45:00" },
  { type: "延迟超标", src: "中国扫描器 (联通)", dst: "日本1-akamai", isp: "联通", value: "38ms → 172ms (+134ms)", time: "2026-05-14 19:00:00" },
  { type: "丢包",     src: "中国扫描器 (电信)", dst: "日本1-akamai", isp: "电信", value: "16%（16/100 包）",      time: "2026-05-14 19:15:00" },
  { type: "延迟超标", src: "中国扫描器 (移动)", dst: "日本1-akamai", isp: "移动", value: "22ms → 98ms (+76ms)",   time: "2026-05-14 19:30:00" },
];

const VALUE_COLOR = { "疑似不通": "#dc2626", "延迟超标": "#f97316", "丢包": "#3b82f6" };

const METRICS = [
  { key: "延迟", unit: "ms", base: 18, spread: 10, yMax: 60,  color: "#f97316", gradId: "gradOrange" },
  { key: "丢包", unit: "%",  base: 1,  spread: 3,  yMax: 15,  color: "#3b82f6", gradId: "gradBlue" },
  { key: "抖动", unit: "ms", base: 5,  spread: 8,  yMax: 40,  color: "#8b5cf6", gradId: "gradPurple" },
];

function seeded(seed, n) {
  let s = seed;
  return Array.from({ length: n }, () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(s);
  });
}

function genData(points, stepMin, base, spread, seed) {
  const randoms = seeded(seed, points);
  const now = new Date();
  return randoms.map((r, i) => {
    const t = new Date(now - (points - 1 - i) * stepMin * 60000);
    const hh = t.getHours().toString().padStart(2, "0");
    const mm = t.getMinutes().toString().padStart(2, "0");
    const val = Math.max(0, Math.round(base + (r % 1000) / 1000 * spread));
    return { time: `${hh}:${mm}`, value: val };
  });
}

const ChartTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 6, padding: "5px 10px", fontSize: 11 }}>
      <p style={{ color: "#9ca3af", marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 500, color: "#111" }}>{payload[0].value}{unit}</p>
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, padding: "12px 14px", ...style }}>
    {children}
  </div>
);

const CardTitle = ({ icon, children }) => (
  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
    <span style={{ fontSize: 13 }}>{icon}</span>
    {children}
  </div>
);

const FieldRow = ({ label, children, alignTop }) => (
  <div style={{
    display: "flex", justifyContent: "space-between",
    alignItems: alignTop ? "flex-start" : "center",
    padding: "5px 0", borderBottom: "0.5px solid #f3f4f6", fontSize: 12
  }}>
    <span style={{ color: "#9ca3af", flexShrink: 0 }}>{label}</span>
    <div style={{ textAlign: "right" }}>{children}</div>
  </div>
);

const Pill = ({ children, color = "#f3f4f6", text = "#6b7280", border = "#e5e7eb" }) => (
  <span style={{
    fontSize: 10, padding: "1px 7px", borderRadius: 10,
    background: color, color: text, border: `0.5px solid ${border}`,
    display: "inline-block"
  }}>{children}</span>
);

export default function NodeDetailPage() {
  const [metricIdx, setMetricIdx]   = useState(0);
  const [rangeIdx, setRangeIdx]     = useState(0);
  const [connRangeIdx, setConnRangeIdx] = useState(0);
  const [step1Idx, setStep1Idx]     = useState(4);
  const [alertFilter, setAlertFilter] = useState("全部");
  const [ispFilter, setIspFilter]     = useState("全部");
  const [logPage, setLogPage]         = useState(1);

  const LOG_PAGE_SIZE = 10;

  const metric   = METRICS[metricIdx];
  const range    = TIME_RANGES[rangeIdx];
  const connRange = CONN_RANGES[connRangeIdx];
  const step2Label = STEP1_OPTIONS[step1Idx].next;

  const latencyData = useMemo(() =>
    genData(range.points, range.stepMin, metric.base, metric.spread, metricIdx * 100 + step1Idx * 10 + rangeIdx),
    [metricIdx, rangeIdx, step1Idx]
  );

  const connData = useMemo(() =>
    genData(connRange.points, connRange.stepMin, 18, 28, connRangeIdx * 77),
    [connRangeIdx]
  );

  const yTickFormatter = v => `${v}${metric.unit}`;

  const filteredLogs = TRIGGER_LOGS.filter(r =>
    (alertFilter === "全部" || r.type === alertFilter) &&
    (ispFilter   === "全部" || r.isp  === ispFilter)
  );
  const totalLogPages = Math.max(1, Math.ceil(filteredLogs.length / LOG_PAGE_SIZE));
  const pagedLogs     = filteredLogs.slice((logPage - 1) * LOG_PAGE_SIZE, logPage * LOG_PAGE_SIZE);

  return (
    <div style={{ padding: 12, background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", gap: 10 }}>

      {/* TOP ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10 }}>

        {/* 节点详情 */}
        <Card>
          <CardTitle icon="○">节点详情</CardTitle>
          <FieldRow label="◎ 地区名称">
            <span style={{ fontWeight: 500, color: "#111" }}>美国</span>
          </FieldRow>
          <FieldRow label="○ 提供商选项">
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {["移动", "电信", "联通", "其他"].map(p => <Pill key={p}>{p}</Pill>)}
            </div>
          </FieldRow>
          <FieldRow label="☰ 节点标签">
            <span style={{ fontWeight: 500, color: "#111" }}>洛杉矶/IP送中</span>
          </FieldRow>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12 }}>
            <span style={{ color: "#9ca3af" }}>□ 描述</span>
            <span style={{ color: "#d1d5db" }}>无描述</span>
          </div>
        </Card>

        {/* 设置 */}
        <Card>
          <CardTitle icon="○">设置</CardTitle>
          <FieldRow label="△ 用户可见">
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, background: "#dcfce7", color: "#15803d", fontWeight: 500 }}>是</span>
          </FieldRow>
          <FieldRow label="△ 仅限付费用户">
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, background: "#dcfce7", color: "#15803d", fontWeight: 500 }}>是</span>
          </FieldRow>
          <FieldRow label="□ 平台支持" alignTop>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 220 }}>
              {["IOS", "ANDROID", "WINDOWS", "LINUX", "MACOS"].map(p => (
                <Pill key={p}>{p}</Pill>
              ))}
            </div>
          </FieldRow>
        </Card>

        {/* 总连接数 */}
        <Card style={{ minWidth: 130 }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>总连接数</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: "#111", lineHeight: 1.1 }}>71</div>
          <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>↘ 30.4% 与昨天相比</div>
        </Card>
      </div>

      {/* BOTTOM ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 10 }}>

        {/* 连接历史图表 */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>连接历史图表</span>
            <select
              value={connRange.label}
              onChange={e => setConnRangeIdx(CONN_RANGES.findIndex(r => r.label === e.target.value))}
              style={{ fontSize: 11, padding: "2px 6px", border: "0.5px solid #e5e7eb", borderRadius: 6, background: "#fff", color: "#374151", cursor: "pointer" }}
            >
              {CONN_RANGES.map(r => <option key={r.label}>{r.label}</option>)}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={connData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradBlue2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} interval={Math.floor(connData.length / 5)} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip unit="" />} />
              <Area type="monotone" dataKey="value" stroke="#93c5fd" strokeWidth={1.5} fill="url(#gradBlue2)" animationDuration={300} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* 历史平均延迟图表 */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>历史平均延迟图表</span>
              <div style={{ display: "flex", gap: 3 }}>
                {METRICS.map((m, i) => (
                  <button key={m.key} onClick={() => setMetricIdx(i)} style={{
                    fontSize: 11, padding: "2px 10px", borderRadius: 6, cursor: "pointer",
                    border: metricIdx === i ? "none" : "0.5px solid #e5e7eb",
                    background: metricIdx === i ? m.color : "#fff",
                    color: metricIdx === i ? "#fff" : "#9ca3af",
                    fontWeight: metricIdx === i ? 500 : 400,
                  }}>{m.key}</button>
                ))}
              </div>
            </div>
            <select
              value={range.label}
              onChange={e => setRangeIdx(TIME_RANGES.findIndex(r => r.label === e.target.value))}
              style={{ fontSize: 11, padding: "2px 6px", border: "0.5px solid #e5e7eb", borderRadius: 6, background: "#fff", color: "#374151", cursor: "pointer" }}
            >
              {TIME_RANGES.map(r => <option key={r.label}>{r.label}</option>)}
            </select>
          </div>

          {/* Step selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontSize: 11 }}>
            <span style={{ color: "#9ca3af" }}>选择节点区间</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>Step 1</span>
            <select
              value={STEP1_OPTIONS[step1Idx].label}
              onChange={e => setStep1Idx(STEP1_OPTIONS.findIndex(s => s.label === e.target.value))}
              style={{ fontSize: 11, padding: "2px 8px", border: "0.5px solid #e5e7eb", borderRadius: 6, background: "#fff", color: "#374151", cursor: "pointer", maxWidth: 190 }}
            >
              {STEP1_OPTIONS.map(s => <option key={s.id}>{s.label}</option>)}
            </select>
            <span style={{ fontSize: 12, color: "#d1d5db" }}>→</span>
            <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>Step 2</span>
            <div style={{
              fontSize: 11, padding: "2px 10px", border: "0.5px solid #e5e7eb",
              borderRadius: 6, background: "#f9fafb", color: "#6b7280"
            }}>
              {step2Label}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={latencyData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={metric.gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} interval={Math.floor(latencyData.length / 5)} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} domain={[0, metric.yMax]} tickFormatter={yTickFormatter} />
              <Tooltip content={<ChartTooltip unit={metric.unit} />} />
              <Area type="monotone" dataKey="value" stroke={metric.color} strokeWidth={1.5} fill={`url(#${metric.gradId})`} animationDuration={300} dot={false} />
            </AreaChart>
          </ResponsiveContainer>

          <div style={{ marginTop: 6, fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 18, height: 2, background: metric.color, borderRadius: 2 }} />
            {STEP1_OPTIONS[step1Idx].label} → {step2Label}
          </div>
        </Card>
      </div>

      {/* TRIGGER LOG */}
      <Card>
        {/* Header + filters */}
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>节点触发日志</span>
        </div>

        {/* 告警类型 filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 48 }}>告警类型</span>
          <div style={{ display: "flex", gap: 4 }}>
            {ALERT_TYPES.map(t => {
              const active = alertFilter === t;
              const s = ALERT_STYLE[t];
              const bg    = active ? (s ? s.bg    : "#f97316") : "#f3f4f6";
              const color = active ? (s ? s.color : "#fff")    : "#6b7280";
              return (
                <button key={t} onClick={() => { setAlertFilter(t); setLogPage(1); }} style={{
                  fontSize: 11, padding: "2px 10px", borderRadius: 12, cursor: "pointer",
                  border: "none", background: bg, color, fontWeight: active ? 500 : 400,
                }}>{t}</button>
              );
            })}
          </div>
        </div>

        {/* 运营商 filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "#9ca3af", minWidth: 48 }}>运营商</span>
          <div style={{ display: "flex", gap: 4 }}>
            {ISP_TYPES.map(t => {
              const active = ispFilter === t;
              return (
                <button key={t} onClick={() => { setIspFilter(t); setLogPage(1); }} style={{
                  fontSize: 11, padding: "2px 10px", borderRadius: 12, cursor: "pointer", border: "none",
                  background: active ? "#f97316" : "#f3f4f6",
                  color: active ? "#fff" : "#6b7280",
                  fontWeight: active ? 500 : 400,
                }}>{t}</button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid #f3f4f6" }}>
                {["告警类型", "源服务器", "目标服务器", "运营商", "数值", "触发时间"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 10px", color: "#9ca3af", fontWeight: 400, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "20px 0", color: "#d1d5db", fontSize: 12 }}>暂无数据</td>
                </tr>
              ) : pagedLogs.map((row, i) => {
                const s = ALERT_STYLE[row.type];
                return (
                  <tr key={i} style={{ borderBottom: "0.5px solid #f9fafb" }}>
                    <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, background: s.bg, color: s.color, fontWeight: 500 }}>{row.type}</span>
                    </td>
                    <td style={{ padding: "8px 10px", color: row.src === "—" ? "#d1d5db" : "#6b7280", whiteSpace: "nowrap" }}>{row.src}</td>
                    <td style={{ padding: "8px 10px", color: row.dst === "—" ? "#d1d5db" : "#6b7280", whiteSpace: "nowrap" }}>{row.dst}</td>
                    <td style={{ padding: "8px 10px", color: "#374151", whiteSpace: "nowrap" }}>{row.isp}</td>
                    <td style={{ padding: "8px 10px", color: VALUE_COLOR[row.type], fontWeight: 500, whiteSpace: "nowrap" }}>{row.value}</td>
                    <td style={{ padding: "8px 10px", color: "#9ca3af", whiteSpace: "nowrap" }}>{row.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 12 }}>
          <span style={{ fontSize: 11, color: "#9ca3af", marginRight: 8 }}>
            共 {filteredLogs.length} 条
          </span>
          <button
            onClick={() => setLogPage(p => Math.max(1, p - 1))}
            disabled={logPage === 1}
            style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 6, cursor: logPage === 1 ? "default" : "pointer",
              border: "0.5px solid #e5e7eb", background: "#fff",
              color: logPage === 1 ? "#d1d5db" : "#374151",
            }}
          >‹</button>
          {Array.from({ length: totalLogPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setLogPage(p)} style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 6, cursor: "pointer",
              border: logPage === p ? "none" : "0.5px solid #e5e7eb",
              background: logPage === p ? "#f97316" : "#fff",
              color: logPage === p ? "#fff" : "#374151",
              fontWeight: logPage === p ? 500 : 400,
            }}>{p}</button>
          ))}
          <button
            onClick={() => setLogPage(p => Math.min(totalLogPages, p + 1))}
            disabled={logPage === totalLogPages}
            style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 6, cursor: logPage === totalLogPages ? "default" : "pointer",
              border: "0.5px solid #e5e7eb", background: "#fff",
              color: logPage === totalLogPages ? "#d1d5db" : "#374151",
            }}
          >›</button>
        </div>
      </Card>
    </div>
  );
}