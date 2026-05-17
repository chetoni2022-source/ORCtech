// Cross-cutting features added in the "improvements" pass:
// CommandPalette (Cmd+K), AIAssistant (floating), MobileFAB, EmptyState,
// ConfirmDialog, MobileModuleSwitcher, CustomerDetail.

// ── Command Palette (Cmd+K / Ctrl+K) ───────────────────────────────────
const PAGES_INDEX = [
  { label: "Painel · Loja",    icon: "Home",     route: "loja/dashboard",  group: "Páginas" },
  { label: "Produtos",         icon: "Box",      route: "loja/produtos",   group: "Páginas" },
  { label: "Vendas",           icon: "Cart",     route: "loja/vendas",     group: "Páginas" },
  { label: "Estoque",          icon: "Pkg",      route: "loja/estoque",    group: "Páginas" },
  { label: "Painel · Orça",    icon: "Home",     route: "orca/dashboard",  group: "Páginas" },
  { label: "Orçamentos",       icon: "FileText", route: "orca/orcamentos", group: "Páginas" },
  { label: "Agenda",           icon: "Calendar", route: "orca/agenda",     group: "Páginas" },
  { label: "Clientes",         icon: "Users",    route: "clientes",        group: "Páginas" },
  { label: "Análises",         icon: "Chart",    route: "analises",        group: "Páginas" },
  { label: "Configurações",    icon: "Settings", route: "configuracoes",   group: "Páginas" },
];

const QUICK_ACTIONS = [
  { label: "Cadastrar produto com IA", icon: "Sparkles", route: "loja/produtos/novo", group: "Ações rápidas", hint: "⌘N" },
  { label: "Nova venda manual",         icon: "Cart",     route: "loja/vendas/novo",    group: "Ações rápidas" },
  { label: "Novo orçamento com IA",     icon: "FileText", route: "orca/orcamentos/novo", group: "Ações rápidas" },
  { label: "Cadastrar cliente",         icon: "User",     route: "clientes/novo",       group: "Ações rápidas" },
];

