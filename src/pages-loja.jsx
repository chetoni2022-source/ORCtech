// ORCtech Loja pages

// --- Painel (merges Dashboard + Relatórios via period selector) ---
const RANGE_LABELS = { hoje: "Hoje", "7d": "7 dias", "30d": "30 dias", "90d": "90 dias" };
const RANGE_HINTS  = { hoje: "atualizado em tempo real", "7d": "últimos 7 dias", "30d": "últimos 30 dias", "90d": "últimos 90 dias" };

// Synthetic series per range — bigger numbers for longer periods
const LOJA_DATA = {
  hoje:  { revenue: 3420.00,   orders: 18,  ticket: 190.00, margin: 58, bars: VENDAS_7D, barLabels: ["Qua","Qui","Sex","Sáb","Dom","Seg","Ter"], canalShares: [42, 29, 20, 9] },
  "7d":  { revenue: 19480.00,  orders: 102, ticket: 191.00, margin: 57, bars: VENDAS_7D, barLabels: ["Qua","Qui","Sex","Sáb","Dom","Seg","Ter"], canalShares: [44, 27, 21, 8] },
  "30d": { revenue: 84320.00,  orders: 412, ticket: 204.66, margin: 57,
           bars: [3200, 2800, 3600, 3100, 4200, 3800, 4500, 3900, 4100, 3700, 4400, 4800, 5200, 4900, 5100, 4700, 5300, 5800, 6200, 5900, 6400, 6100, 6800, 7100, 6700, 7200, 7400, 7900, 7600, 8200],
           barLabels: ["1","","","","5","","","","","10","","","","","15","","","","","20","","","","","25","","","","","30"],
           canalShares: [42, 29, 20, 9] },
  "90d": { revenue: 248720.00, orders: 1184, ticket: 210.10, margin: 56,
           bars: [4200, 5100, 4700, 5800, 6300, 7100, 6500, 7800, 8400, 7900, 8600, 9100],
           barLabels: ["S1","","","S4","","","S7","","","S10","",""],
           canalShares: [40, 30, 21, 9] },
};

