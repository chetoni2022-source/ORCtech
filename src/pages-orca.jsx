// ORCtech Orça pages — gestor de orçamentos com IA para prestadores de serviço

// --- Painel (Dashboard + Relatórios fundidos) ---
const ORCA_DATA = {
  hoje:  { revenue: 1560.00,  enviados: 8,  aprovados: 5,  recusados: 1,  ticket: 312.00, taxaAprov: 83, bars: ORCAS_7D.slice(-7),     barLabels: ["Qua","Qui","Sex","Sáb","Dom","Seg","Ter"], aguardando: 2 },
  "7d":  { revenue: 8470.00,  enviados: 47, aprovados: 28, recusados: 6,  ticket: 302.50, taxaAprov: 82, bars: [1100,1340,980,1820,1430,2240,1560], barLabels: ["Qua","Qui","Sex","Sáb","Dom","Seg","Ter"], aguardando: 8 },
  "30d": { revenue: 38640.00, enviados: 84, aprovados: 48, recusados: 12, ticket: 805.00, taxaAprov: 71, bars: [3,5,2,4,6,3,4,2,5,3,4,6,5,3,4,5,4,6,3,5,4,3,5,6,4,5,3,4,5,3], barLabels: ["1","","","","5","","","","","10","","","","","15","","","","","20","","","","","25","","","","","30"], aguardando: 14 },
  "90d": { revenue: 112800.00,enviados: 248,aprovados: 142,recusados: 38, ticket: 794.00, taxaAprov: 69, bars: [18,22,19,24,26,28,25,30,32,29,34,38], barLabels: ["S1","","","S4","","","S7","","","S10","",""], aguardando: 24 },
};