const CommandPalette = ({ open, onClose, navigate }) => {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setQ(""); setSel(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const query = q.toLowerCase().trim();
  // Build searchable result list
  const all = [];
  // pages + actions
  [...QUICK_ACTIONS, ...PAGES_INDEX].forEach(it => all.push({ ...it, type: "page" }));
  // products
  PRODUCTS.forEach(p => all.push({
    label: p.name, sub: `${p.sku} · ${fmtBRL(p.price)} · ${p.stock} em estoque`,
    emoji: p.image, group: "Produtos", type: "product", route: "loja/produtos",
  }));
  // customers
  CUSTOMERS.forEach(c => all.push({
    label: c.name, sub: `${c.email} · ${c.orders} pedidos · ${fmtBRL(c.total)}`,
    avatar: c.name, group: "Clientes", type: "customer", route: `clientes/${c.id}`,
  }));
  // orçamentos
  ORCAMENTOS.forEach(o => all.push({
    label: `${o.client} · ${fmtBRL(o.total)}`, sub: `${o.id} · ${o.service}`,
    icon: "FileText", group: "Orçamentos", type: "orcamento", route: "orca/orcamentos",
  }));

  const filtered = query
    ? all.filter(it => (it.label + " " + (it.sub || "")).toLowerCase().includes(query))
    : [...QUICK_ACTIONS.map(it => ({ ...it, type: "page" })), ...PAGES_INDEX.map(it => ({ ...it, type: "page" }))];

  // Group results
  const grouped = filtered.reduce((acc, it) => {
    (acc[it.group] = acc[it.group] || []).push(it);
    return acc;
  }, {});
  const flat = Object.entries(grouped).flatMap(([g, items]) => items);

  const choose = (it) => {
    if (it.route) navigate(it.route);
    onClose();
  };

  const onKey = (e) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, flat.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); return; }
    if (e.key === "Enter") { e.preventDefault(); flat[sel] && choose(flat[sel]); return; }
  };

  return (
    <div onClick={onClose}
         style={{
           position: "absolute", inset: 0, zIndex: 100,
           background: "rgba(10,10,10,0.55)",
           display: "flex", alignItems: "flex-start", justifyContent: "center",
           paddingTop: 80, padding: "80px 16px 16px",
         }}>
      <div onClick={e => e.stopPropagation()}
           style={{
             width: 580, maxWidth: "100%",
             background: "var(--bg-elev)", borderRadius: 14,
             boxShadow: "var(--shadow-pop)", border: "1px solid var(--border)",
             overflow: "hidden", display: "flex", flexDirection: "column",
             maxHeight: "min(560px, calc(100% - 16px))",
           }}>
        {/* Search input */}
        <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
          <I.Search size={18} style={{ color: "var(--text-faint)", flexShrink: 0 }}/>
          <input ref={inputRef}
                 value={q} onChange={e => { setQ(e.target.value); setSel(0); }}
                 onKeyDown={onKey}
                 placeholder="Buscar produtos, clientes, orçamentos, ações…"
                 style={{
                   border: 0, outline: 0, background: "transparent",
                   color: "var(--text)", fontFamily: "inherit",
                   fontSize: 15, width: "100%",
                 }}/>
          <span className="t-caption t-faint" style={{ flexShrink: 0, padding: "3px 8px", borderRadius: 6, background: "var(--bg-sunken)", border: "1px solid var(--border)" }}>ESC</span>
        </div>

        {/* Results */}
        <div style={{ overflowY: "auto", maxHeight: 440 }}>
          {flat.length === 0 ? (
            <div className="empty" style={{ padding: "40px 20px" }}>
              <I.Search size={24}/>
              <div style={{ fontWeight: 600, color: "var(--text)" }}>Nada encontrado</div>
              <div className="t-caption">Tente outro termo</div>
            </div>
          ) : (
            Object.entries(grouped).map(([g, items]) => (
              <div key={g}>
                <div className="t-overline" style={{ padding: "12px 18px 6px" }}>{g}</div>
                {items.map((it, _i) => {
                  const globalIdx = flat.indexOf(it);
                  const active = globalIdx === sel;
                  return (
                    <button key={it.label + globalIdx}
                            onClick={() => choose(it)}
                            onMouseEnter={() => setSel(globalIdx)}
                            style={{
                              width: "100%", display: "flex", alignItems: "center", gap: 12,
                              padding: "10px 18px", border: 0, cursor: "pointer",
                              background: active ? "var(--bg-sunken)" : "transparent",
                              color: "inherit", textAlign: "left", fontFamily: "inherit",
                              borderLeft: active ? "2px solid var(--tech)" : "2px solid transparent",
                            }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: 7, display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                        background: "var(--bg-sunken)", color: "var(--text-muted)",
                        fontSize: 14,
                      }}>
                        {it.emoji ? <span style={{ fontSize: 16 }}>{it.emoji}</span> :
                         it.avatar ? <Avatar name={it.avatar}/> :
                         it.icon ? React.createElement(I[it.icon] || I.Box, { size: 16 }) :
                         <I.Box size={16}/>}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</div>
                        {it.sub && <div className="t-caption t-muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.sub}</div>}
                      </div>
                      {it.hint && <span className="t-caption t-faint" style={{ flexShrink: 0 }}>{it.hint}</span>}
                      {active && <I.ChevRight size={14} style={{ color: "var(--text-faint)", flexShrink: 0 }}/>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="row" style={{ padding: "10px 18px", borderTop: "1px solid var(--border)", gap: 16, fontSize: 11, color: "var(--text-faint)", background: "var(--bg-sunken)" }}>
          <span><kbd style={kbdStyle}>↑↓</kbd> Navegar</span>
          <span><kbd style={kbdStyle}>↵</kbd> Abrir</span>
          <span><kbd style={kbdStyle}>esc</kbd> Fechar</span>
        </div>
      </div>
    </div>
  );
};

const kbdStyle = {
  padding: "1px 6px", borderRadius: 4, background: "var(--bg-elev)",
  border: "1px solid var(--border)", fontSize: 10, marginRight: 4,
  fontFamily: "Inter, sans-serif", fontWeight: 600, color: "var(--text-muted)",
};

// ── AI Assistant (floating + drawer) ───────────────────────────────────
const AI_SUGGESTIONS = [
  { q: "Quanto vendi hoje?", a: "Hoje você teve 18 pedidos, totalizando R$ 3.420,00. Crescimento de 12% vs. ontem. Shopee liderou com 8 pedidos." },
  { q: "Quais produtos sem foto ou descrição?", a: "Encontrei 4 produtos com cadastro incompleto: 2 sem foto e 2 com descrição menor que 50 caracteres. Quer que eu gere as descrições automaticamente?" },
  { q: "Cobra os orçamentos parados", a: "Achei 5 orçamentos sem resposta há mais de 48h. Posso enviar mensagem amigável pelo WhatsApp para todos eles. Confirma?" },
  { q: "Qual produto tem maior margem?", a: "Anel falange folheado lidera com 71% de margem. Brincos argola (68%) e Colar gargantilha (64%) completam o pódio." },
  { q: "Quando é meu horário de pico?", a: "Sexta-feira às 17h. Você vende 38% mais nesse horário. Considere postar conteúdo de divulgação na quinta à noite." },
];

const AIAssistant = ({ open, onClose, navigate }) => {
  const [messages, setMessages] = React.useState([
    { from: "ai", text: "Olá Marina! Sou a IA do ORCtech. Posso responder sobre seu negócio, gerar conteúdo ou agir nas tarefas chatas. O que precisa?" },
  ]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const ask = (q) => {
    setMessages(prev => [...prev, { from: "user", text: q }]);
    setInput("");
    setThinking(true);
    const match = AI_SUGGESTIONS.find(s => s.q === q);
    const reply = match?.a || "Beleza, deixa comigo. Vou processar isso e te aviso assim que terminar.";
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "ai", text: reply }]);
      setThinking(false);
    }, 1100);
  };

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 90,
      background: "rgba(10,10,10,0.4)",
    }}>
      <div onClick={e => e.stopPropagation()}
           style={{
             position: "absolute", right: 0, top: 0, bottom: 0, width: 420, maxWidth: "100%",
             background: "var(--bg-elev)", borderLeft: "1px solid var(--border)",
             display: "flex", flexDirection: "column",
             boxShadow: "var(--shadow-pop)",
             animation: "slideright 220ms ease",
           }}>
        {/* Header */}
        <div className="between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div className="row" style={{ gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--tech)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <I.Sparkles size={18}/>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Assistente IA</div>
              <div className="t-caption" style={{ color: "var(--tech-deep)", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--tech)" }}/>
                Online
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}><I.X size={16}/></button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <div className="col" style={{ gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "82%", padding: "10px 14px",
                  borderRadius: m.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.from === "user" ? "var(--tech)" : "var(--bg-sunken)",
                  color: m.from === "user" ? "#fff" : "var(--text)",
                  fontSize: 14, lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
                  background: "var(--bg-sunken)",
                  display: "flex", gap: 4,
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: 999,
                      background: "var(--text-faint)",
                      animation: `pulse 1.2s ease-in-out infinite ${i * 0.2}s`,
                    }}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 1 && !thinking && (
            <div style={{ marginTop: 20 }}>
              <div className="t-overline" style={{ marginBottom: 10 }}>Sugestões</div>
              <div className="col" style={{ gap: 8 }}>
                {AI_SUGGESTIONS.slice(0, 4).map(s => (
                  <button key={s.q} onClick={() => ask(s.q)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                            border: "1px solid var(--border)", borderRadius: 10,
                            background: "transparent", cursor: "pointer",
                            color: "var(--text)", textAlign: "left", fontFamily: "inherit",
                            fontSize: 13, fontWeight: 500,
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--bg-sunken)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <I.Sparkles size={14} style={{ color: "var(--tech)", flexShrink: 0 }}/>
                    {s.q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
          <form onSubmit={e => { e.preventDefault(); input.trim() && ask(input); }}
                style={{ display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
                   placeholder="Pergunte qualquer coisa…"
                   className="input"
                   style={{ flex: 1 }}/>
            <Button variant="primary" type="submit" icon={<I.Send size={14}/>} disabled={!input.trim()}/>
          </form>
        </div>
      </div>
    </div>
  );
};

// AI launcher — floating circle button bottom-right
const AILauncher = ({ onClick, hidden, bottom = 24 }) => {
  if (hidden) return null;
  return (
    <button onClick={onClick}
            title="Assistente IA (J)"
            style={{
              position: "absolute", right: 20, bottom,
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--tech)", color: "#fff",
              border: 0, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px -4px rgba(0,196,106,0.4), 0 4px 12px -2px rgba(0,0,0,0.15)",
              zIndex: 50,
              transition: "transform 120ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      <I.Sparkles size={22}/>
    </button>
  );
};

// ── Mobile FAB — page-specific primary action ───────────────────────────
const MobileFAB = ({ icon, onClick, label, bottom = 80 }) => (
  <button onClick={onClick} aria-label={label}
          style={{
            position: "absolute", right: 16, bottom,
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--tech)", color: "#fff",
            border: 0, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 24px -6px rgba(0,196,106,0.5), 0 4px 12px -2px rgba(0,0,0,0.2)",
            zIndex: 40,
          }}>
    {icon}
  </button>
);

// ── EmptyState — generic, used in lists ────────────────────────────────
const EmptyState = ({ icon, title, body, action }) => (
  <div style={{
    padding: "48px 24px", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
  }}>
    <div style={{
      width: 56, height: 56, borderRadius: 14,
      background: "var(--bg-sunken)", color: "var(--text-faint)",
      display: "flex", alignItems: "center", justifyContent: "center",
      marginBottom: 4,
    }}>
      {icon}
    </div>
    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{title}</div>
    <div className="t-body t-muted" style={{ maxWidth: 360, lineHeight: 1.5 }}>{body}</div>
    {action && <div style={{ marginTop: 8 }}>{action}</div>}
  </div>
);

// ── ConfirmDialog — reusable destructive confirm ────────────────────────
const ConfirmDialog = ({ open, onClose, onConfirm, title, body, confirmLabel = "Confirmar", danger = false }) => (
  <Modal open={open} onClose={onClose} title={title} width={440}
         footer={
           <>
             <Button variant="secondary" onClick={onClose}>Cancelar</Button>
             <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
           </>
         }>
    <p className="t-body t-muted" style={{ margin: 0, lineHeight: 1.55 }}>{body}</p>
  </Modal>
);

// ── Customer Detail page ───────────────────────────────────────────────
const CustomerDetail = ({ navigate, isMobile, customerId, module }) => {
  const c = CUSTOMERS.find(x => x.id === customerId) || CUSTOMERS[0];
  const cColor = avatarColor(c.name);

  // Synthetic order history
  const history = [
    { id: "v_8821", date: "Hoje 14:32",  channel: "Shopee", product: "Brinco argola lisa pequena", total: 34.90,  status: "Pago" },
    { id: "v_8794", date: "11 mai",      channel: "Loja",   product: "Vestido midi linho terracota", total: 189.90, status: "Pago" },
    { id: "v_8721", date: "28 abr",      channel: "ML",     product: "Bolsa saco couro cognac", total: 219.90, status: "Pago" },
    { id: "v_8688", date: "10 abr",      channel: "Shopee", product: "Brinco argola lisa pequena", total: 34.90,  status: "Pago" },
    { id: "v_8602", date: "22 mar",      channel: "Loja",   product: "Saia midi plissada preta", total: 149.90, status: "Pago" },
    { id: "v_8514", date: "18 mar",      channel: "TikTok", product: "Anel falange folheado",     total: 49.90,  status: "Pago" },
    { id: "v_8489", date: "02 mar",      channel: "Shopee", product: "Colar gargantilha pingente", total: 89.90,  status: "Pago" },
  ];

  return (
    <div className="page">
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("clientes")}>
          <I.ChevLeft size={14}/> Clientes
        </button>
      </div>

      {/* Header */}
      <div className="card" style={{ marginBottom: 16, padding: isMobile ? 20 : 28 }}>
        <div className="row-wrap" style={{ gap: 20, alignItems: "flex-start" }}>
          <div style={{
            width: isMobile ? 64 : 80, height: isMobile ? 64 : 80, borderRadius: "50%",
            background: cColor.bg, color: cColor.fg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: isMobile ? 24 : 30, flexShrink: 0,
          }}>
            {c.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
          </div>
          <div className="grow" style={{ minWidth: 0 }}>
            <div className="row-wrap" style={{ gap: 10, marginBottom: 4, alignItems: "center" }}>
              <h1 className="t-h1" style={{ margin: 0 }}>{c.name}</h1>
              {c.tag && <Badge tone={c.tag === "VIP" ? "success" : "neutral"}>{c.tag}</Badge>}
            </div>
            <div className="row-wrap" style={{ gap: 16, color: "var(--text-muted)", fontSize: 13 }}>
              <span className="row" style={{ gap: 4 }}><I.Mail size={13}/> {c.email}</span>
              <span className="row" style={{ gap: 4 }}><I.Phone size={13}/> {c.phone}</span>
              <span className="row" style={{ gap: 4 }}><I.Building size={13}/> {c.city}</span>
            </div>
          </div>
          <div className="row-wrap" style={{ gap: 8 }}>
            <Button variant="secondary" icon={<I.WhatsApp size={14}/>}>WhatsApp</Button>
            <Button variant="secondary" icon={<I.Edit size={14}/>}>Editar</Button>
            {module === "loja"
              ? <Button variant="primary" icon={<I.Plus size={14}/>} onClick={() => navigate("loja/vendas/novo")}>Nova venda</Button>
              : <Button variant="primary" icon={<I.Plus size={14}/>} onClick={() => navigate("orca/orcamentos/novo")}>Novo orçamento</Button>}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard label="Total gasto" value={fmtBRL(c.total)} hint={`em ${c.orders} pedidos`}/>
        <KpiCard label="Ticket médio" value={fmtBRL(c.total / Math.max(c.orders, 1))} hint="por compra"/>
        <KpiCard label="Última compra" value={c.lastOrder} hint="dia"/>
        <KpiCard label="Cliente desde" value="Mar/24" hint="há 14 meses"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16 }}>
        {/* Histórico */}
        <div className="card" style={{ padding: 0 }}>
          <div className="between" style={{ padding: isMobile ? "16px 16px 12px" : "20px 24px 14px" }}>
            <div>
              <div className="t-h3">Histórico de compras</div>
              <div className="t-caption t-muted" style={{ marginTop: 2 }}>{history.length} pedidos · ordenados do mais recente</div>
            </div>
          </div>
          {isMobile ? (
            <div>
              {history.map(h => (
                <div key={h.id} style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                  <div className="between">
                    <div className="row" style={{ gap: 8, minWidth: 0 }}>
                      <ChannelPill name={h.channel}/>
                      <span className="t-caption t-muted">{h.date}</span>
                    </div>
                    <Badge tone="success" dot>{h.status}</Badge>
                  </div>
                  <div style={{ fontWeight: 500, marginTop: 6, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.product}</div>
                  <div className="between" style={{ marginTop: 4 }}>
                    <span className="num t-caption t-muted">{h.id}</span>
                    <span className="num" style={{ fontWeight: 600 }}>{fmtBRL(h.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr><th>Data</th><th>ID</th><th>Canal</th><th>Produto</th><th className="num" style={{ textAlign: "right" }}>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id} className="row-hover">
                      <td className="t-muted" style={{ fontSize: 13 }}>{h.date}</td>
                      <td className="num t-muted" style={{ fontSize: 12 }}>{h.id}</td>
                      <td><ChannelPill name={h.channel}/></td>
                      <td>{h.product}</td>
                      <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(h.total)}</td>
                      <td><Badge tone="success" dot>{h.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <SectionHead title="Preferências"/>
            <div className="col" style={{ gap: 10 }}>
              <PrefRow label="Canal preferido" value="Shopee" hint="4 de 7 compras"/>
              <PrefRow label="Categoria favorita" value="Semi-jóias" hint="3 de 7 compras"/>
              <PrefRow label="Faixa de preço" value="R$ 35–90" hint="média histórica"/>
            </div>
          </div>
          <div className="card">
            <SectionHead title="Notas internas"/>
            <textarea className="textarea" rows={4}
                      placeholder="Cliente preferiu retirar na loja na última vez. Pediu lembrete para o aniversário em julho."
                      defaultValue="Cliente preferiu retirar na loja na última vez. Pediu lembrete para o aniversário em julho."/>
            <Button variant="secondary" size="sm" style={{ marginTop: 10 }}>Salvar nota</Button>
          </div>
          <div className="card" style={{ background: "var(--tech-soft)", borderColor: "transparent" }}>
            <div className="row" style={{ gap: 8, marginBottom: 8 }}>
              <I.Sparkles size={16} style={{ color: "var(--tech-deep)" }}/>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--tech-deep)" }}>Sugestão da IA</div>
            </div>
            <p className="t-body" style={{ margin: 0, color: "var(--text)" }}>
              Compra a cada ~3 semanas e está há 4 dias sem comprar. Bom momento para mandar um cupom de 10% pelo WhatsApp.
            </p>
            <Button variant="primary" size="sm" fullWidth icon={<I.WhatsApp size={14}/>} style={{ marginTop: 12 }}>
              Enviar cupom
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrefRow = ({ label, value, hint }) => (
  <div className="between">
    <span className="t-caption t-muted">{label}</span>
    <div style={{ textAlign: "right" }}>
      <div style={{ fontWeight: 600, fontSize: 13 }}>{value}</div>
      <div className="t-caption t-faint">{hint}</div>
    </div>
  </div>
);

// ── Mobile module switcher (replaces logo in mobile topbar) ────────────
const MobileModuleSwitcher = ({ module, setModule, navigate, plan = "combo" }) => {
  const [open, setOpen] = React.useState(false);
  const opts = [
    { k: "loja", label: "Loja", hint: "Varejo" },
    { k: "orca", label: "Orça", hint: "Serviços" },
  ];
  const isAvailable = (k) => plan === "combo" || plan === k;
  const choose = (k) => {
    if (!isAvailable(k)) { setModule(k); navigate(`${k}/dashboard`); setOpen(false); return; }
    setModule(k); navigate(`${k}/dashboard`); setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 10px 6px 4px", borderRadius: 8,
                border: 0, background: "transparent", cursor: "pointer",
                fontFamily: "inherit", color: "inherit",
              }}>
        <Logo size={16}/>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: "2px 7px",
          background: "var(--bg-sunken)", color: "var(--text-muted)",
          borderRadius: 6, textTransform: "uppercase", letterSpacing: 0.04,
        }}>{module === "orca" ? "Orça" : "Loja"}</span>
        <I.ChevDown size={14} style={{ color: "var(--text-faint)" }}/>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 30 }}/>
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            minWidth: 200, background: "var(--bg-elev)",
            border: "1px solid var(--border)", borderRadius: 10,
            boxShadow: "var(--shadow-pop)", padding: 6, zIndex: 40,
          }}>
            {opts.map(o => {
              const locked = !isAvailable(o.k);
              const on = module === o.k;
              return (
                <button key={o.k} onClick={() => choose(o.k)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 10,
                          padding: "10px 12px", border: 0, cursor: "pointer",
                          background: on ? "var(--tech-soft)" : "transparent",
                          color: "inherit", borderRadius: 7, textAlign: "left",
                          fontFamily: "inherit",
                        }}>
                  <Logo size={13}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {o.label}{locked && <I.Lock size={11} style={{ verticalAlign: "middle", marginLeft: 6, opacity: 0.6 }}/>}
                    </div>
                    <div className="t-caption t-muted">{o.hint}</div>
                  </div>
                  {on && <I.Check size={14} style={{ color: "var(--tech)" }}/>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

Object.assign(window, {
  CommandPalette, AIAssistant, AILauncher, MobileFAB, EmptyState, ConfirmDialog,
  CustomerDetail, MobileModuleSwitcher, avatarColor,
});