const LojaDashboard = ({ navigate, isMobile }) => {
  const [range, setRange] = React.useState("hoje");
  const d = LOJA_DATA[range];
  const isHoje = range === "hoje";

  return (
    <div className="page">
      <div className="page-head">
        <div>
          {isHoje ? (
            <>
              <h1 className="t-h1">Bom dia, Marina</h1>
              <p>Atelier Maré · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
            </>
          ) : (
            <>
              <h1 className="t-h1">Painel · {RANGE_LABELS[range]}</h1>
              <p>Atelier Maré · {RANGE_HINTS[range]}</p>
            </>
          )}
        </div>
        <div className="row-wrap" style={{ alignItems: "center" }}>
          <RangePicker value={range} onChange={setRange}/>
          <Button variant="secondary" icon={<I.Download size={16}/>}>Exportar</Button>
          <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("loja/produtos/novo")}>
            Novo produto
          </Button>
        </div>
      </div>

      {/* KPIs — change based on range */}
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard label={isHoje ? "Vendas hoje" : "Receita"} value={fmtBRL(d.revenue)} delta={isHoje ? "+12%" : "+18%"} trend="up" hint={isHoje ? "vs. ontem" : "vs. período anterior"} sparkline={d.bars.slice(-7)}/>
        <KpiCard label="Pedidos" value={String(d.orders)} delta={isHoje ? "+4" : "+12%"} trend="up" hint={isHoje ? "6 a postar" : "no período"}/>
        <KpiCard label="Ticket médio" value={fmtBRL(d.ticket)} delta={isHoje ? "-3%" : "+5%"} trend={isHoje ? "down" : "up"} hint={isHoje ? "vs. semana" : "valor por pedido"}/>
        <KpiCard label="Margem média" value={`${d.margin}%`} hint={isHoje ? "produtos vendidos hoje" : "líquida após taxas"} badge={<Badge tone="success" dot>Saudável</Badge>}/>
      </div>

      {/* Main chart + Insights */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
        gap: 16,
        marginBottom: 16,
      }}>
        <div className="card">
          <div className="between" style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div className="t-h3">Receita · {RANGE_LABELS[range]}</div>
              <div className="t-caption t-muted" style={{ marginTop: 2 }}>
                Total: <span style={{ fontWeight: 600, color: "var(--text)" }}>{fmtBRL(d.revenue)}</span>
              </div>
            </div>
          </div>
          <MiniBars values={d.bars} height={160} labels={d.barLabels}/>

          <div className="divider" style={{ margin: "20px 0 16px" }}/>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
            <ChannelStat name="Shopee" value={fmtBRL(d.revenue * d.canalShares[0] / 100)} share={d.canalShares[0]}/>
            <ChannelStat name="Mercado Livre" value={fmtBRL(d.revenue * d.canalShares[1] / 100)} share={d.canalShares[1]}/>
            <ChannelStat name="Loja física" value={fmtBRL(d.revenue * d.canalShares[2] / 100)} share={d.canalShares[2]}/>
            <ChannelStat name="TikTok Shop" value={fmtBRL(d.revenue * d.canalShares[3] / 100)} share={d.canalShares[3]}/>
          </div>
        </div>

        {/* Insights / Atenção */}
        <div className="card">
          <SectionHead title={isHoje ? "Precisam de atenção" : "Insights"} hint={isHoje ? "ações operacionais" : "padrões do período"}/>
          <div className="col" style={{ gap: 10 }}>
            {isHoje ? (
              <>
                <AlertRow tone="warning" icon={<I.Warn size={16}/>}
                         title="3 produtos com estoque baixo"
                         body="Anel falange, Saia plissada, Bolsa cognac"
                         action={() => navigate("loja/estoque")}/>
                <AlertRow tone="warning" icon={<I.Truck size={16}/>}
                         title="6 pedidos para postar"
                         body="Prazo Mercado Livre: hoje 18h"
                         action={() => navigate("loja/vendas")}/>
                <AlertRow tone="success" icon={<I.Sparkles size={16}/>}
                         title="IA sugere 4 descrições"
                         body="Novos produtos pendentes de revisão"
                         action={() => navigate("loja/produtos")}/>
              </>
            ) : (
              <>
                <AlertRow tone="success" icon={<I.Trend size={16}/>}
                         title="Shopee cresceu 18%"
                         body="Maior canal · ganhou 4 p.p. vs período anterior"/>
                <AlertRow tone="neutral" icon={<I.Sparkles size={16}/>}
                         title="Brincos lideram conversão"
                         body="113 vendas · 64% margem · IA sugere expandir"/>
                <AlertRow tone="warning" icon={<I.Warn size={16}/>}
                         title="Tênis chunky esgotou 2×"
                         body="Demanda > estoque · considere repor mais"
                         action={() => navigate("loja/estoque")}/>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top performers (always 30d) — full width on desktop, single column on mobile */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 0 }}>
          <div className="between" style={{ padding: "20px 24px 12px" }}>
            <div>
              <div className="t-h3">Mais vendidos</div>
              <div className="t-caption t-muted" style={{ marginTop: 2 }}>últimos 30 dias</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("loja/produtos")}>Ver todos</button>
          </div>
          <div>
            {[...PRODUCTS].sort((a,b) => b.sold30d - a.sold30d).slice(0,5).map((p, i) => (
              <div key={p.id} className="row" style={{ gap: 12, padding: "12px 24px", borderTop: "1px solid var(--border)" }}>
                <div className="t-faint mono" style={{ width: 20, fontWeight: 600 }}>{i + 1}</div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.image}</div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13 }}>{p.name}</div>
                  <div className="t-caption t-muted">{p.sold30d} vendas · margem <span style={{ color: "var(--tech-deep)", fontWeight: 600 }}>{p.margin}%</span></div>
                </div>
                <div className="num" style={{ textAlign: "right", fontWeight: 600, fontSize: 13 }}>{fmtBRL(p.price * p.sold30d)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <SectionHead title="Por canal" hint="participação na receita"/>
          <div className="row" style={{ alignItems: "center", justifyContent: "center", margin: "12px 0 16px" }}>
            <Donut size={140} stroke={20} segments={[
              { value: d.canalShares[0], color: "var(--tech)" },
              { value: d.canalShares[1], color: "var(--text)" },
              { value: d.canalShares[2], color: "var(--gray-400)" },
              { value: d.canalShares[3], color: "var(--gray-200)" },
            ]}/>
          </div>
          <div className="col" style={{ gap: 8 }}>
            {[["Shopee", d.canalShares[0], "var(--tech)"], ["Mercado Livre", d.canalShares[1], "var(--text)"], ["Loja física", d.canalShares[2], "var(--gray-400)"], ["TikTok Shop", d.canalShares[3], "var(--gray-200)"]].map(([n, v, c]) => (
              <div key={n} className="between">
                <div className="row" style={{ gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c }}/>
                  <span style={{ fontSize: 13 }}>{n}</span>
                </div>
                <span className="num" style={{ fontWeight: 600 }}>{v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendas recentes (only on Hoje) */}
      {isHoje && (
        <div className="card" style={{ padding: 0 }}>
          <div className="between" style={{ padding: "20px 24px 12px" }}>
            <div>
              <div className="t-h3">Vendas de hoje</div>
              <div className="t-caption t-muted" style={{ marginTop: 2 }}>tempo real · {SALES_TODAY.length} pedidos</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("loja/vendas")}>Ver todas <I.ChevRight size={14}/></button>
          </div>
          {isMobile ? (
            <div>
              {SALES_TODAY.slice(0, 5).map(s => (
                <div key={s.id} style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                  <div className="between">
                    <div className="row" style={{ gap: 8, minWidth: 0 }}>
                      <ChannelPill name={s.channel}/>
                      <span className="num t-caption t-muted">{s.id}</span>
                    </div>
                    <Badge tone={statusTone(s.status)} dot>{s.status}</Badge>
                  </div>
                  <div style={{ fontWeight: 500, marginTop: 6, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.product}</div>
                  <div className="between" style={{ marginTop: 4 }}>
                    <span className="t-caption t-muted">{s.customer}</span>
                    <span className="num" style={{ fontWeight: 600, fontSize: 14 }}>{fmtBRL(s.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th>ID</th><th>Canal</th><th>Produto</th><th className="num" style={{ textAlign: "right" }}>Valor</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {SALES_TODAY.slice(0, 5).map(s => (
                    <tr key={s.id} className="row-hover">
                      <td className="num t-muted" style={{ fontSize: 12 }}>{s.id}</td>
                      <td><ChannelPill name={s.channel}/></td>
                      <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.product}</td>
                      <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(s.price)}</td>
                      <td><Badge tone={statusTone(s.status)} dot>{s.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Range picker — segmented control
const RangePicker = ({ value, onChange }) => {
  const opts = [["hoje", "Hoje"], ["7d", "7d"], ["30d", "30d"], ["90d", "90d"]];
  return (
    <div style={{
      display: "inline-flex", gap: 2, background: "var(--bg-sunken)",
      padding: 3, borderRadius: 10, border: "1px solid var(--border)",
    }}>
      {opts.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)}
                style={{
                  padding: "6px 12px", border: 0, cursor: "pointer",
                  borderRadius: 7, fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                  background: value === k ? "var(--bg-elev)" : "transparent",
                  color: value === k ? "var(--text)" : "var(--text-muted)",
                  boxShadow: value === k ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  transition: "background 120ms ease, color 120ms ease",
                }}>{l}</button>
      ))}
    </div>
  );
};

const KpiCard = ({ label, value, delta, trend, hint, sparkline, badge }) => (
  <div className="card kpi">
    <div className="between">
      <div className="kpi-label">{label}</div>
      {badge && <span className="kpi-badge">{badge}</span>}
    </div>
    <div className="kpi-value tnum" title={typeof value === "string" ? value : ""}>{value}</div>
    <div className="row" style={{ gap: 8, minWidth: 0 }}>
      {delta && (
        <span className={`kpi-delta ${trend}`}>
          {trend === "up" ? <I.ArrowUp size={12}/> : <I.ArrowDown size={12}/>}
          {delta}
        </span>
      )}
      {hint && <span className="t-caption t-faint kpi-hint" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{hint}</span>}
      {sparkline && <div className="kpi-spark" style={{ marginLeft: "auto" }}><Sparkline values={sparkline} width={80} height={28}/></div>}
    </div>
  </div>
);

const Pill = ({ children, on }) => (
  <button style={{
    padding: "4px 10px", borderRadius: 999, border: 0, cursor: "pointer",
    fontSize: 12, fontWeight: 600,
    background: on ? "var(--bg-sunken)" : "transparent",
    color: on ? "var(--text)" : "var(--text-muted)",
  }}>{children}</button>
);

const ChannelStat = ({ name, value, share }) => (
  <div>
    <div className="t-caption t-muted" style={{ marginBottom: 4 }}>{name}</div>
    <div className="mono" style={{ fontWeight: 600, fontSize: 16 }}>{value}</div>
    <div style={{ marginTop: 6, height: 4, borderRadius: 999, background: "var(--bg-sunken)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${share}%`, background: "var(--tech)", borderRadius: 999 }}/>
    </div>
  </div>
);

const AlertRow = ({ tone, icon, title, body, action }) => {
  const toneColors = {
    warning: { bg: "var(--warning-soft)", fg: "var(--warning)" },
    success: { bg: "var(--tech-soft)",    fg: "var(--tech)" },
    error:   { bg: "var(--error-soft)",   fg: "var(--error)" },
    neutral: { bg: "var(--bg-sunken)",    fg: "var(--text-muted)" },
  }[tone] || { bg: "var(--bg-sunken)", fg: "var(--text-muted)" };

  return (
    <button onClick={action} style={{
      display: "flex", alignItems: "flex-start", gap: 12, padding: 14,
      borderRadius: 10, border: "1px solid var(--border)",
      background: "var(--bg-sunken)",
      width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
      color: "var(--text)",
      transition: "border-color 120ms ease, background 120ms ease",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-strong)"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        background: toneColors.bg, color: toneColors.fg,
      }}>
        {icon}
      </div>
      <div className="grow" style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{title}</div>
        <div className="t-caption t-muted" style={{ marginTop: 2 }}>{body}</div>
      </div>
      <I.ChevRight size={16} style={{ color: "var(--text-faint)", marginTop: 6, flexShrink: 0 }}/>
    </button>
  );
};

// --- Produtos (lista) ---
const LojaProdutos = ({ navigate, isMobile, embedded = false }) => {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("Todos");
  const filtered = PRODUCTS.filter(p => {
    if (filter === "Estoque baixo" && p.stock > p.lowStock) return false;
    if (filter === "Esgotados" && p.stock !== 0) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inner = (<>
      {!embedded && (
        <div className="page-head">
          <div>
            <h1 className="t-h1">Produtos</h1>
            <p>{PRODUCTS.length} produtos · publicados em 4 canais</p>
          </div>
          <div className="row-wrap">
            <Button variant="secondary" icon={<I.Upload size={16}/>}>Importar</Button>
            <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("loja/produtos/novo")}>
              Novo produto
            </Button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 16, display: "flex", gap: 12, flexWrap: "wrap", borderBottom: "1px solid var(--border)" }}>
          <div className="input-icon-wrap grow" style={{ maxWidth: 360, minWidth: 200 }}>
            <span className="input-icon"><I.Search size={16}/></span>
            <input className="input" placeholder="Buscar por nome ou SKU…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
            {["Todos", "Estoque baixo", "Esgotados"].map(f => (
              <Pill key={f} on={filter === f}>
                <span onClick={() => setFilter(f)}>{f}</span>
              </Pill>
            ))}
          </div>
        </div>

        {isMobile ? (
          <div className="col" style={{ gap: 0 }}>
            {filtered.length === 0 ? (
              <EmptyState icon={<I.Box size={26}/>}
                          title={search ? "Nada encontrado" : "Nenhum produto ainda"}
                          body={search ? "Tente outro termo ou limpe o filtro." : "Cadastre seu primeiro produto. A IA escreve a descrição, otimiza a foto e publica em 4 canais."}
                          action={search
                            ? <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setFilter("Todos"); }}>Limpar busca</Button>
                            : <Button variant="primary" icon={<I.Sparkles size={14}/>} onClick={() => navigate("loja/produtos/novo")}>Cadastrar com IA</Button>}/>
            ) : filtered.map(p => (
              <button key={p.id} className="row" onClick={() => {}}
                      style={{ padding: 14, gap: 12, background: "transparent", border: 0, borderBottom: "1px solid var(--border)", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit" }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{p.image}</div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>{p.name}</div>
                  <div className="row" style={{ gap: 8, marginTop: 4 }}>
                    <span className="num t-caption t-muted">{p.sku}</span>
                    <span className="t-caption t-muted">·</span>
                    <span className="num t-caption" style={{ color: p.stock === 0 ? "var(--error)" : p.stock <= p.lowStock ? "var(--warning)" : "var(--text-muted)" }}>{p.stock} em estoque</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="num" style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{fmtBRL(p.price)}</div>
                  <div className="t-caption t-muted">{p.margin}% margem</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          filtered.length === 0 ? (
            <EmptyState icon={<I.Box size={26}/>}
                        title={search ? "Nada encontrado" : "Nenhum produto ainda"}
                        body={search ? "Tente outro termo ou limpe o filtro." : "Cadastre seu primeiro produto. A IA escreve a descrição, otimiza a foto e publica em 4 canais."}
                        action={search
                          ? <Button variant="secondary" onClick={() => { setSearch(""); setFilter("Todos"); }}>Limpar busca</Button>
                          : <Button variant="primary" icon={<I.Sparkles size={14}/>} onClick={() => navigate("loja/produtos/novo")}>Cadastrar com IA</Button>}/>
          ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <colgroup>
                <col style={{ minWidth: 200 }}/>
                <col style={{ width: 100 }}/>
                <col style={{ width: 180 }}/>
                <col style={{ width: 100 }}/>
                <col style={{ width: 80 }}/>
                <col style={{ width: 110 }}/>
                <col style={{ width: 48 }}/>
              </colgroup>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th className="nowrap tbl-hide-md">SKU</th>
                  <th className="tbl-hide-md">Canais</th>
                  <th className="num" style={{ textAlign: "right" }}>Preço</th>
                  <th className="num" style={{ textAlign: "right" }}>Estoque</th>
                  <th>Status</th>
                  <th className="tbl-hide-md"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="row-hover">
                    <td>
                      <div className="row" style={{ gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.image}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{p.name}</div>
                          <div className="t-caption t-muted">{p.category} · <span className="mono">{p.sku}</span></div>
                        </div>
                      </div>
                    </td>
                    <td className="mono nowrap tbl-hide-md" style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.sku}</td>
                    <td className="tbl-hide-md">
                      <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>
                        {p.channels.slice(0, 3).map(c => <ChannelPill key={c} name={c}/>)}
                        {p.channels.length > 3 && <span className="t-caption t-faint">+{p.channels.length - 3}</span>}
                      </div>
                    </td>
                    <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(p.price)}</td>
                    <td className="num" style={{ textAlign: "right", color: p.stock === 0 ? "var(--error)" : p.stock <= p.lowStock ? "var(--warning)" : "var(--text)", fontWeight: 600 }}>
                      {p.stock}
                    </td>
                    <td className="nowrap"><Badge tone={statusTone(p.status)} dot>{p.status}</Badge></td>
                    <td className="tbl-hide-md"><button className="btn btn-secondary btn-icon btn-sm"><I.More size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        )}
      </div>
    </>);

  return embedded ? inner : <div className="page">{inner}</div>;
};

// --- Novo produto (com IA) ---
const LojaNovoProduto = ({ navigate, isMobile, onToast }) => {
  const [step, setStep] = React.useState(1); // 1 = foto/SKU, 2 = IA preenchendo, 3 = revisão
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [stock, setStock] = React.useState("12");
  const [tags, setTags] = React.useState([]);
  const [channels, setChannels] = React.useState(["Shopee", "ML", "TikTok"]);

  const generate = () => {
    setStep(2);
    setTimeout(() => {
      setName("Vestido midi linho rosê acetinado");
      setDesc("Vestido midi em mistura de linho com toque acetinado. Modelagem soltinha na cintura e fenda discreta. Tecido leve, perfeito para festas ao ar livre. Composição: 70% linho, 30% viscose.");
      setPrice("219.90");
      setCategory("Vestidos");
      setTags(["midi", "linho", "festa", "rosê", "verão"]);
      setStep(3);
    }, 1900);
  };

  const save = () => {
    onToast("Produto criado e publicado em 3 canais");
    setTimeout(() => navigate("loja/produtos"), 600);
  };

  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("loja/produtos")}>
          <I.ChevLeft size={14}/> Produtos
        </button>
      </div>
      <h1 className="t-h1" style={{ marginBottom: 4 }}>Novo produto</h1>
      <p className="t-muted" style={{ marginBottom: 24 }}>A IA escreve, categoriza e prepara para publicar em todos os canais.</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 16 }}>
        <div className="card">
          {/* Photo + SKU */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{
              aspectRatio: "1", borderRadius: 10, border: "1.5px dashed var(--border-strong)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8, color: "var(--text-muted)", background: "var(--bg-sunken)",
              cursor: "pointer"
            }}>
              <I.Camera size={28}/>
              <div className="t-caption" style={{ textAlign: "center" }}>Foto do produto<br/>(IA usa para analisar)</div>
            </div>
            <div className="col" style={{ gap: 12 }}>
              <div className="field">
                <label className="field-label">SKU</label>
                <input className="input mono" defaultValue="VS-0521"/>
              </div>
              <div className="field">
                <label className="field-label">Foto-prompt (opcional)</label>
                <textarea className="textarea" placeholder="Cole observações sobre o produto: composição, medidas, qualquer detalhe que a IA não pega da foto…" rows={3}/>
                <span className="field-hint">Tudo que você não escrever, a IA preenche.</span>
              </div>
              <Button variant="primary" icon={step === 2 ? <I.Refresh size={16} className="spin"/> : <I.Sparkles size={16}/>} onClick={generate} disabled={step === 2}>
                {step === 1 && "Preencher com IA"}
                {step === 2 && "Analisando foto…"}
                {step === 3 && "Refazer com IA"}
              </Button>
            </div>
          </div>

          <div className="divider" style={{ margin: "8px 0 20px" }}/>

          {/* Generated fields */}
          {step === 1 && (
            <div className="empty">
              <I.Wand size={28}/>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>Aguardando IA</div>
              <div className="t-caption" style={{ maxWidth: 280 }}>Adicione uma foto e SKU. A IA gera nome, descrição, categoria, preço sugerido e tags.</div>
            </div>
          )}

          {step === 2 && (
            <div className="col" style={{ gap: 14 }}>
              <div className="row" style={{ gap: 10, padding: "12px 14px", background: "var(--tech-soft)", borderRadius: 10 }}>
                <I.Sparkles size={16} style={{ color: "var(--tech-deep)" }} className="pulse"/>
                <span className="t-body" style={{ fontWeight: 600 }}>Analisando foto e gerando conteúdo otimizado…</span>
              </div>
              <div className="skel" style={{ height: 14, width: "40%" }}/>
              <div className="skel" style={{ height: 14, width: "70%" }}/>
              <div className="skel" style={{ height: 14, width: "55%" }}/>
              <div className="skel" style={{ height: 14, width: "85%" }}/>
            </div>
          )}

          {step === 3 && (
            <div className="col" style={{ gap: 16 }}>
              <div className="ia-chip"><I.Sparkles size={12}/>Gerado pela IA · revise antes de publicar</div>
              <div className="field">
                <label className="field-label">Nome do produto</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)}/>
              </div>
              <div className="field">
                <label className="field-label">Descrição</label>
                <textarea className="textarea" value={desc} onChange={e => setDesc(e.target.value)} rows={4}/>
                <span className="field-hint">Otimizada para Shopee, ML e TikTok (≤ 500 caracteres).</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="field-label">Preço</label>
                  <input className="input mono" value={price} onChange={e => setPrice(e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Estoque</label>
                  <input className="input mono" value={stock} onChange={e => setStock(e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Categoria</label>
                  <input className="input" value={category} onChange={e => setCategory(e.target.value)}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Tags sugeridas</label>
                <div className="row-wrap" style={{ gap: 6 }}>
                  {tags.map(t => (
                    <span key={t} className="badge badge-neutral" style={{ height: 26, padding: "0 10px" }}>
                      #{t}
                      <button onClick={() => setTags(tags.filter(x => x !== t))} style={{ marginLeft: 4, border: 0, background: "transparent", padding: 0, cursor: "pointer", color: "inherit", display: "flex" }}>
                        <I.X size={12}/>
                      </button>
                    </span>
                  ))}
                  <button className="btn btn-secondary btn-sm" style={{ height: 26, padding: "0 10px" }}>
                    <I.Plus size={12}/> tag
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — publish settings */}
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <SectionHead title="Publicar em"/>
            <div className="col" style={{ gap: 10 }}>
              {["Shopee", "Mercado Livre", "TikTok Shop", "Loja física"].map(c => {
                const key = c === "Mercado Livre" ? "ML" : c === "TikTok Shop" ? "TikTok" : c === "Loja física" ? "Loja" : c;
                const on = channels.includes(key);
                return (
                  <div key={c} className="between">
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{c}</span>
                    <button className={`switch ${on ? "on" : ""}`} onClick={() => setChannels(on ? channels.filter(x => x !== key) : [...channels, key])}/>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <SectionHead title="Sugestão de preço da IA"/>
            <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{step === 3 ? "R$ 219,90" : "—"}</div>
            <div className="t-caption t-muted" style={{ marginTop: 4 }}>
              Faixa do mercado: <span className="mono">R$ 189–249</span><br/>
              Margem prevista: <span className="mono" style={{ color: "var(--tech-deep)", fontWeight: 600 }}>59%</span>
            </div>
          </div>

          <div className="col" style={{ gap: 8 }}>
            <Button variant="primary" fullWidth icon={<I.Check size={16}/>} onClick={save} disabled={step !== 3}>
              Publicar produto
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate("loja/produtos")}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Vendas ---
const LojaVendas = ({ navigate, isMobile }) => {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Vendas</h1>
          <p>18 pedidos hoje · 6 para postar</p>
        </div>
        <div className="row-wrap">
          <Button variant="secondary" icon={<I.Filter size={16}/>}>Filtros</Button>
          <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("loja/vendas/novo")}>Nova venda</Button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard label="Receita bruta" value="R$ 3.420,00" delta="+12%" trend="up"/>
        <KpiCard label="Taxas marketplace" value="R$ 287,40" hint="8,4% da receita"/>
        <KpiCard label="Receita líquida" value="R$ 3.132,60" delta="+11%" trend="up"/>
        <KpiCard label="Pedidos a postar" value="6" hint="prazo ML: 18h" badge={<Badge tone="warning" dot>Urgente</Badge>}/>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {isMobile ? (
          <>
            <div style={{ padding: "16px 16px 8px" }}>
              <div className="t-h3">Hoje, 14 de maio</div>
              <div className="t-caption t-muted" style={{ marginTop: 2 }}>{SALES_TODAY.length} pedidos · tempo real</div>
            </div>
            <div style={{ padding: "0 16px 14px", display: "flex", gap: 6, overflowX: "auto", flexWrap: "nowrap" }}>
              <Pill on>Todos</Pill><Pill>Pagos</Pill><Pill>Pendentes</Pill><Pill>A postar</Pill>
            </div>
          </>
        ) : (
          <div className="between" style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
            <div className="t-h3">Hoje, 14 de maio</div>
            <div className="row">
              <Pill on>Todos</Pill><Pill>Pagos</Pill><Pill>Pendentes</Pill>
            </div>
          </div>
        )}
        {isMobile ? (
          <div>
            {SALES_TODAY.map(s => (
              <div key={s.id} style={{ padding: 14, borderTop: "1px solid var(--border)" }}>
                <div className="between">
                  <div className="row" style={{ gap: 8, minWidth: 0 }}>
                    <ChannelPill name={s.channel}/>
                    <span className="num t-caption t-muted">{s.time}</span>
                  </div>
                  <Badge tone={statusTone(s.status)} dot>{s.status}</Badge>
                </div>
                <div style={{ fontWeight: 600, marginTop: 6, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.product}</div>
                <div className="between" style={{ marginTop: 4 }}>
                  <div className="row" style={{ gap: 6, minWidth: 0 }}>
                    <span className="t-caption t-muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.customer}</span>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="num" style={{ fontWeight: 600, fontSize: 14 }}>{fmtBRL(s.price)}</div>
                    {s.fee > 0 && <div className="num t-caption t-muted">líq. {fmtBRL(s.net)}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr><th>ID</th><th>Hora</th><th>Canal</th><th>Cliente</th><th>Produto</th><th style={{ textAlign: "right" }}>Bruto</th><th style={{ textAlign: "right" }}>Taxa</th><th style={{ textAlign: "right" }}>Líquido</th><th>Status</th></tr>
            </thead>
            <tbody>
              {SALES_TODAY.map(s => (
                <tr key={s.id} className="row-hover">
                  <td className="mono t-muted" style={{ fontSize: 12 }}>{s.id}</td>
                  <td className="mono t-muted" style={{ fontSize: 12 }}>{s.time}</td>
                  <td><ChannelPill name={s.channel}/></td>
                  <td>{s.customer}</td>
                  <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.product}</td>
                  <td className="num" style={{ textAlign: "right" }}>{fmtBRL(s.price)}</td>
                  <td className="num" style={{ textAlign: "right", color: "var(--text-muted)" }}>{s.fee > 0 ? "-" + fmtBRL(s.fee) : "—"}</td>
                  <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(s.net)}</td>
                  <td><Badge tone={statusTone(s.status)} dot>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- Estoque ---
const LojaEstoque = ({ navigate, isMobile }) => {
  const lowStock = PRODUCTS.filter(p => p.stock <= p.lowStock);
  const totalValue = PRODUCTS.reduce((s, p) => s + p.stock * p.price, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Estoque</h1>
          <p>{PRODUCTS.length} SKUs · valor total: <span className="mono">{fmtBRL(totalValue)}</span></p>
        </div>
        <div className="row-wrap">
          <Button variant="secondary" icon={<I.Download size={16}/>}>Exportar</Button>
          <Button variant="primary" icon={<I.Plus size={16}/>}>Entrada de estoque</Button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard label="SKUs ativos" value={String(PRODUCTS.filter(p => p.status === "Ativo").length)} hint={`de ${PRODUCTS.length} totais`}/>
        <KpiCard label="Estoque baixo" value={String(lowStock.length)} badge={<Badge tone="warning" dot>Atenção</Badge>}/>
        <KpiCard label="Esgotados" value={String(PRODUCTS.filter(p => p.stock === 0).length)} badge={<Badge tone="error" dot>Repor</Badge>}/>
        <KpiCard label="Valor em estoque" value={fmtBRL(totalValue)} hint="preço de venda"/>
      </div>

      <div className="card" style={{ padding: 0, marginBottom: 16 }}>
        <div className="between" style={{ padding: isMobile ? "16px 16px 12px" : "20px 24px 14px" }}>
          <div>
            <div className="t-h3">Repor com prioridade</div>
            <div className="t-caption t-muted" style={{ marginTop: 2 }}>{lowStock.length} produtos abaixo do mínimo</div>
          </div>
          {!isMobile && <button className="btn btn-ghost btn-sm">Avisar fornecedores</button>}
        </div>
        <div>
          {lowStock.map(p => (
            <div key={p.id} style={{ padding: isMobile ? "12px 16px" : "14px 24px", borderTop: "1px solid var(--border)" }}>
              <div className="row" style={{ gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.image}</div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div className="t-caption t-muted">
                    <span className="num">{p.sku}</span> · vendeu <span className="num">{p.sold30d}×</span> em 30d
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="num" style={{ fontWeight: 600, fontSize: 15, color: p.stock === 0 ? "var(--error)" : "var(--warning)" }}>{p.stock} un.</div>
                  <div className="t-caption t-faint">mín. <span className="num">{p.lowStock}</span></div>
                </div>
              </div>
              {isMobile && (
                <div className="row" style={{ gap: 8, marginTop: 10 }}>
                  <Button variant="secondary" size="sm" fullWidth icon={<I.Plus size={14}/>}>Repor</Button>
                  <Button variant="secondary" size="sm" fullWidth icon={<I.WhatsApp size={14}/>}>Fornecedor</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inventário completo */}
      <div className="card" style={{ padding: 0 }}>
        <div className="between" style={{ padding: isMobile ? "16px 16px 12px" : "20px 24px 14px" }}>
          <div>
            <div className="t-h3">Inventário completo</div>
            <div className="t-caption t-muted" style={{ marginTop: 2 }}>{PRODUCTS.length} SKUs</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("loja/produtos")}>Ver produtos</button>
        </div>
        {isMobile ? (
          <div>
            {PRODUCTS.slice(0, 6).map(p => (
              <div key={p.id} className="row" style={{ padding: "12px 16px", gap: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{p.image}</div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div className="t-caption t-muted num">{p.sku}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="num" style={{ fontWeight: 600, fontSize: 14, color: p.stock === 0 ? "var(--error)" : p.stock <= p.lowStock ? "var(--warning)" : "var(--text)" }}>{p.stock}</div>
                  <div className="t-caption t-faint">un.</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr><th>Produto</th><th>SKU</th><th className="num" style={{ textAlign: "right" }}>Em estoque</th><th className="num" style={{ textAlign: "right" }}>Mínimo</th><th className="num" style={{ textAlign: "right" }}>Vendas 30d</th><th>Status</th></tr>
              </thead>
              <tbody>
                {PRODUCTS.map(p => (
                  <tr key={p.id} className="row-hover">
                    <td>
                      <div className="row" style={{ gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{p.image}</div>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td className="num t-muted" style={{ fontSize: 12 }}>{p.sku}</td>
                    <td className="num" style={{ textAlign: "right", fontWeight: 600, color: p.stock === 0 ? "var(--error)" : p.stock <= p.lowStock ? "var(--warning)" : "var(--text)" }}>{p.stock}</td>
                    <td className="num t-faint" style={{ textAlign: "right" }}>{p.lowStock}</td>
                    <td className="num t-muted" style={{ textAlign: "right" }}>{p.sold30d}</td>
                    <td><Badge tone={statusTone(p.status)} dot>{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Serviços (catálogo) ---
const LojaServicos = ({ navigate, isMobile, embedded = false }) => {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("Todos");
  const cats = ["Todos", ...Array.from(new Set(SERVICES.map(s => s.category)))];
  const filtered = SERVICES.filter(s => {
    if (filter !== "Todos" && s.category !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const inner = (<>
      {!embedded && (
        <div className="page-head">
          <div>
            <h1 className="t-h1">Serviços</h1>
            <p>{SERVICES.length} serviços cadastrados · usados em vendas e orçamentos</p>
          </div>
          <div className="row-wrap">
            <Button variant="secondary" icon={<I.Upload size={16}/>}>Importar</Button>
            <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("loja/servicos/novo")}>
              Novo serviço
            </Button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 16, display: "flex", gap: 12, flexWrap: "wrap", borderBottom: "1px solid var(--border)" }}>
          <div className="input-icon-wrap grow" style={{ maxWidth: 360, minWidth: 200 }}>
            <span className="input-icon"><I.Search size={16}/></span>
            <input className="input" placeholder="Buscar por nome ou código…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
            {cats.map(f => (
              <Pill key={f} on={filter === f}>
                <span onClick={() => setFilter(f)}>{f}</span>
              </Pill>
            ))}
          </div>
        </div>

        {isMobile ? (
          <div className="col" style={{ gap: 0 }}>
            {filtered.length === 0 ? (
              <EmptyState icon={<I.Tool size={26}/>}
                          title={search ? "Nada encontrado" : "Nenhum serviço cadastrado"}
                          body={search ? "Tente outro termo ou limpe o filtro." : "Cadastre os serviços que você presta. Reutilize em vendas e orçamentos."}
                          action={search
                            ? <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setFilter("Todos"); }}>Limpar busca</Button>
                            : <Button variant="primary" icon={<I.Sparkles size={14}/>} onClick={() => navigate("loja/servicos/novo")}>Cadastrar com IA</Button>}/>
            ) : filtered.map(s => (
              <button key={s.id} className="row" onClick={() => {}}
                      style={{ padding: 14, gap: 12, background: "transparent", border: 0, borderBottom: "1px solid var(--border)", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit" }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tech-deep)", flexShrink: 0 }}>
                  {React.createElement(I[s.icon] || I.Tool, { size: 20 })}
                </div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text)" }}>{s.name}</div>
                  <div className="row" style={{ gap: 8, marginTop: 4 }}>
                    <span className="num t-caption t-muted">{s.code}</span>
                    <span className="t-caption t-muted">·</span>
                    <span className="t-caption t-muted">{s.duration} min</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="num" style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{fmtBRL(s.price)}</div>
                  <div className="t-caption t-muted">{s.sold30d} no mês</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          filtered.length === 0 ? (
            <EmptyState icon={<I.Tool size={26}/>}
                        title={search ? "Nada encontrado" : "Nenhum serviço cadastrado"}
                        body={search ? "Tente outro termo ou limpe o filtro." : "Cadastre os serviços que você presta. Reutilize em vendas e orçamentos sem digitar tudo de novo."}
                        action={search
                          ? <Button variant="secondary" onClick={() => { setSearch(""); setFilter("Todos"); }}>Limpar busca</Button>
                          : <Button variant="primary" icon={<I.Sparkles size={14}/>} onClick={() => navigate("loja/servicos/novo")}>Cadastrar com IA</Button>}/>
          ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <colgroup>
                <col style={{ minWidth: 220 }}/>
                <col style={{ width: 110 }}/>
                <col style={{ width: 160 }}/>
                <col style={{ width: 90 }}/>
                <col style={{ width: 110 }}/>
                <col style={{ width: 110 }}/>
                <col style={{ width: 48 }}/>
              </colgroup>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th className="nowrap tbl-hide-md">Código</th>
                  <th className="tbl-hide-md">Categoria</th>
                  <th className="num" style={{ textAlign: "right" }}>Duração</th>
                  <th className="num" style={{ textAlign: "right" }}>Preço</th>
                  <th>Status</th>
                  <th className="tbl-hide-md"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="row-hover">
                    <td>
                      <div className="row" style={{ gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tech-deep)", flexShrink: 0 }}>
                          {React.createElement(I[s.icon] || I.Tool, { size: 18 })}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{s.name}</div>
                          <div className="t-caption t-muted">{s.category} · garantia {s.warranty}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono nowrap tbl-hide-md" style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.code}</td>
                    <td className="tbl-hide-md t-muted" style={{ fontSize: 13 }}>{s.category}</td>
                    <td className="num" style={{ textAlign: "right", color: "var(--text-muted)" }}>{s.duration} min</td>
                    <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(s.price)}<span className="t-caption t-faint" style={{ display: "block", fontWeight: 400 }}>/ {s.unit}</span></td>
                    <td className="nowrap"><Badge tone={statusTone(s.status)} dot>{s.status}</Badge></td>
                    <td className="tbl-hide-md"><button className="btn btn-secondary btn-icon btn-sm"><I.More size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )
        )}
      </div>
    </>);

  return embedded ? inner : <div className="page">{inner}</div>;
};

// --- Novo serviço (com IA) ---
const LojaNovoServico = ({ navigate, isMobile, onToast }) => {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [duration, setDuration] = React.useState("60");
  const [category, setCategory] = React.useState("");
  const [unit, setUnit] = React.useState("serviço");
  const [warranty, setWarranty] = React.useState("90 dias");
  const [materials, setMaterials] = React.useState([]);
  const [transcript, setTranscript] = React.useState("Troca de tela de iPhone 13. Cliente espera no balcão, fazemos em até 1h. Usa tela compatível AAA e cola B-7000. Cobramos R$ 580 e damos 90 dias de garantia.");

  const generate = () => {
    setStep(2);
    setTimeout(() => {
      setName("Troca de tela iPhone 13");
      setDesc("Substituição de tela LCD/touch em iPhone 13 com tela compatível AAA. Inclui calibração, teste de touch e selagem. Garantia de 90 dias contra defeito de fabricação.");
      setPrice("580.00");
      setDuration("60");
      setCategory("Reparo celular");
      setUnit("serviço");
      setWarranty("90 dias");
      setMaterials(["Tela compatível AAA", "Cola B-7000", "Adesivo de selagem"]);
      setStep(3);
    }, 1700);
  };

  const save = () => {
    onToast("Serviço criado no catálogo");
    setTimeout(() => navigate("loja/servicos"), 600);
  };

  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("loja/servicos")}>
          <I.ChevLeft size={14}/> Serviços
        </button>
      </div>
      <h1 className="t-h1" style={{ marginBottom: 4 }}>Novo serviço</h1>
      <p className="t-muted" style={{ marginBottom: 24 }}>Cadastre uma vez. Reutilize em vendas e orçamentos sem refazer.</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 16 }}>
        <div className="card">
          <div className="field" style={{ marginBottom: 16 }}>
            <label className="field-label">Descreva o serviço</label>
            <textarea className="textarea" rows={4} value={transcript} onChange={e => setTranscript(e.target.value)}/>
            <div className="between" style={{ marginTop: 6 }}>
              <span className="field-hint">Texto livre. A IA extrai nome, categoria, preço, duração e materiais.</span>
              <button className="btn btn-ghost btn-sm" style={{ padding: 0, height: "auto" }}>
                <I.Phone size={12}/> Gravar áudio
              </button>
            </div>
          </div>

          <Button variant="primary" icon={step === 2 ? <I.Refresh size={16} className="spin"/> : <I.Sparkles size={16}/>} onClick={generate} disabled={step === 2}>
            {step === 1 && "Preencher com IA"}
            {step === 2 && "Analisando…"}
            {step === 3 && "Refazer com IA"}
          </Button>

          <div className="divider" style={{ margin: "20px 0" }}/>

          {step === 1 && (
            <div className="empty">
              <I.Wand size={28}/>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>Aguardando IA</div>
              <div className="t-caption" style={{ maxWidth: 320 }}>Descreva o serviço em texto livre. A IA preenche nome, categoria, duração, preço e materiais.</div>
            </div>
          )}

          {step === 2 && (
            <div className="col" style={{ gap: 14 }}>
              <div className="row" style={{ gap: 10, padding: "12px 14px", background: "var(--tech-soft)", borderRadius: 10 }}>
                <I.Sparkles size={16} style={{ color: "var(--tech-deep)" }} className="pulse"/>
                <span className="t-body" style={{ fontWeight: 600 }}>Identificando serviço, materiais e duração…</span>
              </div>
              <div className="skel" style={{ height: 14, width: "40%" }}/>
              <div className="skel" style={{ height: 14, width: "70%" }}/>
              <div className="skel" style={{ height: 14, width: "55%" }}/>
            </div>
          )}

          {step === 3 && (
            <div className="col" style={{ gap: 16 }}>
              <div className="ia-chip"><I.Sparkles size={12}/>Gerado pela IA · revise antes de salvar</div>
              <div className="field">
                <label className="field-label">Nome do serviço</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)}/>
              </div>
              <div className="field">
                <label className="field-label">Descrição</label>
                <textarea className="textarea" value={desc} onChange={e => setDesc(e.target.value)} rows={3}/>
                <span className="field-hint">Aparece no orçamento e no recibo do cliente.</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="field-label">Preço</label>
                  <input className="input mono" value={price} onChange={e => setPrice(e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Duração (min)</label>
                  <input className="input mono" value={duration} onChange={e => setDuration(e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Unidade</label>
                  <select className="input" value={unit} onChange={e => setUnit(e.target.value)}>
                    <option value="serviço">serviço</option>
                    <option value="hora">hora</option>
                    <option value="visita">visita</option>
                    <option value="m²">m²</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Categoria</label>
                  <input className="input" value={category} onChange={e => setCategory(e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Garantia</label>
                  <input className="input" value={warranty} onChange={e => setWarranty(e.target.value)}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Materiais incluídos</label>
                <div className="row-wrap" style={{ gap: 6 }}>
                  {materials.map(m => (
                    <span key={m} className="badge badge-neutral" style={{ height: 26, padding: "0 10px" }}>
                      {m}
                      <button onClick={() => setMaterials(materials.filter(x => x !== m))} style={{ marginLeft: 4, border: 0, background: "transparent", padding: 0, cursor: "pointer", color: "inherit", display: "flex" }}>
                        <I.X size={12}/>
                      </button>
                    </span>
                  ))}
                  <button className="btn btn-secondary btn-sm" style={{ height: 26, padding: "0 10px" }}>
                    <I.Plus size={12}/> material
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — disponibilidade */}
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <SectionHead title="Onde será usado"/>
            <div className="col" style={{ gap: 10 }}>
              {[
                { name: "Vendas (Loja)",       hint: "Cliente paga e leva no balcão" },
                { name: "Orçamentos (Orça)",    hint: "Inclui na proposta enviada por WhatsApp" },
                { name: "Agenda",              hint: "Aparece para agendamento" },
              ].map(c => (
                <div key={c.name} className="between">
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</div>
                    <div className="t-caption t-faint">{c.hint}</div>
                  </div>
                  <button className="switch on"/>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <SectionHead title="Sugestão de preço da IA"/>
            <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{step === 3 ? "R$ 580,00" : "—"}</div>
            <div className="t-caption t-muted" style={{ marginTop: 4 }}>
              Faixa do mercado: <span className="mono">R$ 480–650</span><br/>
              Margem prevista: <span className="mono" style={{ color: "var(--tech-deep)", fontWeight: 600 }}>52%</span>
            </div>
          </div>

          <div className="col" style={{ gap: 8 }}>
            <Button variant="primary" fullWidth icon={<I.Check size={16}/>} onClick={save} disabled={step !== 3}>
              Salvar no catálogo
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate("loja/servicos")}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Catálogo unificado (segmento híbrido) ---
const LojaCatalogo = ({ navigate, isMobile }) => {
  const [tab, setTab] = React.useState("produtos");

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Catálogo</h1>
          <p>Produtos e serviços que você vende. Mesmos itens aparecem nas vendas e orçamentos.</p>
        </div>
        <div className="row-wrap">
          {tab === "produtos"
            ? <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("loja/produtos/novo")}>Novo produto</Button>
            : <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("loja/servicos/novo")}>Novo serviço</Button>}
        </div>
      </div>

      <div className="row" style={{ gap: 6, marginBottom: 16, borderBottom: "1px solid var(--border)" }}>
        {[
          { k: "produtos", label: "Produtos", count: PRODUCTS.length, icon: "Box" },
          { k: "servicos", label: "Serviços", count: SERVICES.length, icon: "Tool" },
        ].map(t => {
          const on = tab === t.k;
          return (
            <button key={t.k} onClick={() => setTab(t.k)}
                    style={{
                      padding: "10px 14px", border: 0, background: "transparent",
                      borderBottom: "2px solid " + (on ? "var(--tech)" : "transparent"),
                      color: on ? "var(--text)" : "var(--text-muted)",
                      fontWeight: on ? 600 : 500, fontSize: 14, cursor: "pointer",
                      display: "flex", gap: 8, alignItems: "center", marginBottom: -1,
                      fontFamily: "inherit",
                    }}>
              {React.createElement(I[t.icon], { size: 16 })}
              {t.label}
              <span className="badge-count">{t.count}</span>
            </button>
          );
        })}
      </div>

      {tab === "produtos" && <LojaProdutos navigate={navigate} isMobile={isMobile} embedded/>}
      {tab === "servicos" && <LojaServicos navigate={navigate} isMobile={isMobile} embedded/>}
    </div>
  );
};

Object.assign(window, { LojaDashboard, LojaProdutos, LojaNovoProduto, LojaServicos, LojaNovoServico, LojaCatalogo, LojaVendas, LojaEstoque });
