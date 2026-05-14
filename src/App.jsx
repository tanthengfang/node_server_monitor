import { useState, useEffect, useRef } from "react";

const bwData = [
  { time: "2026-04-15 05:32:35", server: "香港-免费6", usage: "52.51%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
  { time: "2026-04-15 01:32:36", server: "美国29-KY-OVH-免费", usage: "51.36%", threshold: "50%", cap: "1500 Mbps", period: "非高峰" },
  { time: "2026-04-15 01:17:36", server: "香港-免费6", usage: "79.32%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
  { time: "2026-04-14 01:17:35", server: "香港-免费6", usage: "55.96%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
  { time: "2026-04-13 17:42:35", server: "香港-免费6", usage: "57.52%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
  { time: "2026-04-13 13:47:35", server: "香港-免费6", usage: "50.72%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
  { time: "2026-04-13 01:17:35", server: "新加坡1-ZEN-免费", usage: "53.74%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
  { time: "2026-04-13 01:17:35", server: "香港-免费6", usage: "63.58%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
  { time: "2026-04-13 01:17:34", server: "美国29-KY-OVH-免费", usage: "55.08%", threshold: "50%", cap: "1500 Mbps", period: "非高峰" },
  { time: "2026-04-12 17:17:36", server: "香港-免费6", usage: "53.92%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
  { time: "2026-04-12 11:07:35", server: "香港-免费6", usage: "51.79%", threshold: "50%", cap: "500 Mbps", period: "非高峰" },
];

const nlData = [
  { node: "美国-V22",           path: "美国-V22-入",         unicom: "72ms→Timeout",  telecom: "68ms→Timeout",  mobile: "75ms→Timeout",  unicomPL: "100%", telecomPL: "100%", mobilePL: "100%" },
  { node: "香港-免费1",         path: "香港-HK1-入",         unicom: "45ms→82ms",     telecom: "38ms→152ms",    mobile: "42ms→79ms",     unicomPL: "3%",   telecomPL: "18%",  mobilePL: "2%"   },
  { node: "日本-V1",            path: "日本-V1-入",          unicom: "88ms→Timeout",  telecom: "92ms→Timeout",  mobile: "85ms→Timeout",  unicomPL: "100%", telecomPL: "100%", mobilePL: "100%" },
  { node: "美国-S1",            path: "美国-US5-DMIT-入",    unicom: "110ms→285ms",   telecom: "95ms→88ms",     mobile: "118ms→92ms",    unicomPL: "22%",  telecomPL: "4%",   mobilePL: "5%"   },
  { node: "香港-免费6",         path: "香港-HK1-入",         unicom: "40ms→65ms",     telecom: "35ms→55ms",     mobile: "38ms→Timeout",  unicomPL: "1%",   telecomPL: "3%",   mobilePL: "15%"  },
  { node: "美国29-KY-OVH-免费", path: "美国29-KY-OVH-入",    unicom: "105ms→Timeout", telecom: "98ms→Timeout",  mobile: "112ms→Timeout", unicomPL: "100%", telecomPL: "100%", mobilePL: "100%" },
  { node: "新加坡-ZEN-免费",    path: "新加坡-SG1-入",       unicom: "62ms→75ms",     telecom: "58ms→Timeout",  mobile: "66ms→72ms",     unicomPL: "5%",   telecomPL: "34%",  mobilePL: "2%"   },
  { node: "日本-JP2",           path: "日本-JP1-入",         unicom: "80ms→92ms",     telecom: "75ms→188ms",    mobile: "78ms→85ms",     unicomPL: "6%",   telecomPL: "3%",   mobilePL: "12%"  },
  { node: "德国-DE1",           path: "德国-DE1-入",         unicom: "185ms→210ms",   telecom: "178ms→195ms",   mobile: "190ms→218ms",   unicomPL: "2%",   telecomPL: "1%",   mobilePL: "3%"   },
  { node: "台湾-TW1",           path: "台湾-TW1-入",         unicom: "35ms→48ms",     telecom: "30ms→44ms",     mobile: "33ms→51ms",     unicomPL: "1%",   telecomPL: "0%",   mobilePL: "2%"   },
  { node: "马来西亚-MY1",       path: "马来西亚-MY1-入",     unicom: "72ms→95ms",     telecom: "68ms→Timeout",  mobile: "74ms→88ms",     unicomPL: "4%",   telecomPL: "41%",  mobilePL: "3%"   },
  { node: "意大利-IT1",         path: "意大利-IT1-入",       unicom: "198ms→225ms",   telecom: "192ms→Timeout", mobile: "205ms→230ms",   unicomPL: "3%",   telecomPL: "100%", mobilePL: "2%"   },
  { node: "乌克兰-UA1",         path: "乌克兰-UA1-入",       unicom: "220ms→Timeout", telecom: "215ms→Timeout", mobile: "225ms→Timeout", unicomPL: "100%", telecomPL: "100%", mobilePL: "100%" },
  { node: "泰国-TH1",           path: "泰国-TH1-入",         unicom: "58ms→72ms",     telecom: "54ms→68ms",     mobile: "60ms→75ms",     unicomPL: "2%",   telecomPL: "1%",   mobilePL: "4%"   },
  { node: "新加坡-SG2",         path: "新加坡-SG2-入",       unicom: "65ms→78ms",     telecom: "60ms→74ms",     mobile: "63ms→80ms",     unicomPL: "1%",   telecomPL: "2%",   mobilePL: "0%"   },
  { node: "香港-免费3",         path: "香港-HK2-入",         unicom: "42ms→58ms",     telecom: "38ms→52ms",     mobile: "44ms→61ms",     unicomPL: "2%",   telecomPL: "1%",   mobilePL: "3%"   },
  { node: "美国-LA1",           path: "美国-LA1-入",         unicom: "128ms→155ms",   telecom: "122ms→148ms",   mobile: "130ms→162ms",   unicomPL: "5%",   telecomPL: "3%",   mobilePL: "7%"   },
  { node: "日本-JP3",           path: "日本-JP2-入",         unicom: "85ms→98ms",     telecom: "80ms→93ms",     mobile: "88ms→102ms",    unicomPL: "1%",   telecomPL: "0%",   mobilePL: "2%"   },
  { node: "德国-DE2",           path: "德国-DE2-入",         unicom: "190ms→Timeout", telecom: "184ms→218ms",   mobile: "195ms→222ms",   unicomPL: "100%", telecomPL: "8%",   mobilePL: "6%"   },
  { node: "台湾-TW2",           path: "台湾-TW2-入",         unicom: "38ms→52ms",     telecom: "34ms→47ms",     mobile: "36ms→55ms",     unicomPL: "2%",   telecomPL: "1%",   mobilePL: "3%"   },
  { node: "马来西亚-MY2",       path: "马来西亚-MY2-入",     unicom: "75ms→88ms",     telecom: "70ms→82ms",     mobile: "78ms→92ms",     unicomPL: "3%",   telecomPL: "2%",   mobilePL: "4%"   },
  { node: "泰国-TH2",           path: "泰国-TH2-入",         unicom: "60ms→Timeout",  telecom: "56ms→71ms",     mobile: "62ms→78ms",     unicomPL: "38%",  telecomPL: "3%",   mobilePL: "5%"   },
];

const ntoData = [
  { alertType: "疑似不通", node: "US-64",  fromServer: "—",          toServer: "—",          isp: "全部", value: "超时 20s",              triggeredAt: "2026-05-14 13:40:00" },
  { alertType: "延迟超标", node: "CN-01",  fromServer: "CN-01-SV-A", toServer: "US-64-SV-B", isp: "联通", value: "45ms → 198ms (+153ms)", triggeredAt: "2026-05-14 14:01:00" },
  { alertType: "延迟超标", node: "CN-01",  fromServer: "CN-01-SV-A", toServer: "US-64-SV-B", isp: "移动", value: "45ms → 210ms (+165ms)", triggeredAt: "2026-05-14 14:03:00" },
  { alertType: "丢包",     node: "CN-01",  fromServer: "CN-01-SV-B", toServer: "JP-03-SV-A", isp: "电信", value: "14%（14/100 包）",       triggeredAt: "2026-05-14 14:10:00" },
  { alertType: "丢包",     node: "US-64",  fromServer: "US-64-SV-A", toServer: "US-64-SV-B", isp: "—",   value: "23%（23/100 包）",       triggeredAt: "2026-05-14 14:18:00" },
  { alertType: "延迟超标", node: "US-64",  fromServer: "US-64-SV-A", toServer: "US-64-SV-C", isp: "—",   value: "8ms → 超时（>20s）",     triggeredAt: "2026-05-14 14:22:00" },
  { alertType: "疑似不通", node: "JP-03",  fromServer: "—",          toServer: "—",          isp: "全部", value: "超时 20s",              triggeredAt: "2026-05-14 14:30:00" },
  { alertType: "延迟超标", node: "CN-01",  fromServer: "CN-01-SV-A", toServer: "US-64-SV-B", isp: "联通", value: "45ms → 163ms (+118ms)", triggeredAt: "2026-05-14 14:55:00" },
  { alertType: "丢包",     node: "CN-01",  fromServer: "CN-01-SV-B", toServer: "JP-03-SV-A", isp: "电信", value: "11%（11/100 包）",       triggeredAt: "2026-05-14 15:10:00" },
  { alertType: "疑似不通", node: "US-64",  fromServer: "—",          toServer: "—",          isp: "全部", value: "超时 20s",              triggeredAt: "2026-05-14 15:22:00" },
  { alertType: "丢包",     node: "HK-01",  fromServer: "HK-01-SV-A", toServer: "JP-03-SV-B", isp: "联通", value: "18%（18/100 包）",       triggeredAt: "2026-05-14 15:35:00" },
  { alertType: "延迟超标", node: "SG-02",  fromServer: "SG-02-SV-A", toServer: "US-64-SV-A", isp: "移动", value: "60ms → 188ms (+128ms)", triggeredAt: "2026-05-14 15:48:00" },
  { alertType: "疑似不通", node: "UA-01",  fromServer: "—",          toServer: "—",          isp: "全部", value: "超时 20s",              triggeredAt: "2026-05-14 16:00:00" },
  { alertType: "丢包",     node: "DE-01",  fromServer: "DE-01-SV-A", toServer: "DE-01-SV-B", isp: "—",   value: "31%（31/100 包）",       triggeredAt: "2026-05-14 16:12:00" },
  { alertType: "延迟超标", node: "JP-03",  fromServer: "JP-03-SV-A", toServer: "HK-01-SV-A", isp: "电信", value: "78ms → 超时（>20s）",    triggeredAt: "2026-05-14 16:20:00" },
  { alertType: "延迟超标", node: "TW-01",  fromServer: "TW-01-SV-A", toServer: "CN-01-SV-B", isp: "联通", value: "32ms → 145ms (+113ms)", triggeredAt: "2026-05-14 16:33:00" },
  { alertType: "丢包",     node: "MY-01",  fromServer: "MY-01-SV-A", toServer: "SG-02-SV-A", isp: "移动", value: "22%（22/100 包）",       triggeredAt: "2026-05-14 16:45:00" },
  { alertType: "疑似不通", node: "IT-01",  fromServer: "—",          toServer: "—",          isp: "全部", value: "超时 20s",              triggeredAt: "2026-05-14 17:02:00" },
  { alertType: "延迟超标", node: "HK-01",  fromServer: "HK-01-SV-B", toServer: "TW-01-SV-A", isp: "电信", value: "35ms → 172ms (+137ms)", triggeredAt: "2026-05-14 17:15:00" },
  { alertType: "丢包",     node: "US-64",  fromServer: "US-64-SV-B", toServer: "DE-01-SV-A", isp: "—",   value: "17%（17/100 包）",       triggeredAt: "2026-05-14 17:28:00" },
  { alertType: "延迟超标", node: "TH-01",  fromServer: "TH-01-SV-A", toServer: "MY-01-SV-A", isp: "联通", value: "55ms → 198ms (+143ms)", triggeredAt: "2026-05-14 17:40:00" },
  { alertType: "疑似不通", node: "DE-01",  fromServer: "—",          toServer: "—",          isp: "全部", value: "超时 20s",              triggeredAt: "2026-05-14 17:55:00" },
  { alertType: "丢包",     node: "JP-03",  fromServer: "JP-03-SV-B", toServer: "TW-01-SV-A", isp: "移动", value: "28%（28/100 包）",       triggeredAt: "2026-05-14 18:08:00" },
  { alertType: "延迟超标", node: "SG-02",  fromServer: "SG-02-SV-B", toServer: "MY-01-SV-A", isp: "电信", value: "58ms → 超时（>20s）",    triggeredAt: "2026-05-14 18:20:00" },
  { alertType: "疑似不通", node: "TH-01",  fromServer: "—",          toServer: "—",          isp: "全部", value: "超时 20s",              triggeredAt: "2026-05-14 18:35:00" },
];

const TABS = ["带宽 (Bandwidth)", "节点状态监控", "节点触发总览"];

const amber = { badge: "bg-amber-100 text-amber-800", link: "text-amber-600 hover:underline cursor-pointer", diff: "text-amber-600" };

function Badge({ children }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${amber.badge} font-medium`}>
      {children}
    </span>
  );
}

function LinkBtn({ children }) {
  return <span className={`text-sm ${amber.link} whitespace-nowrap`}>{children}</span>;
}

function Th({ children, className = "" }) {
  return (
    <th className={`text-left text-sm font-normal text-gray-500 px-3 py-2.5 border-b border-gray-100 whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return (
    <td className={`px-3 py-2.5 text-sm border-b border-gray-100 align-middle ${className}`}>
      {children}
    </td>
  );
}

function BandwidthTab() {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <Th>时间</Th>
          <Th>服务器名称</Th>
          <Th>带宽使用率</Th>
          <Th>阈值</Th>
          <Th>时段</Th>
          <Th>操作</Th>
        </tr>
      </thead>
      <tbody>
        {bwData.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <Td className="text-gray-400 whitespace-nowrap">{r.time}</Td>
            <Td>{r.server}</Td>
            <Td>{r.usage}</Td>
            <Td>
              <span className="flex items-center gap-1.5">
                <Badge>{r.threshold}</Badge>
                <span className="text-gray-400">—</span>
                <span className="text-gray-500">{r.cap}</span>
              </span>
            </Td>
            <Td><Badge>{r.period}</Badge></Td>
            <Td><LinkBtn>查看服务器详情</LinkBtn></Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PacketLossCell({ value }) {
  const pct = parseInt(value);
  const isHigh = pct > 10;
  return <span className={isHigh ? "text-red-500 font-medium" : "text-green-600"}>{value}</span>;
}

function LatencyCell({ value }) {
  const [before, after] = value.split("→");
  const isTimeout = after === "Timeout";
  const diff = isTimeout ? Infinity : parseInt(after) - parseInt(before);
  const color = isTimeout ? "text-red-500" : diff > 100 ? "text-amber-600" : "text-green-600";
  return (
    <span className="whitespace-nowrap">
      <span className="text-gray-400">{before}→</span>
      <span className={color}>{after}</span>
    </span>
  );
}

function ISPPill({ label, latency, pl }) {
  const [before, after] = latency.split("→");
  const isTimeout = after === "Timeout";
  const latencyDiff = isTimeout ? Infinity : parseInt(after) - parseInt(before);
  const plPct = parseInt(pl);
  const isLatencyBad = isTimeout || latencyDiff > 100;
  const isPLBad = plPct > 10;
  const isBad = isLatencyBad || isPLBad;

  const dot = isTimeout ? "bg-red-400" : isBad ? "bg-amber-400" : "bg-green-400";

  return (
    <div className="inline-flex flex-col gap-1 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-xs w-[150px]">
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <div className="text-gray-400 leading-none">
        {before}→<span className={isTimeout ? "text-red-500" : latencyDiff > 100 ? "text-amber-600" : "text-gray-600"}>{after}</span>
      </div>
      <div className="text-gray-400 leading-none">
        丢包 <span className={isPLBad ? "text-red-500" : "text-gray-600"}>{pl}</span>
      </div>
    </div>
  );
}

function fmt(d) {
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const PAGE_SIZE = 10;

function FilterPills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
          value === null
            ? "bg-amber-500 text-white border-amber-500"
            : "bg-white text-gray-500 border-gray-200 hover:border-amber-400 hover:text-amber-600"
        }`}
      >
        全部
      </button>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(value === opt ? null : opt)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            value === opt
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-white text-gray-500 border-gray-200 hover:border-amber-400 hover:text-amber-600"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function NodeLatencyTab() {
  const [lastUpdated, setLastUpdated] = useState(() => fmt(new Date()));
  const [country, setCountry] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setLastUpdated(fmt(new Date()));
      setPage(1);
    }, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = country ? nlData.filter(r => r.node.startsWith(country)) : nlData;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleCountry(val) {
    setCountry(val);
    setPage(1);
  }

  return (
    <div className="overflow-x-auto">
      {/* Country filter */}
      <div className="pt-3 pb-2">
        <FilterPills options={COUNTRIES} value={country} onChange={handleCountry} />
      </div>

      {/* Last updated */}
      <div className="flex items-center gap-1.5 py-2 text-xs text-gray-400">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
          <polyline points="12 7 12 12 15.5 14" strokeWidth="1.5"/>
        </svg>
        最后更新：<span className="text-gray-600 font-medium">{lastUpdated}</span>
        <span className="ml-1 text-gray-300">· 每 15 分钟自动刷新</span>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <Th>节点名称</Th>
            <Th>中继服务器</Th>
            <Th>运营商状态</Th>
            <Th>操作</Th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-3 py-8 text-center text-sm text-gray-400">暂无该地区的节点数据</td>
            </tr>
          ) : (
            pageData.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <Td className="font-medium whitespace-nowrap">{r.node}</Td>
                <Td className="text-gray-500 whitespace-nowrap">{r.path}</Td>
                <Td>
                  <div className="flex gap-2">
                    <ISPPill label="联通" latency={r.unicom} pl={r.unicomPL} />
                    <ISPPill label="电信" latency={r.telecom} pl={r.telecomPL} />
                    <ISPPill label="移动" latency={r.mobile} pl={r.mobilePL} />
                  </div>
                </Td>
                <Td><LinkBtn>查看节点详情</LinkBtn></Td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          共 {filtered.length} 条，第 {page} / {totalPages} 页
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(1)} disabled={page === 1}
            className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                n === page ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}>{n}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">»</button>
        </div>
      </div>
    </div>
  );
}

const alertStyles = {
  "疑似不通":   { badge: "bg-red-100 text-red-600",    value: "text-red-500"   },
  "延迟超标": { badge: "bg-amber-100 text-amber-700", value: "text-amber-600" },
  "丢包":     { badge: "bg-blue-100 text-blue-600",   value: "text-blue-500"  },
};

function AlertTypeBadge({ type }) {
  const style = alertStyles[type] ?? { badge: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap ${style.badge}`}>
      {type}
    </span>
  );
}

const COUNTRIES = [
  "美国", "新加坡", "泰国", "日本", "乌克兰",
  "香港", "德国", "马来西亚", "台湾", "意大利",
];

const ALERT_TYPES = ["疑似不通", "延迟超标", "丢包"];
const ISPS        = ["联通", "电信", "移动"];

const NTO_PAGE_SIZE = 20;

function NodeTriggerOverviewTab() {
  const [alertType, setAlertType] = useState(null);
  const [isp, setIsp] = useState(null);
  const [page, setPage] = useState(1);

  const filtered = ntoData.filter(r =>
    (!alertType || r.alertType === alertType) &&
    (!isp || r.isp === isp)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / NTO_PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * NTO_PAGE_SIZE, page * NTO_PAGE_SIZE);

  function handleAlertType(val) { setAlertType(val); setPage(1); }
  function handleIsp(val) { setIsp(val); setPage(1); }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-2 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-12 shrink-0">告警类型</span>
          <FilterPills options={ALERT_TYPES} value={alertType} onChange={handleAlertType} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-12 shrink-0">运营商</span>
          <FilterPills options={ISPS} value={isp} onChange={handleIsp} />
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <Th>告警类型</Th>
            <Th>节点</Th>
            <Th>源服务器</Th>
            <Th>目标服务器</Th>
            <Th>运营商</Th>
            <Th>数值</Th>
            <Th>触发时间</Th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-8 text-center text-sm text-gray-400">
                暂无符合条件的触发记录
              </td>
            </tr>
          ) : (
            pageData.map((r, i) => {
              const style = alertStyles[r.alertType] ?? { value: "text-gray-600" };
              return (
                <tr key={i} className="hover:bg-gray-50">
                  <Td><AlertTypeBadge type={r.alertType} /></Td>
                  <Td className="font-medium whitespace-nowrap">{r.node}</Td>
                  <Td className="text-gray-500 whitespace-nowrap">{r.fromServer}</Td>
                  <Td className="text-gray-500 whitespace-nowrap">{r.toServer}</Td>
                  <Td className="text-gray-500">{r.isp}</Td>
                  <Td className={`whitespace-nowrap font-medium ${style.value}`}>{r.value}</Td>
                  <Td className="text-gray-400 whitespace-nowrap">{r.triggeredAt}</Td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          共 {filtered.length} 条，第 {page} / {totalPages} 页
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(1)} disabled={page === 1}
            className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">«</button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                n === page ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}>{n}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
            className="px-2 py-1 text-xs rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">»</button>
        </div>
      </div>
    </div>
  );
}

function DateTimeRangePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleApply() {
    onChange(draft);
    setOpen(false);
  }

  function handleCancel() {
    setDraft(value);
    setOpen(false);
  }

  function fmtDisplay(iso) {
    return iso.replace("T", " ");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setDraft(value); setOpen(o => !o); }}
        className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5"/>
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="1.5"/>
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="1.5"/>
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="1.5"/>
        </svg>
        {fmtDisplay(value.start)} — {fmtDisplay(value.end)}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-72">
          <p className="text-xs font-medium text-gray-500 mb-3">选择时间范围</p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">开始时间</label>
              <input
                type="datetime-local"
                value={draft.start}
                max={draft.end}
                onChange={e => setDraft(d => ({ ...d, start: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">结束时间</label>
              <input
                type="datetime-local"
                value={draft.end}
                min={draft.start}
                onChange={e => setDraft(d => ({ ...d, end: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1.5 text-xs rounded-lg bg-amber-500 text-white hover:bg-amber-600"
            >
              确认
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServerTriggerRecords() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState({ start: "2026-03-17T00:00", end: "2026-04-15T23:59" });

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 font-sans">
      {/* Header */}
      <h2 className="text-lg font-medium text-gray-900 mb-1">服务器触发记录</h2>
      <p className="text-sm text-gray-400 mb-4">当指标超过阈值时记录触发告警</p>

      {/* Toolbar */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <DateTimeRangePicker value={dateRange} onChange={setDateRange} />
        <button className="flex items-center gap-1 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" strokeWidth="1.5"/>
            <line x1="8" y1="12" x2="16" y2="12" strokeWidth="1.5"/>
            <line x1="11" y1="18" x2="13" y2="18" strokeWidth="1.5"/>
          </svg>
        </button>
        <button className="flex items-center gap-1 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
          列
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" strokeWidth="2"/>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-0">
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === i
                ? "border-amber-500 text-amber-600 font-medium"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {activeTab === 0 && <BandwidthTab />}
        {activeTab === 1 && <NodeLatencyTab />}
        {activeTab === 2 && <NodeTriggerOverviewTab />}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          节点延迟：全部 ISP 均 Timeout 时触发
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          UNREACHABLE：节点完全无响应，所有探测均超时
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          PACKET_LOSS：链路丢包率超过阈值时触发
        </div>
      </div>
    </div>
  );
}