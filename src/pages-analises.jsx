// Análises — deeper analytics page. Distinct from Painel — focused on
// comparisons, trends, and breakdowns the user can pivot on.

// ── Line chart with comparison (current vs previous period) ─────────────
const LineChart = ({ series, height = 220, width = 800, labels }) => {
  if (!series?.length) return null;
  const pad = { l: 40, r: 16, t: 12, b: 28 };
  const w = width, h = height;
  const allVals = series.flatMap(s => s.values);
  const max = Math.max(...allVals) * 1.1;
  const min = 0;
  const stepX = (w - pad.l - pad.r) / (series[0].values.length - 1);
  const yScale = (v) => h - pad.b - ((v - min) / (max - min)) * (h - pad.t - pad.b);
  const xScale = (i) => pad.l + i * stepX;

  const pathFor = (vals) => vals.map((v, i) => (i === 0 ? "M" : "L") + xScale(i).toFixed(1) + "," + yScale(v).toFixed(1)).join(" ");

  // Y-axis ticks
  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => (max / ticks) * i);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height, display: "block" }}>
      {/* Grid + Y axis */}
      {tickVals.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} y1={yScale(t)} x2={w - pad.r} y2={yScale(t)}
                stroke="var(--border)" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "3 3"}/>
          <text x={pad.l - 8} y={yScale(t)} fontSize="10" fill="var(--text-faint)"
                textAnchor="end" dominantBaseline="middle"
                style={{ fontFamily: "Inter, sans-serif", fontVariantNumeric: "tabular-nums" }}>
            {t >= 1000 ? `${(t / 1000).toFixed(0)}k` : t.toFixed(0)}
          </text>
        </g>
      ))}
      {/* X labels */}
      {labels?.map((l, i) => l && (
        <text key={i} x={xScale(i)} y={h - 8} fontSize="10" fill="var(--text-faint)"
              textAnchor="middle"
              style={{ fontFamily: "Inter, sans-serif" }}>{l}</text>
      ))}
      {/* Lines */}
      {series.map((s, si) => (
        <g key={si}>
          {s.dashed && <path d={pathFor(s.values)} fill="none" stroke={s.color} strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>}
          {!s.dashed && (
            <>
              <defs>
                <linearGradient id={`lg-${si}-${s.color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.18"/>
                  <stop offset="100%" stopColor={s.color} stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={pathFor(s.values) + ` L ${xScale(s.values.length - 1)},${h - pad.b} L ${pad.l},${h - pad.b} Z`}
                    fill={`url(#lg-${si}-${s.color.replace(/[^a-z0-9]/gi, "")})`}/>
              <path d={pathFor(s.values)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx={xScale(s.values.length - 1)} cy={yScale(s.values.at(-1))} r="4" fill={s.color}/>
            </>
          )}
        </g>
      ))}
    </svg>
  );
};

// ── Heatmap: dia × hora ───────────────────────────────────────────────
const Heatmap = ({ data, isMobile }) => {
  // data: 7 days × 12 hours (8h-19h). Values 0-100.
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const hours = ["8h","9h","10h","11h","12h","13h","14h","15h","16h","17h","18h","19h"];
  const max = Math.max(...data.flat());

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `32px repeat(${hours.length}, 1fr)`, gap: 3, minWidth: isMobile ? 380 : "auto" }}>
        <div/>
        {hours.map(h => <div key={h} style={{ fontSize: 10, color: "var(--text-faint)", textAlign: "center", paddingBottom: 4 }}>{h}</div>)}
        {data.map((row, dy) => (
          <React.Fragment key={dy}>
            <div style={{ fontSize: 10, color: "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 4, fontWeight: 500 }}>{days[dy]}</div>
            {row.map((v, hx) => {
              const intensity = v / max;
              return (
                <div key={hx}
                     title={`${days[dy]} ${hours[hx]}: ${v} vendas`}
                     style={{
                       aspectRatio: "1",
                       borderRadius: 4,
                       background: v === 0 ? "var(--bg-sunken)"
                                  : `color-mix(in srgb, var(--tech) ${Math.max(8, intensity * 100)}%, transparent)`,
                       border: "1px solid var(--border)",
                       transition: "transform 100ms ease",
                       cursor: "pointer",
                     }}/>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="row" style={{ marginTop: 12, gap: 6, fontSize: 11, color: "var(--text-faint)" }}>
        <span>Menos</span>
        {[0.15, 0.35, 0.55, 0.75, 1].map(i => (
          <span key={i} style={{ width: 14, height: 14, borderRadius: 3, background: `color-mix(in srgb, var(--tech) ${i * 100}%, transparent)`, border: "1px solid var(--border)" }}/>
        ))}
        <span>Mais</span>
      </div>
    </div>
  );
};

// ── Stacked horizontal bar — for "Por canal" ─────────────────────────────
const StackedBar = ({ segments, height = 28 }) => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div style={{ display: "flex", height, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
      {segments.map((s, i) => (
        <div key={i} title={`${s.label}: ${s.value}%`}
             style={{ flex: s.value / total, background: s.color, transition: "flex 400ms ease" }}/>
      ))}
    </div>
  );
};

// ── KPI with comparison ─────────────────────────────────────────────────
const ComparisonKpi = ({ label, value, current, previous, format = (v) => v }) => {
  const delta = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const up = delta >= 0;
  return (
    <div className="card kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value tnum">{value}</div>
      <div className="row" style={{ gap: 8 }}>
        <span className={`kpi-delta ${up ? "up" : "down"}`}>
          {up ? <I.ArrowUp size={12}/> : <I.ArrowDown size={12}/>}
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="t-caption t-faint kpi-hint" style={{ whiteSpace: "nowrap" }}>
          vs. <span className="num">{format(previous)}</span>
        </span>
      </div>
    </div>
  );
};

// ── Período + comparação ────────────────────────────────────────────────
const PeriodHeader = ({ range, setRange, compare, setCompare, isMobile }) => (
  <div className="row-wrap" style={{ alignItems: "center", gap: 10 }}>
    <div style={{ display: "inline-flex", gap: 2, background: "var(--bg-sunken)", padding: 3, borderRadius: 10, border: "1px solid var(--border)" }}>
      {[["7d", "7 dias"], ["30d", "30 dias"], ["90d", "90 dias"], ["12m", "12 meses"]].map(([k, l]) => (
        <button key={k} onClick={() => setRange(k)}
                style={{
                  padding: "6px 12px", border: 0, cursor: "pointer", borderRadius: 7,
                  fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                  background: range === k ? "var(--bg-elev)" : "transparent",
                  color: range === k ? "var(--text)" : "var(--text-muted)",
                  boxShadow: range === k ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                }}>{l}</button>
      ))}
    </div>
    {!isMobile && (
      <label className="row" style={{ gap: 8, cursor: "pointer", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13 }}>
        <input type="checkbox" checked={compare} onChange={e => setCompare(e.target.checked)}
               style={{ accentColor: "var(--tech)", margin: 0 }}/>
        <span>Comparar com período anterior</span>
      </label>
    )}
  </div>
);

// ── Mock datasets per range ───────────────────────────────────────────
const ANALISES_LOJA = {
  "7d":  { receita: 19480, receitaPrev: 16480, pedidos: 102, pedidosPrev: 91, ticket: 191, ticketPrev: 181, margem: 57, margemPrev: 55,
           trend: VENDAS_7D, trendPrev: [1820, 2110, 1690, 2680, 2330, 3040, 2810],
           labels: ["Qua","Qui","Sex","Sáb","Dom","Seg","Ter"],
           clientesNovos: 18, clientesRecorrentes: 84, ltvMedio: 312 },
  "30d": { receita: 84320, receitaPrev: 71320, pedidos: 412, pedidosPrev: 368, ticket: 204.66, ticketPrev: 193.80, margem: 57, margemPrev: 54,
           trend: [3200,2800,3600,3100,4200,3800,4500,3900,4100,3700,4400,4800,5200,4900,5100,4700,5300,5800,6200,5900,6400,6100,6800,7100,6700,7200,7400,7900,7600,8200],
           trendPrev: [2900,2500,3200,2800,3700,3400,4000,3500,3700,3300,3900,4300,4600,4400,4500,4200,4700,5100,5500,5200,5700,5400,6000,6300,5900,6400,6500,6900,6700,7200],
           labels: ["1","","","","5","","","","","10","","","","","15","","","","","20","","","","","25","","","","","30"],
           clientesNovos: 68, clientesRecorrentes: 344, ltvMedio: 312 },
  "90d": { receita: 248720, receitaPrev: 198400, pedidos: 1184, pedidosPrev: 1018, ticket: 210.10, ticketPrev: 194.90, margem: 56, margemPrev: 53,
           trend: [4200,5100,4700,5800,6300,7100,6500,7800,8400,7900,8600,9100],
           trendPrev: [3600,4400,4100,5000,5400,6100,5600,6700,7200,6800,7400,7800],
           labels: ["S1","","","S4","","","S7","","","S10","",""],
           clientesNovos: 184, clientesRecorrentes: 1000, ltvMedio: 312 },
  "12m": { receita: 1014400, receitaPrev: 824800, pedidos: 4830, pedidosPrev: 4180, ticket: 210, ticketPrev: 197, margem: 56, margemPrev: 52,
           trend: [62000,68000,72000,78000,84000,88000,91000,89000,94000,98000,104000,108000],
           trendPrev: [48000,54000,58000,62000,66000,72000,75000,73000,78000,82000,86000,90000],
           labels: ["Jun","","","Set","","","Dez","","","Mar","",""],
           clientesNovos: 728, clientesRecorrentes: 4102, ltvMedio: 412 },
};

// Heatmap data (7 dias × 12 horas) — random-ish realistic pattern
const HEATMAP_LOJA = [
  [2, 3, 5, 4, 6, 8, 12, 14, 18, 16, 14, 10],   // Dom
  [4, 6, 8, 10, 14, 12, 8, 16, 22, 28, 24, 18], // Seg
  [3, 5, 7, 9, 13, 11, 7, 14, 20, 26, 22, 16],  // Ter
  [5, 7, 9, 11, 15, 13, 9, 17, 23, 29, 25, 19], // Qua
  [6, 8, 11, 13, 18, 15, 11, 20, 26, 32, 28, 22],// Qui
  [8, 11, 14, 17, 22, 19, 14, 24, 32, 38, 34, 28],// Sex
  [5, 7, 10, 12, 16, 14, 10, 18, 24, 30, 26, 20],// Sáb
];

const ANALISES_ORCA = {
  "7d":  { receita: 8470, receitaPrev: 7180, enviados: 47, enviadosPrev: 41, aprovados: 28, aprovadosPrev: 22, taxaAprov: 82, taxaAprovPrev: 76,
           tempoResposta: "4h 22min", tempoExec: "2 dias", servicoTop: "Funilaria", recusasMotivo: { "Preço alto": 62, "Prazo": 18, "Concorrência": 14, "Outros": 6 },
           trend: [1100,1340,980,1820,1430,2240,1560], trendPrev: [950,1180,820,1620,1230,1980,1340], labels: ["Qua","Qui","Sex","Sáb","Dom","Seg","Ter"] },
  "30d": { receita: 38640, receitaPrev: 32100, enviados: 84, enviadosPrev: 72, aprovados: 48, aprovadosPrev: 38, taxaAprov: 71, taxaAprovPrev: 66,
           tempoResposta: "5h 14min", tempoExec: "2.4 dias", servicoTop: "Funilaria", recusasMotivo: { "Preço alto": 58, "Prazo": 20, "Concorrência": 16, "Outros": 6 },
           trend: [3,5,2,4,6,3,4,2,5,3,4,6,5,3,4,5,4,6,3,5,4,3,5,6,4,5,3,4,5,3].map(v => v * 800),
           trendPrev: [2,4,2,3,5,3,3,2,4,3,3,5,4,3,3,4,4,5,3,4,4,3,4,5,3,4,3,3,4,3].map(v => v * 800),
           labels: ["1","","","","5","","","","","10","","","","","15","","","","","20","","","","","25","","","","","30"] },
  "90d": { receita: 112800, receitaPrev: 92300, enviados: 248, enviadosPrev: 218, aprovados: 142, aprovadosPrev: 115, taxaAprov: 69, taxaAprovPrev: 62,
           tempoResposta: "5h 42min", tempoExec: "2.6 dias", servicoTop: "Funilaria", recusasMotivo: { "Preço alto": 55, "Prazo": 22, "Concorrência": 17, "Outros": 6 },
           trend: [18,22,19,24,26,28,25,30,32,29,34,38].map(v => v * 800),
           trendPrev: [15,18,16,20,22,24,21,26,28,25,30,33].map(v => v * 800),
           labels: ["S1","","","S4","","","S7","","","S10","",""] },
  "12m": { receita: 462000, receitaPrev: 380000, enviados: 1024, enviadosPrev: 882, aprovados: 612, aprovadosPrev: 498, taxaAprov: 70, taxaAprovPrev: 63,
           tempoResposta: "5h 28min", tempoExec: "2.5 dias", servicoTop: "Funilaria", recusasMotivo: { "Preço alto": 56, "Prazo": 21, "Concorrência": 17, "Outros": 6 },
           trend: [28,32,30,36,38,42,40,46,48,52,58,62].map(v => v * 800),
           trendPrev: [22,26,24,30,32,36,34,40,42,46,52,56].map(v => v * 800),
           labels: ["Jun","","","Set","","","Dez","","","Mar","",""] },
};

// ── Página Análises ─────────────────────────────────────────────────
const Analises = ({ navigate, isMobile, module }) => {
  const [range, setRange] = React.useState("30d");
  const [compare, setCompare] = React.useState(true);
  const isLoja = module !== "orca";

  if (isLoja) return <AnaliseLoja range={range} setRange={setRange} compare={compare} setCompare={setCompare} isMobile={isMobile} navigate={navigate}/>;
  return <AnaliseOrca range={range} setRange={setRange} compare={compare} setCompare={setCompare} isMobile={isMobile} navigate={navigate}/>;
};

// ── Análise Loja ────────────────────────────────────────────────────
const AnaliseLoja = ({ range, setRange, compare, setCompare, isMobile, navigate }) => {
  const d = ANALISES_LOJA[range];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Análises</h1>
          <p>Tendências, comparações e detalhamentos · Atelier Maré</p>
        </div>
        <div className="row-wrap">
          <Button variant="secondary" icon={<I.Download size={16}/>}>Exportar PDF</Button>
          <Button variant="secondary" icon={<I.Download size={16}/>}>CSV</Button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <PeriodHeader range={range} setRange={setRange} compare={compare} setCompare={setCompare} isMobile={isMobile}/>
      </div>

      {/* KPIs com comparação */}
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <ComparisonKpi label="Receita líquida" value={fmtBRL(d.receita)} current={d.receita} previous={d.receitaPrev} format={fmtBRL}/>
        <ComparisonKpi label="Pedidos" value={fmtInt(d.pedidos)} current={d.pedidos} previous={d.pedidosPrev}/>
        <ComparisonKpi label="Ticket médio" value={fmtBRL(d.ticket)} current={d.ticket} previous={d.ticketPrev} format={fmtBRL}/>
        <ComparisonKpi label="Margem" value={`${d.margem}%`} current={d.margem} previous={d.margemPrev} format={v => `${v}%`}/>
      </div>

      {/* Tendência com comparação */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="between" style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div className="t-h3">Tendência da receita</div>
            <div className="t-caption t-muted" style={{ marginTop: 2 }}>
              {compare ? `${RANGE_LABELS[range] || range} atual vs período anterior` : RANGE_LABELS[range] || range}
            </div>
          </div>
          <div className="row" style={{ gap: 14, fontSize: 12 }}>
            <div className="row" style={{ gap: 6 }}>
              <span style={{ width: 14, height: 2, background: "var(--tech)", borderRadius: 2 }}/>
              <span style={{ color: "var(--text-muted)" }}>Atual</span>
            </div>
            {compare && (
              <div className="row" style={{ gap: 6 }}>
                <span style={{ width: 14, height: 2, background: "var(--text-faint)", borderRadius: 2, opacity: 0.6 }}/>
                <span style={{ color: "var(--text-muted)" }}>Anterior</span>
              </div>
            )}
          </div>
        </div>
        <LineChart
          height={isMobile ? 180 : 240}
          width={isMobile ? 400 : 800}
          labels={d.labels}
          series={[
            ...(compare ? [{ values: d.trendPrev, color: "var(--text-faint)", dashed: true }] : []),
            { values: d.trend, color: "var(--tech)" },
          ]}
        />
      </div>

      {/* Por canal + Heatmap */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.4fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <SectionHead title="Por canal" hint="participação no período"/>
          <StackedBar segments={[
            { label: "Shopee", value: 42, color: "var(--tech)" },
            { label: "Mercado Livre", value: 29, color: "var(--text)" },
            { label: "Loja física", value: 20, color: "var(--gray-400)" },
            { label: "TikTok Shop", value: 9, color: "var(--gray-200)" },
          ]}/>
          <div className="col" style={{ gap: 10, marginTop: 16 }}>
            {[
              ["Shopee", 42, "var(--tech)", "+4 pts"],
              ["Mercado Livre", 29, "var(--text)", "-1 pt"],
              ["Loja física", 20, "var(--gray-400)", "—"],
              ["TikTok Shop", 9, "var(--gray-200)", "+3 pts"],
            ].map(([n, v, c, delta]) => (
              <div key={n} className="between">
                <div className="row" style={{ gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: c }}/>
                  <span style={{ fontSize: 13 }}>{n}</span>
                </div>
                <div className="row" style={{ gap: 10 }}>
                  <span className="num" style={{ fontWeight: 600, fontSize: 13 }}>{v}%</span>
                  <span className="t-caption" style={{ color: delta.startsWith("+") ? "var(--tech-deep)" : delta.startsWith("-") ? "var(--error)" : "var(--text-faint)", minWidth: 40, textAlign: "right" }}>{delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <SectionHead title="Quando vendemos mais" hint="vendas por dia × hora"/>
          <Heatmap data={HEATMAP_LOJA} isMobile={isMobile}/>
          <div className="row" style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "var(--tech-soft)", color: "var(--tech-deep)", fontSize: 13, gap: 8 }}>
            <I.Sparkles size={16} style={{ flexShrink: 0 }}/>
            <span><strong>Pico: sextas 17h.</strong> Considere antecipar postagens para garantir entrega no fim de semana.</span>
          </div>
        </div>
      </div>

      {/* Análise de produtos */}
      <div className="card" style={{ padding: 0, marginBottom: 16 }}>
        <div className="between" style={{ padding: isMobile ? "16px 16px 12px" : "20px 24px 14px" }}>
          <div>
            <div className="t-h3">Detalhamento por produto</div>
            <div className="t-caption t-muted" style={{ marginTop: 2 }}>top performers do período</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("loja/produtos")}>Ver todos</button>
        </div>
        {isMobile ? (
          <div>
            {[...PRODUCTS].sort((a, b) => b.sold30d * b.price - a.sold30d * a.price).slice(0, 5).map((p, i) => (
              <div key={p.id} className="row" style={{ padding: "12px 16px", gap: 12, borderTop: "1px solid var(--border)" }}>
                <div className="num t-faint" style={{ width: 18, fontWeight: 600, fontSize: 12 }}>{i + 1}</div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.image}</div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div className="t-caption t-muted">
                    <span className="num">{p.sold30d}</span> vendas · margem <span className="num" style={{ color: "var(--tech-deep)", fontWeight: 600 }}>{p.margin}%</span>
                  </div>
                </div>
                <div className="num" style={{ textAlign: "right", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>{fmtBRL(p.price * p.sold30d)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Produto</th>
                  <th className="num" style={{ textAlign: "right" }}>Vendas</th>
                  <th className="num" style={{ textAlign: "right" }}>Receita</th>
                  <th className="num" style={{ textAlign: "right" }}>Margem</th>
                  <th>Tendência</th>
                  <th>Canais</th>
                </tr>
              </thead>
              <tbody>
                {[...PRODUCTS].sort((a, b) => b.sold30d * b.price - a.sold30d * a.price).slice(0, 7).map((p, i) => (
                  <tr key={p.id} className="row-hover">
                    <td className="num t-faint">{i + 1}</td>
                    <td>
                      <div className="row" style={{ gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{p.image}</div>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: "right" }}>{p.sold30d}</td>
                    <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(p.price * p.sold30d)}</td>
                    <td className="num" style={{ textAlign: "right", color: "var(--tech-deep)", fontWeight: 600 }}>{p.margin}%</td>
                    <td><Sparkline values={Array.from({ length: 7 }, () => Math.random() * p.sold30d * 0.4 + p.sold30d * 0.3)} width={64} height={20} fill={false}/></td>
                    <td>
                      <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                        {p.channels.slice(0, 2).map(c => <ChannelPill key={c} name={c}/>)}
                        {p.channels.length > 2 && <span className="t-caption t-faint">+{p.channels.length - 2}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clientes */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        <div className="card">
          <SectionHead title="Composição de clientes" hint={RANGE_LABELS[range] || range}/>
          <div className="row" style={{ alignItems: "center", justifyContent: "center", margin: "12px 0 16px" }}>
            <Donut size={130} stroke={18} segments={[
              { value: d.clientesNovos, color: "var(--tech)" },
              { value: d.clientesRecorrentes, color: "var(--gray-400)" },
            ]}/>
          </div>
          <div className="col" style={{ gap: 10 }}>
            <div className="between">
              <div className="row" style={{ gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--tech)" }}/>
                <span style={{ fontSize: 13 }}>Novos</span>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <span className="num" style={{ fontWeight: 600 }}>{fmtInt(d.clientesNovos)}</span>
                <span className="t-caption t-muted">{Math.round(d.clientesNovos / (d.clientesNovos + d.clientesRecorrentes) * 100)}%</span>
              </div>
            </div>
            <div className="between">
              <div className="row" style={{ gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--gray-400)" }}/>
                <span style={{ fontSize: 13 }}>Recorrentes</span>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <span className="num" style={{ fontWeight: 600 }}>{fmtInt(d.clientesRecorrentes)}</span>
                <span className="t-caption t-muted">{Math.round(d.clientesRecorrentes / (d.clientesNovos + d.clientesRecorrentes) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <SectionHead title="Top clientes" hint="maior receita no período"/>
          <div className="col" style={{ gap: 10 }}>
            {[...CUSTOMERS].sort((a, b) => b.total - a.total).slice(0, 5).map((c, i) => (
              <div key={c.id} className="row" style={{ gap: 12 }}>
                <div className="num t-faint" style={{ width: 18, fontWeight: 600, fontSize: 12 }}>{i + 1}</div>
                <Avatar name={c.name}/>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                  <div className="t-caption t-muted">{c.orders} pedidos · {c.city.split(",")[0]}</div>
                </div>
                <div className="num" style={{ textAlign: "right", fontWeight: 600, fontSize: 13 }}>{fmtBRL(c.total)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Análise Orça ────────────────────────────────────────────────────
const AnaliseOrca = ({ range, setRange, compare, setCompare, isMobile, navigate }) => {
  const d = ANALISES_ORCA[range];
  const taxaConv = Math.round(d.aprovados / d.enviados * 100);
  const taxaConvPrev = Math.round(d.aprovadosPrev / d.enviadosPrev * 100);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Análises</h1>
          <p>Funil, tempos e conversão · Funilaria Schneider</p>
        </div>
        <div className="row-wrap">
          <Button variant="secondary" icon={<I.Download size={16}/>}>Exportar PDF</Button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <PeriodHeader range={range} setRange={setRange} compare={compare} setCompare={setCompare} isMobile={isMobile}/>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <ComparisonKpi label="Receita aprovada" value={fmtBRL(d.receita)} current={d.receita} previous={d.receitaPrev} format={fmtBRL}/>
        <ComparisonKpi label="Orçamentos enviados" value={fmtInt(d.enviados)} current={d.enviados} previous={d.enviadosPrev}/>
        <ComparisonKpi label="Taxa de aprovação" value={`${d.taxaAprov}%`} current={d.taxaAprov} previous={d.taxaAprovPrev} format={v => `${v}%`}/>
        <ComparisonKpi label="Taxa de conversão" value={`${taxaConv}%`} current={taxaConv} previous={taxaConvPrev} format={v => `${v}%`}/>
      </div>

      {/* Tendência */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="between" style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div>
            <div className="t-h3">Receita aprovada no tempo</div>
            <div className="t-caption t-muted" style={{ marginTop: 2 }}>
              {compare ? `atual vs período anterior` : RANGE_LABELS[range] || range}
            </div>
          </div>
          <div className="row" style={{ gap: 14, fontSize: 12 }}>
            <div className="row" style={{ gap: 6 }}>
              <span style={{ width: 14, height: 2, background: "var(--tech)", borderRadius: 2 }}/>
              <span style={{ color: "var(--text-muted)" }}>Atual</span>
            </div>
            {compare && (
              <div className="row" style={{ gap: 6 }}>
                <span style={{ width: 14, height: 2, background: "var(--text-faint)", borderRadius: 2 }}/>
                <span style={{ color: "var(--text-muted)" }}>Anterior</span>
              </div>
            )}
          </div>
        </div>
        <LineChart
          height={isMobile ? 180 : 240}
          width={isMobile ? 400 : 800}
          labels={d.labels}
          series={[
            ...(compare ? [{ values: d.trendPrev, color: "var(--text-faint)", dashed: true }] : []),
            { values: d.trend, color: "var(--tech)" },
          ]}
        />
      </div>

      {/* Tempos médios — métricas grandes */}
      <div className="card" style={{ marginBottom: 16 }}>
        <SectionHead title="Tempos médios" hint="velocidade do funil"/>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 12 : 24, marginTop: 8 }}>
          <BigMetric label="Resposta do cliente" value={d.tempoResposta} hint="entre envio e visualização"/>
          <BigMetric label="Decisão" value="22h 14min" hint="entre visualizado e aprovado"/>
          <BigMetric label="Execução" value={d.tempoExec} hint="entre aprovação e conclusão"/>
          <BigMetric label="Pagamento" value="1.8 dias" hint="entre conclusão e quitação"/>
        </div>
      </div>

      {/* Funil completo */}
      <div className="card" style={{ marginBottom: 16 }}>
        <SectionHead title="Funil completo" hint={RANGE_LABELS[range] || range}/>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5, 1fr)", gap: 12 }}>
          <FunnelStep label="Enviados"     value={String(d.enviados)} pct={100}/>
          <FunnelStep label="Visualizados" value={String(Math.round(d.enviados * 0.85))} pct={85}/>
          <FunnelStep label="Em decisão"   value={String(Math.round(d.enviados * 0.68))} pct={68}/>
          <FunnelStep label="Aprovados"    value={String(d.aprovados)} pct={taxaConv}/>
          <FunnelStep label="Concluídos"   value={String(Math.round(d.aprovados * 0.88))} pct={Math.round(d.aprovados * 0.88 / d.enviados * 100)}/>
        </div>
      </div>

      {/* Análise de recusas + Top serviços */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: 16 }}>
        <div className="card">
          <SectionHead title="Por que recusam" hint="razões mais comuns"/>
          <div className="col" style={{ gap: 14 }}>
            {Object.entries(d.recusasMotivo).map(([motivo, pct]) => (
              <div key={motivo}>
                <div className="between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{motivo}</span>
                  <span className="num t-muted">{pct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: "var(--bg-sunken)" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: motivo === "Preço alto" ? "var(--warning)" : "var(--gray-400)", borderRadius: 999, transition: "width 600ms ease" }}/>
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "var(--warning-soft)", color: "var(--warning)", fontSize: 13, gap: 8 }}>
            <I.Warn size={16} style={{ flexShrink: 0, marginTop: 2 }}/>
            <span><strong style={{ color: "var(--text)" }}>Preço lidera as recusas.</strong> Considere revisar a tabela de mão de obra ou oferecer parcelamento.</span>
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="between" style={{ padding: isMobile ? "16px 16px 12px" : "20px 24px 14px" }}>
            <div>
              <div className="t-h3">Top serviços</div>
              <div className="t-caption t-muted" style={{ marginTop: 2 }}>por receita aprovada</div>
            </div>
          </div>
          {[
            { name: "Funilaria · porta/lateral", count: 18, receita: 24840, margem: 42 },
            { name: "Mecânica · revisão geral",   count: 14, receita: 14280, margem: 48 },
            { name: "Elétrica residencial",       count:  9, receita:  8640, margem: 56 },
            { name: "Ar-condicionado · instalação", count: 7, receita: 6280, margem: 38 },
            { name: "Hidráulica",                 count:  5, receita:  2840, margem: 51 },
          ].map((s, i) => (
            <div key={s.name} className="row" style={{ padding: isMobile ? "12px 16px" : "14px 24px", gap: 12, borderTop: "1px solid var(--border)" }}>
              <div className="num t-faint" style={{ width: 18, fontWeight: 600, fontSize: 12 }}>{i + 1}</div>
              <div className="grow" style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                <div className="t-caption t-muted">
                  <span className="num">{s.count}</span> serviços · margem <span className="num" style={{ color: "var(--tech-deep)", fontWeight: 600 }}>{s.margem}%</span>
                </div>
              </div>
              <div className="num" style={{ textAlign: "right", fontWeight: 600, fontSize: 13, flexShrink: 0 }}>{fmtBRL(s.receita)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RANGE_LABELS = { "7d": "7 dias", "30d": "30 dias", "90d": "90 dias", "12m": "12 meses" };

const BigMetric = ({ label, value, hint }) => (
  <div>
    <div className="t-caption t-muted">{label}</div>
    <div className="num" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.022em", marginTop: 4 }}>{value}</div>
    {hint && <div className="t-caption t-faint" style={{ marginTop: 2 }}>{hint}</div>}
  </div>
);

// Keep old name available too
const Relatorios = Analises;

Object.assign(window, { Analises, AnaliseLoja, AnaliseOrca, Relatorios });