const OrcaDashboard = ({ navigate, isMobile }) => {
  const [range, setRange] = React.useState("hoje");
  const d = ORCA_DATA[range];
  const isHoje = range === "hoje";

  return (
    <div className="page">
      <div className="page-head">
        <div>
          {isHoje ? (
            <>
              <h1 className="t-h1">Olá, Roberto</h1>
              <p>Funilaria Schneider · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
            </>
          ) : (
            <>
              <h1 className="t-h1">Painel · {RANGE_LABELS[range]}</h1>
              <p>Funilaria Schneider · {RANGE_HINTS[range]}</p>
            </>
          )}
        </div>
        <div className="row-wrap" style={{ alignItems: "center" }}>
          <RangePicker value={range} onChange={setRange}/>
          {isHoje && <Button variant="secondary" icon={<I.Calendar size={16}/>} onClick={() => navigate("orca/agenda")}>Agenda</Button>}
          <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("orca/orcamentos/novo")}>
            Novo orçamento
          </Button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard label={isHoje ? "Faturamento hoje" : "Faturamento"} value={fmtBRL(d.revenue)} delta={isHoje ? "+18%" : "+22%"} trend="up" sparkline={d.bars.slice(-7)}/>
        <KpiCard label="Aguardando resposta" value={String(d.aguardando)} hint={isHoje ? "2 vencendo hoje" : "no pipeline"} badge={<Badge tone="warning" dot>Cobrar</Badge>}/>
        <KpiCard label="Taxa de aprovação" value={`${d.taxaAprov}%`} delta="+4 pts" trend="up" hint={RANGE_HINTS[range]}/>
        <KpiCard label="Ticket médio" value={fmtBRL(d.ticket)} delta="+8%" trend="up"/>
      </div>

      {/* Funil + Insights */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="between" style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div className="t-h3">Funil de orçamentos</div>
              <div className="t-caption t-muted" style={{ marginTop: 2 }}>{RANGE_HINTS[range]}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
            <FunnelStep label="Enviados" value={String(d.enviados)} pct={100}/>
            <FunnelStep label="Visualizados" value={String(Math.round(d.enviados * 0.85))} pct={85}/>
            <FunnelStep label="Aprovados" value={String(d.aprovados)} pct={Math.round(d.aprovados/d.enviados*100)}/>
            <FunnelStep label="Concluídos" value={String(Math.round(d.aprovados * 0.88))} pct={Math.round(d.aprovados*0.88/d.enviados*100)}/>
          </div>
          <div className="divider" style={{ margin: "20px 0 16px" }}/>
          <div className="row" style={{ gap: 24, flexWrap: "wrap" }}>
            <FactItem label="Tempo médio até resposta" value="4h 22min"/>
            <FactItem label="Tempo médio até execução" value="2 dias"/>
            <FactItem label={isHoje ? "Aprovados hoje" : "Receita acumulada"} value={isHoje ? `${d.aprovados} orçamentos` : fmtBRL(d.revenue)}/>
          </div>
        </div>

        <div className="card">
          <SectionHead title={isHoje ? "Precisam de atenção" : "Insights"} hint={isHoje ? "cobrar ou agendar" : "padrões do período"}/>
          <div className="col" style={{ gap: 10 }}>
            {isHoje ? (
              <>
                <AlertRow tone="warning" icon={<I.Clock size={16}/>}
                         title="2 orçamentos vencendo hoje"
                         body="Marta Schneider · Carla Domingos"
                         action={() => navigate("orca/orcamentos")}/>
                <AlertRow tone="warning" icon={<I.WhatsApp size={16}/>}
                         title="5 sem resposta há 48h+"
                         body="Sugira cobrar pelo WhatsApp"
                         action={() => navigate("orca/orcamentos")}/>
                <AlertRow tone="success" icon={<I.Calendar size={16}/>}
                         title="3 serviços agendados amanhã"
                         body="6h 30min de trabalho previstos"
                         action={() => navigate("orca/agenda")}/>
              </>
            ) : (
              <>
                <AlertRow tone="success" icon={<I.Trend size={16}/>}
                         title="Funilaria lidera ticket"
                         body={`Ticket médio ${fmtBRL(1340)} · 45% da receita`}/>
                <AlertRow tone="neutral" icon={<I.Sparkles size={16}/>}
                         title="WhatsApp converte 28% mais"
                         body="vs. telefone · IA sugere reforçar canal"/>
                <AlertRow tone="warning" icon={<I.Warn size={16}/>}
                         title="Recusas: preço alto (60%)"
                         body="Considere revisar tabela de mão de obra"/>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Agenda + Aguardando */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.2fr", gap: 16 }}>
        <div className="card">
          <SectionHead title={isHoje ? "Hoje na oficina" : "Por tipo de serviço"} action={isHoje ? <button className="btn btn-ghost btn-sm" onClick={() => navigate("orca/agenda")}>Ver agenda</button> : null}/>
          {isHoje ? (
            <div className="col" style={{ gap: 8 }}>
              {AGENDA_HOJE.slice(0, 4).map((a, i) => (
                <div key={i} className="row" style={{ gap: 12, padding: "10px 12px", borderRadius: 10, background: a.status === "Em andamento" ? "var(--tech-soft)" : "var(--bg-sunken)" }}>
                  <div className="num" style={{ fontWeight: 700, fontSize: 14, width: 48, color: a.status === "Em andamento" ? "var(--tech-deep)" : "var(--text)" }}>{a.time}</div>
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{a.client}</div>
                    <div className="t-caption t-muted">{a.service} · {a.duration}min</div>
                  </div>
                  <Badge tone={statusTone(a.status)} dot>{a.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="row" style={{ alignItems: "center", justifyContent: "center", margin: "12px 0 16px" }}>
              <Donut size={120} stroke={18} segments={[
                { value: 45, color: "var(--tech)" },
                { value: 28, color: "var(--text)" },
                { value: 17, color: "var(--gray-400)" },
                { value: 10, color: "var(--gray-200)" },
              ]}/>
              <div className="col" style={{ gap: 6, marginLeft: 16, flex: 1 }}>
                {[["Funilaria", 45, "var(--tech)"], ["Mecânica", 28, "var(--text)"], ["Elétrica", 17, "var(--gray-400)"], ["Outros", 10, "var(--gray-200)"]].map(([n, v, c]) => (
                  <div key={n} className="between">
                    <div className="row" style={{ gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: c }}/>
                      <span style={{ fontSize: 12 }}>{n}</span>
                    </div>
                    <span className="num" style={{ fontWeight: 600, fontSize: 12 }}>{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="between" style={{ padding: "20px 24px 12px" }}>
            <div className="t-h3">Aguardando resposta</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("orca/orcamentos")}>Ver todos</button>
          </div>
          <div>
            {ORCAMENTOS.filter(o => o.status === "Aguardando").map(o => (
              <div key={o.id} className="between" style={{ padding: "14px 24px", borderTop: "1px solid var(--border)" }}>
                <div className="row" style={{ gap: 12, minWidth: 0 }}>
                  <Avatar name={o.client}/>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.client}</div>
                    <div className="t-caption t-muted num">{o.id} · enviado {o.sent}</div>
                  </div>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <span className="num" style={{ fontWeight: 600 }}>{fmtBRL(o.total)}</span>
                  {!isMobile && <button className="btn btn-secondary btn-sm" title="Cobrar via WhatsApp"><I.WhatsApp size={14}/></button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FunnelStep = ({ label, value, pct }) => (
  <div>
    <div className="between" style={{ marginBottom: 6 }}>
      <span className="t-caption t-muted">{label}</span>
      <span className="t-caption t-muted">{pct}%</span>
    </div>
    <div className="mono" style={{ fontSize: 24, fontWeight: 600 }}>{value}</div>
    <div style={{ marginTop: 8, height: 4, borderRadius: 999, background: "var(--bg-sunken)" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "var(--tech)", borderRadius: 999, transition: "width 600ms ease" }}/>
    </div>
  </div>
);

const FactItem = ({ label, value }) => (
  <div>
    <div className="t-caption t-muted">{label}</div>
    <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{value}</div>
  </div>
);

// --- Orçamentos (lista) ---
const OrcaOrcamentos = ({ navigate, isMobile, onOpenPreview }) => {
  const [filter, setFilter] = React.useState("Todos");
  const filtered = ORCAMENTOS.filter(o => filter === "Todos" || o.status === filter);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Orçamentos</h1>
          <p>{ORCAMENTOS.length} orçamentos · 2 aguardando há mais de 24h</p>
        </div>
        <div className="row-wrap">
          <Button variant="secondary" icon={<I.Download size={16}/>}>Exportar</Button>
          <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("orca/orcamentos/novo")}>
            Novo orçamento
          </Button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap", borderBottom: "1px solid var(--border)" }}>
          {["Todos", "Aguardando", "Aprovado", "Recusado"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
                    style={{
                      padding: "6px 12px", borderRadius: 999, cursor: "pointer",
                      fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                      border: "1px solid " + (filter === f ? "var(--text)" : "var(--border)"),
                      background: filter === f ? "var(--text)" : "transparent",
                      color: filter === f ? "var(--bg)" : "var(--text-muted)",
                    }}>
              {f}
              {f !== "Todos" && <span className="mono" style={{ marginLeft: 6, opacity: 0.7 }}>{ORCAMENTOS.filter(o => o.status === f).length}</span>}
            </button>
          ))}
        </div>

        {isMobile ? (
          <div>
            {filtered.map(o => (
              <button key={o.id} onClick={() => onOpenPreview(o)}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: 14, border: 0, borderBottom: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontFamily: "inherit", color: "inherit" }}>
                <div className="between">
                  <span className="mono t-caption t-muted">{o.id}</span>
                  <Badge tone={statusTone(o.status)} dot>{o.status}</Badge>
                </div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{o.client}</div>
                <div className="t-caption t-muted" style={{ marginTop: 2 }}>{o.service}</div>
                <div className="between" style={{ marginTop: 8 }}>
                  <span className="t-caption t-muted">Enviado {o.sent}</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{fmtBRL(o.total)}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Serviço</th><th>Veículo</th><th>Canal</th><th style={{ textAlign: "right" }}>Total</th><th>Enviado</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="row-hover" style={{ cursor: "pointer" }} onClick={() => onOpenPreview(o)}>
                  <td className="mono t-muted" style={{ fontSize: 12 }}>{o.id}</td>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <Avatar name={o.client}/>
                      <span style={{ fontWeight: 600 }}>{o.client}</span>
                    </div>
                  </td>
                  <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.service}</td>
                  <td className="t-caption t-muted">{o.vehicle}</td>
                  <td><ChannelPill name={o.channel}/></td>
                  <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(o.total)}</td>
                  <td className="t-caption t-muted">{o.sent}</td>
                  <td><Badge tone={statusTone(o.status)} dot>{o.status}</Badge></td>
                  <td><button className="btn btn-secondary btn-icon btn-sm"><I.More size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Preview drawer for an orçamento
const OrcaPreview = ({ orcamento, onClose }) => {
  if (!orcamento) return null;
  const items = [
    { desc: "Mão de obra · funilaria porta TE", qty: 6, unit: 120.00 },
    { desc: "Tinta automotiva (litro)",          qty: 1, unit: 280.00 },
    { desc: "Massa plástica + lixa",              qty: 1, unit: 95.00 },
    { desc: "Verniz alta resistência",            qty: 1, unit: 145.00 },
  ];
  const subtotal = items.reduce((s, i) => s + i.qty * i.unit, 0);
  return (
    <Drawer open={!!orcamento} onClose={onClose} title={`Orçamento ${orcamento.id}`} width={460}>
      <div className="col" style={{ gap: 20 }}>
        <div>
          <div className="row" style={{ gap: 12 }}>
            <Avatar name={orcamento.client} size="lg"/>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{orcamento.client}</div>
              <div className="t-caption t-muted">{orcamento.vehicle || "Serviço sem veículo"}</div>
            </div>
          </div>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <Badge tone={statusTone(orcamento.status)} dot>{orcamento.status}</Badge>
          <Badge tone="neutral">{orcamento.channel}</Badge>
          {orcamento.validUntil !== "—" && <Badge tone="neutral">Válido até {orcamento.validUntil}</Badge>}
        </div>

        <div>
          <div className="t-caption t-faint" style={{ textTransform: "uppercase", letterSpacing: 0.06, marginBottom: 8 }}>Itens</div>
          <div className="col" style={{ gap: 10 }}>
            {items.map((it, i) => (
              <div key={i} className="between" style={{ paddingBottom: 10, borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{it.desc}</div>
                  <div className="t-caption t-muted mono">{it.qty}× {fmtBRL(it.unit)}</div>
                </div>
                <div className="mono" style={{ fontWeight: 600 }}>{fmtBRL(it.qty * it.unit)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col" style={{ gap: 6, padding: 12, background: "var(--bg-sunken)", borderRadius: 10 }}>
          <div className="between"><span className="t-muted">Subtotal</span><span className="mono">{fmtBRL(subtotal)}</span></div>
          <div className="between"><span className="t-muted">Desconto à vista (5%)</span><span className="mono" style={{ color: "var(--tech-deep)" }}>-{fmtBRL(subtotal * 0.05)}</span></div>
          <div className="divider"/>
          <div className="between"><span style={{ fontWeight: 600 }}>Total</span><span className="mono" style={{ fontWeight: 700, fontSize: 18 }}>{fmtBRL(orcamento.total)}</span></div>
        </div>

        <div className="col" style={{ gap: 8 }}>
          <Button variant="primary" fullWidth icon={<I.WhatsApp size={16}/>}>Cobrar pelo WhatsApp</Button>
          <div className="row" style={{ gap: 8 }}>
            <Button variant="secondary" fullWidth icon={<I.Copy size={14}/>}>Duplicar</Button>
            <Button variant="secondary" fullWidth icon={<I.Edit size={14}/>}>Editar</Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

// --- Novo orçamento (com IA) ---
const OrcaNovoOrcamento = ({ navigate, isMobile, onToast }) => {
  const [step, setStep] = React.useState(1);
  const [transcript, setTranscript] = React.useState("Cliente trouxe um VW Polo 2021 com a porta traseira esquerda amassada e arranhada por causa de um portão. Quer só funilaria e pintura, sem mexer no interior. Falou que precisa pra próxima semana.");
  // Cada item pode estar vinculado a um serviço do catálogo (serviceId).
  // Quando ia=true e serviceId=null, é texto solto sugerido pela IA — mostra CTA "salvar no catálogo".
  const [items, setItems] = React.useState([]);
  const [client, setClient] = React.useState("");
  const [vehicle, setVehicle] = React.useState("");
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const generate = () => {
    setStep(2);
    setTimeout(() => {
      setClient("Marta Schneider");
      setVehicle("VW Polo 2021 · placa ABC-1234");
      // IA mapeia a transcrição pra serviços do catálogo (SRV-0505 = funilaria/hora).
      // Itens sem serviceId são propostas novas — viram CTA "salvar".
      const funilaria = SERVICES.find(s => s.code === "SRV-0505");
      setItems([
        { serviceId: funilaria?.id, desc: funilaria?.name || "Mão de obra · funilaria porta TE", qty: 6, unit: funilaria?.price || 120.00, ia: true },
        { serviceId: null, desc: "Tinta automotiva (litro)", qty: 1, unit: 280.00, ia: true },
        { serviceId: null, desc: "Massa plástica + lixa",    qty: 1, unit: 95.00,  ia: true },
        { serviceId: null, desc: "Verniz alta resistência",  qty: 1, unit: 145.00, ia: true },
      ]);
      setStep(3);
    }, 1800);
  };

  const addFromCatalog = (svc) => {
    setItems([...items, { serviceId: svc.id, desc: svc.name, qty: 1, unit: svc.price, ia: false }]);
    setPickerOpen(false);
  };
  const saveItemToCatalog = (idx) => {
    setItems(items.map((it, i) => i === idx ? { ...it, serviceId: `s_new_${Date.now()}` } : it));
    onToast("Item salvo no catálogo");
  };

  const total = items.reduce((s, i) => s + i.qty * i.unit, 0);

  const send = () => {
    onToast("Orçamento enviado por WhatsApp");
    setTimeout(() => navigate("orca/orcamentos"), 600);
  };

  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("orca/orcamentos")}>
          <I.ChevLeft size={14}/> Orçamentos
        </button>
      </div>
      <h1 className="t-h1" style={{ marginBottom: 4 }}>Novo orçamento</h1>
      <p className="t-muted" style={{ marginBottom: 24 }}>Escreva (ou grave por áudio) o que o cliente pediu. A IA monta os itens.</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 16 }}>
        <div className="card">
          <div className="field" style={{ marginBottom: 16 }}>
            <label className="field-label">O que o cliente pediu</label>
            <textarea className="textarea" rows={5} value={transcript} onChange={e => setTranscript(e.target.value)}/>
            <div className="between" style={{ marginTop: 6 }}>
              <span className="field-hint">Texto livre. A IA reconhece serviços, peças e tempo de mão de obra.</span>
              <button className="btn btn-ghost btn-sm" style={{ padding: 0, height: "auto" }}>
                <I.Phone size={12}/> Gravar áudio
              </button>
            </div>
          </div>

          <Button variant="primary" icon={step === 2 ? <I.Refresh size={16} className="spin"/> : <I.Sparkles size={16}/>} onClick={generate} disabled={step === 2}>
            {step === 1 && "Montar com IA"}
            {step === 2 && "Analisando…"}
            {step === 3 && "Refazer com IA"}
          </Button>

          <div className="divider" style={{ margin: "20px 0" }}/>

          {step === 1 && (
            <div className="empty">
              <I.Wand size={28}/>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>Aguardando IA</div>
              <div className="t-caption" style={{ maxWidth: 320 }}>Descreva o que o cliente pediu. A IA preenche serviços, peças, horas e sugere preço.</div>
            </div>
          )}

          {step === 2 && (
            <div className="col" style={{ gap: 14 }}>
              <div className="row" style={{ gap: 10, padding: "12px 14px", background: "var(--tech-soft)", borderRadius: 10 }}>
                <I.Sparkles size={16} style={{ color: "var(--tech-deep)" }} className="pulse"/>
                <span className="t-body" style={{ fontWeight: 600 }}>Identificando serviços, peças e tempo de execução…</span>
              </div>
              <div className="skel" style={{ height: 14, width: "50%" }}/>
              <div className="skel" style={{ height: 14, width: "75%" }}/>
              <div className="skel" style={{ height: 14, width: "60%" }}/>
            </div>
          )}

          {step === 3 && (
            <div className="col" style={{ gap: 14 }}>
              <div className="ia-chip"><I.Sparkles size={12}/>Gerado pela IA · ajuste o que precisar</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="field-label">Cliente</label>
                  <input className="input" value={client} onChange={e => setClient(e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Veículo / objeto</label>
                  <input className="input" value={vehicle} onChange={e => setVehicle(e.target.value)}/>
                </div>
              </div>

              <div>
                <div className="between" style={{ marginBottom: 8 }}>
                  <label className="field-label">Itens</label>
                  <span className="t-caption t-faint">
                    {items.filter(i => i.serviceId).length} do catálogo · {items.filter(i => !i.serviceId).length} novos
                  </span>
                </div>
                <div className="col" style={{ gap: 8 }}>
                  {items.map((it, i) => {
                    const fromCatalog = !!it.serviceId;
                    return (
                      <div key={i} className="col" style={{ gap: 6, padding: 10, border: "1px solid " + (fromCatalog ? "var(--border)" : "var(--warning-soft)"), borderRadius: 8, background: "var(--bg-elev)" }}>
                        <div className="row" style={{ gap: 8 }}>
                          {fromCatalog
                            ? <I.Layers size={14} style={{ color: "var(--tech-deep)" }} title="Do catálogo"/>
                            : it.ia
                              ? <I.Sparkles size={14} style={{ color: "var(--tech)" }} title="Sugerido pela IA"/>
                              : <I.Edit size={14} style={{ color: "var(--text-muted)" }} title="Item livre"/>}
                          <input className="input" defaultValue={it.desc} style={{ flex: 1, height: 32, border: 0, padding: 0, background: "transparent" }}/>
                          <input className="input mono" defaultValue={it.qty} style={{ width: 50, height: 32, textAlign: "center", padding: "0 4px" }}/>
                          <span className="t-faint">×</span>
                          <input className="input mono" defaultValue={it.unit.toFixed(2)} style={{ width: 80, height: 32, textAlign: "right", padding: "0 8px" }}/>
                          <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setItems(items.filter((_, idx) => idx !== i))}>
                            <I.Trash size={14}/>
                          </button>
                        </div>
                        {!fromCatalog && (
                          <div className="between" style={{ paddingLeft: 22 }}>
                            <span className="t-caption" style={{ color: "var(--warning)" }}>
                              <I.Warn size={11} style={{ verticalAlign: "middle", marginRight: 4 }}/>
                              Item livre · não está no catálogo
                            </span>
                            <button className="btn btn-ghost btn-sm" style={{ padding: 0, height: "auto", color: "var(--tech-deep)" }} onClick={() => saveItemToCatalog(i)}>
                              <I.Plus size={12}/> Salvar no catálogo
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => setPickerOpen(true)}>
                    <I.Layers size={14}/> Adicionar do catálogo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <SectionHead title="Total"/>
            <div className="mono" style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.01 }}>{step === 3 ? fmtBRL(total) : "—"}</div>
            <div className="t-caption t-muted" style={{ marginTop: 4 }}>
              {step === 3 ? `${items.length} itens · pgto. em até 3× sem juros` : "Aguardando geração"}
            </div>
            {step === 3 && (
              <div style={{ marginTop: 14, padding: 10, background: "var(--tech-soft)", borderRadius: 8, fontSize: 12 }}>
                <strong style={{ color: "var(--tech-deep)" }}>IA sugere:</strong> baseado em {Math.floor(Math.random()*8)+4} orçamentos similares, este valor tem ~78% de chance de aprovação.
              </div>
            )}
          </div>

          <div className="card">
            <SectionHead title="Enviar via"/>
            <div className="col" style={{ gap: 10 }}>
              <div className="between"><span style={{ fontWeight: 500, fontSize: 14 }}><I.WhatsApp size={14} style={{ verticalAlign: "middle", marginRight: 6 }}/>WhatsApp</span><button className="switch on"/></div>
              <div className="between"><span style={{ fontWeight: 500, fontSize: 14 }}><I.Mail size={14} style={{ verticalAlign: "middle", marginRight: 6 }}/>E-mail</span><button className="switch"/></div>
              <div className="between"><span style={{ fontWeight: 500, fontSize: 14 }}><I.FileText size={14} style={{ verticalAlign: "middle", marginRight: 6 }}/>PDF</span><button className="switch on"/></div>
            </div>
          </div>

          <div className="col" style={{ gap: 8 }}>
            <Button variant="primary" fullWidth icon={<I.Send size={16}/>} onClick={send} disabled={step !== 3}>
              Enviar orçamento
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate("orca/orcamentos")}>Cancelar</Button>
          </div>
        </div>
      </div>

      {pickerOpen && (
        <CatalogPicker
          isMobile={isMobile}
          existingIds={items.map(i => i.serviceId).filter(Boolean)}
          onPick={addFromCatalog}
          onClose={() => setPickerOpen(false)}
          onCreate={() => { setPickerOpen(false); navigate("loja/servicos/novo"); }}
        />
      )}
    </div>
  );
};

// Catálogo picker — selector usado pelo Orça pra puxar serviços já cadastrados
const CatalogPicker = ({ isMobile, existingIds = [], onPick, onClose, onCreate }) => {
  const [q, setQ] = React.useState("");
  const filtered = SERVICES.filter(s =>
    !existingIds.includes(s.id) &&
    (s.name.toLowerCase().includes(q.toLowerCase()) || s.category.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <Modal open={true} onClose={onClose} title="Adicionar do catálogo" width={520}>
      <div className="col" style={{ gap: 12 }}>
        <div className="input-icon-wrap">
          <span className="input-icon"><I.Search size={16}/></span>
          <input className="input" autoFocus placeholder="Buscar serviço por nome ou categoria…" value={q} onChange={e => setQ(e.target.value)}/>
        </div>

        <div className="col" style={{ gap: 4, maxHeight: 360, overflow: "auto", margin: "0 -4px" }}>
          {filtered.length === 0 ? (
            <div className="empty" style={{ padding: "24px 12px" }}>
              <I.Tool size={26}/>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>Nenhum serviço no catálogo</div>
              <div className="t-caption" style={{ maxWidth: 320 }}>Cadastre um serviço novo pra reutilizar em orçamentos futuros.</div>
            </div>
          ) : filtered.map(s => (
            <button key={s.id} onClick={() => onPick(s)}
                    className="row" style={{
                      padding: 10, gap: 12, border: 0, background: "transparent",
                      borderRadius: 8, cursor: "pointer", textAlign: "left",
                      fontFamily: "inherit", color: "inherit", width: "100%",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-sunken)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--tech-deep)", flexShrink: 0 }}>
                {React.createElement(I[s.icon] || I.Tool, { size: 16 })}
              </div>
              <div className="grow" style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div className="t-caption t-muted">{s.category} · {s.duration} min</div>
              </div>
              <div className="mono" style={{ fontWeight: 600, fontSize: 14 }}>{fmtBRL(s.price)}</div>
            </button>
          ))}
        </div>

        <div className="between" style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <Button variant="ghost" icon={<I.Plus size={14}/>} onClick={onCreate}>Cadastrar novo</Button>
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  );
};

// --- Agenda ---
const OrcaAgenda = ({ navigate, isMobile }) => {
  const week = ["Seg 13", "Ter 14", "Qua 15", "Qui 16", "Sex 17", "Sáb 18", "Dom 19"];
  const [selectedDay, setSelectedDay] = React.useState(1); // Ter 14 = today

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Agenda</h1>
          <p>5 serviços hoje · próximo em 1h 30min</p>
        </div>
        <div className="row-wrap">
          <Button variant="secondary" icon={<I.Calendar size={16}/>}>Mês</Button>
          <Button variant="primary" icon={<I.Plus size={16}/>}>Agendar</Button>
        </div>
      </div>

      {/* Week strip */}
      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <div className="between" style={{ marginBottom: 12 }}>
          <div className="row"><button className="btn btn-secondary btn-icon btn-sm"><I.ChevLeft size={14}/></button>
            <span style={{ fontWeight: 600, marginLeft: 8, marginRight: 8 }}>Maio 2026</span>
          <button className="btn btn-secondary btn-icon btn-sm"><I.ChevRight size={14}/></button></div>
          <button className="btn btn-ghost btn-sm">Hoje</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {week.map((d, i) => {
            const [day, num] = d.split(" ");
            const sel = i === selectedDay;
            return (
              <button key={d} onClick={() => setSelectedDay(i)}
                      style={{
                        padding: "10px 6px", borderRadius: 10, border: 0, cursor: "pointer",
                        background: sel ? "var(--tech)" : "var(--bg-sunken)",
                        color: sel ? "#fff" : "var(--text)",
                        fontFamily: "inherit",
                      }}>
                <div className="t-caption" style={{ opacity: 0.7 }}>{day}</div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{num}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day schedule */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: "20px 24px 12px" }}>
          <div className="t-h3">Terça-feira, 14 de maio</div>
          <div className="t-caption t-muted" style={{ marginTop: 2 }}>{AGENDA_HOJE.length} agendamentos · 7h 15min de trabalho</div>
        </div>
        <div>
          {AGENDA_HOJE.map((a, i) => {
            const tone = a.status === "Em andamento" ? "tech-soft" : "bg-elev";
            return (
              <div key={i} className="row" style={{ padding: "16px 24px", gap: 20, borderTop: "1px solid var(--border)", alignItems: "flex-start" }}>
                <div style={{ width: 64, flexShrink: 0 }}>
                  <div className="mono" style={{ fontWeight: 700, fontSize: 16 }}>{a.time}</div>
                  <div className="t-caption t-faint">{a.duration}min</div>
                </div>
                <div className="grow" style={{ minWidth: 0, padding: "10px 14px", borderRadius: 10, background: `var(--${tone})`, borderLeft: `3px solid ${a.status === "Em andamento" ? "var(--tech)" : "var(--border-strong)"}` }}>
                  <div className="between">
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{a.client}</div>
                      <div className="t-caption t-muted">{a.service}</div>
                    </div>
                    <Badge tone={statusTone(a.status)} dot>{a.status}</Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { OrcaDashboard, OrcaOrcamentos, OrcaPreview, OrcaNovoOrcamento, OrcaAgenda });
