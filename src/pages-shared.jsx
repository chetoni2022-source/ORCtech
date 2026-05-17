// Shared pages — Clientes, Relatórios, Configurações, Notifications panel

// --- Clientes ---
const Clientes = ({ navigate, isMobile, module }) => {
  const list = module === "orca"
    ? ORCAMENTOS.reduce((acc, o) => {
        const ex = acc.find(c => c.name === o.client);
        if (ex) { ex.orders++; ex.total += o.total; }
        else acc.push({ id: o.client, name: o.client, email: o.client.toLowerCase().replace(/[^a-z]/g, ".") + "@email.com", phone: "—", city: "Curitiba, PR", orders: 1, total: o.total, lastOrder: o.sent, tag: o.status === "Aprovado" ? "Recorrente" : "" });
        return acc;
      }, [])
    : CUSTOMERS;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Clientes</h1>
          <p>{list.length} clientes · {list.filter(c => c.tag === "VIP" || c.tag === "Recorrente").length} recorrentes</p>
        </div>
        <div className="row-wrap">
          <Button variant="secondary" icon={<I.Download size={16}/>}>Exportar</Button>
          <Button variant="primary" icon={<I.Plus size={16}/>} onClick={() => navigate("clientes/novo")}>Novo cliente</Button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard label="Total" value={String(list.length)} hint="cadastrados"/>
        <KpiCard label="Recorrentes" value={String(list.filter(c => c.tag === "Recorrente" || c.tag === "VIP").length)} delta="+3" trend="up"/>
        <KpiCard label="Ticket médio" value={fmtBRL(list.reduce((s, c) => s + (c.total || 0), 0) / list.length || 0)}/>
        <KpiCard label="Novos no mês" value={String(list.filter(c => c.tag === "Novo").length || 4)} delta="+2" trend="up"/>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
          <div className="input-icon-wrap" style={{ maxWidth: 360 }}>
            <span className="input-icon"><I.Search size={16}/></span>
            <input className="input" placeholder="Buscar por nome, e-mail ou telefone…"/>
          </div>
        </div>

        {isMobile ? (
          <div>
            {list.map(c => (
              <button key={c.id} onClick={() => navigate(`clientes/${c.id}`)}
                      style={{ display: "flex", width: "100%", gap: 12, padding: 14, border: 0, background: "transparent", color: "inherit", borderBottom: "1px solid var(--border)", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                <Avatar name={c.name} size="lg"/>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="between">
                    <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                    {c.tag && <Badge tone={c.tag === "VIP" ? "success" : c.tag === "Novo" ? "neutral" : "neutral"}>{c.tag}</Badge>}
                  </div>
                  <div className="t-caption t-muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.email}</div>
                  <div className="between" style={{ marginTop: 4 }}>
                    <span className="t-caption t-muted">{c.orders} pedidos</span>
                    <span className="num t-caption" style={{ fontWeight: 600 }}>{fmtBRL(c.total)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <table className="tbl">
            <thead>
              <tr><th>Cliente</th><th>Contato</th><th>Cidade</th><th className="num" style={{ textAlign: "right" }}>Pedidos</th><th className="num" style={{ textAlign: "right" }}>Total gasto</th><th>Último</th><th>Tag</th></tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id} className="row-hover" style={{ cursor: "pointer" }} onClick={() => navigate(`clientes/${c.id}`)}>
                  <td>
                    <div className="row" style={{ gap: 12 }}>
                      <Avatar name={c.name}/>
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{c.email}</div>
                    <div className="t-caption t-muted num">{c.phone}</div>
                  </td>
                  <td className="t-muted">{c.city}</td>
                  <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{c.orders}</td>
                  <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(c.total)}</td>
                  <td className="t-muted">{c.lastOrder}</td>
                  <td>{c.tag ? <Badge tone={c.tag === "VIP" ? "success" : "neutral"}>{c.tag}</Badge> : <span className="t-faint">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- Relatórios ---
const Relatorios = ({ navigate, isMobile, module }) => {
  const isLoja = module === "loja";
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="t-h1">Relatórios</h1>
          <p>Últimos 30 dias · atualizado às 14:32</p>
        </div>
        <div className="row-wrap">
          <Button variant="secondary" icon={<I.Calendar size={16}/>}>14 abr – 14 mai</Button>
          <Button variant="secondary" icon={<I.Download size={16}/>}>Baixar PDF</Button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard label="Receita líquida" value="R$ 84.320,00" delta="+18%" trend="up" sparkline={[5200,4800,6100,5400,7200,6900,8200]}/>
        <KpiCard label={isLoja ? "Pedidos" : "Orçamentos aprovados"} value={isLoja ? "412" : "94"} delta="+12%" trend="up"/>
        <KpiCard label="Ticket médio" value={isLoja ? "R$ 204,66" : "R$ 897,02"} delta="+5%" trend="up"/>
        <KpiCard label={isLoja ? "Margem" : "Taxa de aprovação"} value={isLoja ? "57%" : "71%"} delta={isLoja ? "+2 pts" : "+4 pts"} trend="up"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="between" style={{ marginBottom: 16 }}>
            <div className="t-h3">{isLoja ? "Receita por dia" : "Orçamentos aprovados por dia"}</div>
            <div className="row" style={{ gap: 4 }}>
              <Pill>7d</Pill><Pill on>30d</Pill><Pill>90d</Pill>
            </div>
          </div>
          <MiniBars values={[3200, 2800, 3600, 3100, 4200, 3800, 4500, 3900, 4100, 3700, 4400, 4800, 5200, 4900, 5100, 4700, 5300, 5800, 6200, 5900, 6400, 6100, 6800, 7100, 6700, 7200, 7400, 7900, 7600, 8200]}
                    height={180} labels={["1","","","","5","","","","","10","","","","","15","","","","","20","","","","","25","","","","","30"]}/>
        </div>

        <div className="card">
          <SectionHead title={isLoja ? "Por canal" : "Por tipo de serviço"}/>
          <div className="row" style={{ alignItems: "center", justifyContent: "center", margin: "12px 0 20px" }}>
            <Donut size={140} stroke={20} segments={isLoja ? [
              { value: 42, color: "var(--tech)" },
              { value: 29, color: "var(--text)" },
              { value: 20, color: "var(--gray-400)" },
              { value: 9, color: "var(--gray-200)" },
            ] : [
              { value: 45, color: "var(--tech)" },
              { value: 28, color: "var(--text)" },
              { value: 17, color: "var(--gray-400)" },
              { value: 10, color: "var(--gray-200)" },
            ]}/>
          </div>
          <div className="col" style={{ gap: 8 }}>
            {(isLoja
              ? [["Shopee", 42, "var(--tech)"], ["Mercado Livre", 29, "var(--text)"], ["Loja física", 20, "var(--gray-400)"], ["TikTok Shop", 9, "var(--gray-200)"]]
              : [["Funilaria", 45, "var(--tech)"], ["Mecânica", 28, "var(--text)"], ["Elétrica", 17, "var(--gray-400)"], ["Outros", 10, "var(--gray-200)"]]
            ).map(([n, v, c]) => (
              <div key={n} className="between">
                <div className="row" style={{ gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c }}/>
                  <span style={{ fontSize: 13 }}>{n}</span>
                </div>
                <span className="mono" style={{ fontWeight: 600 }}>{v}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <SectionHead title="Top performers · 30d" action={<button className="btn btn-ghost btn-sm">Ver todos</button>}/>
        {isMobile ? (
          <div className="col" style={{ gap: 12, marginTop: 4 }}>
            {(isLoja ? [...PRODUCTS].sort((a, b) => b.sold30d - a.sold30d).slice(0, 5) : ORCAMENTOS.slice(0, 5).map((o) => ({ id: o.id, name: o.service, sold30d: Math.floor(Math.random() * 14) + 6, price: o.total, margin: Math.floor(Math.random() * 25) + 45 }))).map((p, i) => (
              <div key={p.id} className="row" style={{ gap: 12, paddingBottom: 12, borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <div className="mono t-muted" style={{ width: 20 }}>{i + 1}</div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div className="t-caption t-muted">
                    <span className="mono">{p.sold30d} vendas</span> ·
                    <span className="mono" style={{ color: "var(--tech-deep)", fontWeight: 600, marginLeft: 4 }}>{p.margin}% margem</span>
                  </div>
                </div>
                <div className="mono" style={{ fontWeight: 600, fontSize: 14, textAlign: "right" }}>{fmtBRL(p.price * p.sold30d)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr><th>#</th><th>{isLoja ? "Produto" : "Serviço"}</th><th style={{ textAlign: "right" }}>Vendas</th><th style={{ textAlign: "right" }}>Receita</th><th style={{ textAlign: "right" }}>Margem</th></tr>
              </thead>
              <tbody>
                {(isLoja ? [...PRODUCTS].sort((a, b) => b.sold30d - a.sold30d).slice(0, 5) : ORCAMENTOS.slice(0, 5).map((o, i) => ({ id: o.id, name: o.service, sold30d: Math.floor(Math.random() * 14) + 6, price: o.total, margin: Math.floor(Math.random() * 25) + 45 }))).map((p, i) => (
                  <tr key={p.id} className="row-hover">
                    <td className="mono t-muted">{i + 1}</td>
                    <td><div style={{ fontWeight: 600 }}>{p.name}</div></td>
                    <td className="num" style={{ textAlign: "right" }}>{p.sold30d}</td>
                    <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{fmtBRL(p.price * p.sold30d)}</td>
                    <td className="num" style={{ textAlign: "right", color: "var(--tech-deep)", fontWeight: 600 }}>{p.margin}%</td>
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

// --- Configurações ---
const Configuracoes = ({ navigate, isMobile, theme, setTheme, density, setDensity, segment = "varejo", setSegment, onLogout }) => {
  const [section, setSection] = React.useState("perfil");
  const sections = [
    { k: "perfil",       label: "Perfil",          icon: "User" },
    { k: "empresa",      label: "Empresa",         icon: "Building" },
    { k: "segmento",     label: "Segmento",        icon: "Briefcase" },
    { k: "aparencia",    label: "Aparência",       icon: "Sliders" },
    { k: "integracoes",  label: "Integrações",     icon: "Globe" },
    { k: "plano",        label: "Plano e cobrança",icon: "Money" },
    { k: "equipe",       label: "Equipe",          icon: "Users" },
  ];

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <h1 className="t-h1" style={{ marginBottom: 4 }}>Configurações</h1>
      <p className="t-muted" style={{ marginBottom: 24 }}>Sua conta, sua empresa e suas integrações</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "200px 1fr", gap: 16 }}>
        {/* Nav */}
        <nav className="card" style={{ padding: 8, height: "fit-content" }}>
          {sections.map(s => (
            <button key={s.k} className={`nav-item ${section === s.k ? "active" : ""}`} onClick={() => setSection(s.k)}>
              {React.createElement(I[s.icon], { size: 16 })}<span>{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="col" style={{ gap: 16 }}>
          {section === "perfil" && (
            <div className="card">
              <SectionHead title="Perfil"/>
              <div className="row-wrap" style={{ gap: 16, marginBottom: 20 }}>
                <Avatar name="Marina Costa" size="lg"/>
                <div className="col" style={{ gap: 4, flex: "1 1 auto" }}>
                  <Button variant="secondary" size="sm" icon={<I.Camera size={14}/>}>Trocar foto</Button>
                  <span className="t-caption t-faint">PNG ou JPG · até 5 MB</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div className="field"><label className="field-label">Nome</label><input className="input" defaultValue="Marina Costa"/></div>
                <div className="field"><label className="field-label">E-mail</label><input className="input" defaultValue="marina@ateliemare.com.br"/></div>
                <div className="field"><label className="field-label">Telefone</label><input className="input mono" defaultValue="(11) 99421-0820"/></div>
                <div className="field"><label className="field-label">Cargo</label><input className="input" defaultValue="Proprietária"/></div>
              </div>
              <div className="row" style={{ marginTop: 20, gap: 8 }}>
                <Button variant="primary">Salvar alterações</Button>
                <Button variant="secondary">Cancelar</Button>
              </div>
            </div>
          )}

          {section === "aparencia" && (
            <div className="col" style={{ gap: 16 }}>
              <div className="card">
                <SectionHead title="Tema" hint="Aplicado em todo o sistema"/>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <ThemeOption label="Claro" on={theme === "light"} onClick={() => setTheme("light")} preview="light"/>
                  <ThemeOption label="Escuro" on={theme === "dark"}  onClick={() => setTheme("dark")}  preview="dark"/>
                </div>
              </div>
              <div className="card">
                <SectionHead title="Densidade" hint="Quanto espaço respira entre os elementos"/>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                  {["compact", "default", "comfy"].map(d => (
                    <button key={d} onClick={() => setDensity(d)}
                            style={{
                              padding: 16, borderRadius: 10, border: "1.5px solid " + (density === d ? "var(--tech)" : "var(--border)"),
                              background: density === d ? "var(--tech-soft)" : "var(--bg-elev)",
                              cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit",
                            }}>
                      <div style={{ fontWeight: 600, marginBottom: 4, textTransform: "capitalize" }}>
                        {d === "default" ? "Padrão" : d === "compact" ? "Compacto" : "Confortável"}
                      </div>
                      <div className="t-caption t-muted">{d === "compact" ? "Mais linhas visíveis" : d === "default" ? "Balanceado" : "Mais respiro"}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === "integracoes" && (
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: "20px 24px" }}>
                <SectionHead title="Canais e integrações"/>
              </div>
              {[
                { name: "Shopee",          status: "Conectado", since: "Jan/26", color: "var(--tech)" },
                { name: "Mercado Livre",   status: "Conectado", since: "Nov/25", color: "var(--tech)" },
                { name: "TikTok Shop",     status: "Conectado", since: "Mar/26", color: "var(--tech)" },
                { name: "WhatsApp Business",status: "Conectado", since: "Set/25", color: "var(--tech)" },
                { name: "iFood",           status: "Conectar",  since: "—",      color: "var(--gray-400)" },
                { name: "Magalu Marketplace",status: "Conectar",since: "—",      color: "var(--gray-400)" },
              ].map((it, i) => (
                <div key={it.name} className="between" style={{ padding: "14px 24px", borderTop: "1px solid var(--border)" }}>
                  <div className="row" style={{ gap: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: it.color }}>
                      {it.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{it.name}</div>
                      <div className="t-caption t-muted">{it.status === "Conectado" ? `Desde ${it.since}` : "Desconectado"}</div>
                    </div>
                  </div>
                  {it.status === "Conectado"
                    ? <div className="row" style={{ gap: 6 }}><Badge tone="success" dot>Ativo</Badge>{!isMobile && <Button variant="secondary" size="sm">Configurar</Button>}</div>
                    : <Button variant="secondary" size="sm" icon={<I.Plus size={14}/>}>Conectar</Button>}
                </div>
              ))}
            </div>
          )}

          {section === "plano" && (
            <div className="col" style={{ gap: 16 }}>
              <div className="card" style={{ background: "var(--bg-sunken)" }}>
                <div className="between" style={{ marginBottom: 12 }}>
                  <div>
                    <div className="t-caption t-faint" style={{ textTransform: "uppercase", letterSpacing: 0.06 }}>Plano atual</div>
                    <div className="t-h2" style={{ marginTop: 4 }}>Pro · Loja + Orça</div>
                  </div>
                  <Badge tone="success" dot>Ativo</Badge>
                </div>
                <div className="row" style={{ gap: 24, flexWrap: "wrap" }}>
                  <div><div className="t-caption t-muted">Mensalidade</div><div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>R$ 597,00</div></div>
                  <div><div className="t-caption t-muted">Próxima cobrança</div><div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>02/06/26</div></div>
                  <div><div className="t-caption t-muted">Forma de pagto</div><div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>Cartão final 0421</div></div>
                </div>
                <div className="row" style={{ marginTop: 16, gap: 8 }}>
                  <Button variant="primary" size="sm">Mudar plano</Button>
                  <Button variant="secondary" size="sm">Ver faturas</Button>
                </div>
              </div>
              <div className="card">
                <SectionHead title="Uso do mês" hint="Janeiro reseta os contadores"/>
                <div className="col" style={{ gap: 14 }}>
                  <UsageBar label="Produtos cadastrados" value={184} max={500}/>
                  <UsageBar label="Gerações com IA" value={341} max={1000}/>
                  <UsageBar label="Orçamentos enviados" value={84} max={200}/>
                </div>
              </div>
            </div>
          )}

          {section === "segmento" && (
            <div className="col" style={{ gap: 16 }}>
              <div className="card">
                <SectionHead title="Tipo de negócio" hint="Define o que aparece na Loja"/>
                <p className="t-caption t-muted" style={{ marginBottom: 16 }}>
                  Trocar o segmento muda a navegação do módulo Loja e o que pode ser cadastrado. Os itens já cadastrados continuam disponíveis.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { k: "varejo",   icon: "Box",    title: "Varejo",   desc: "Vendo produtos" },
                    { k: "servicos", icon: "Tool",   title: "Serviços", desc: "Presto serviços" },
                    { k: "hibrido",  icon: "Layers", title: "Híbrido",  desc: "Produtos + serviços" },
                  ].map(o => {
                    const on = segment === o.k;
                    return (
                      <button key={o.k} onClick={() => setSegment && setSegment(o.k)}
                              style={{
                                textAlign: "left", padding: 14, borderRadius: 10,
                                border: "1.5px solid " + (on ? "var(--tech)" : "var(--border)"),
                                background: on ? "var(--tech-soft)" : "var(--bg-elev)",
                                cursor: "pointer", fontFamily: "inherit", color: "inherit",
                                display: "flex", flexDirection: "column", gap: 8,
                              }}>
                        <div className="row" style={{ gap: 10, alignItems: "center" }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: on ? "var(--tech)" : "var(--bg-sunken)",
                            color: on ? "#fff" : "var(--tech-deep)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {React.createElement(I[o.icon], { size: 16 })}
                          </div>
                          <div style={{ fontWeight: 600 }}>{o.title}</div>
                          {on && <I.Check size={14} style={{ marginLeft: "auto", color: "var(--tech)" }}/>}
                        </div>
                        <div className="t-caption t-muted">{o.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="card" style={{ background: "var(--bg-sunken)" }}>
                <SectionHead title="O que muda" hint="Pré-visualização do impacto"/>
                <div className="col" style={{ gap: 8 }}>
                  {segment === "varejo" && (
                    <>
                      <div className="row" style={{ gap: 8 }}><I.Check size={14} style={{ color: "var(--tech)" }}/><span className="t-caption">Sidebar mostra <strong>Produtos</strong>, <strong>Vendas</strong>, <strong>Estoque</strong></span></div>
                      <div className="row" style={{ gap: 8 }}><I.X size={14} style={{ color: "var(--text-faint)" }}/><span className="t-caption t-muted">Sem cadastro de serviços nem agenda</span></div>
                    </>
                  )}
                  {segment === "servicos" && (
                    <>
                      <div className="row" style={{ gap: 8 }}><I.Check size={14} style={{ color: "var(--tech)" }}/><span className="t-caption">Sidebar mostra <strong>Serviços</strong>, <strong>Vendas</strong>, <strong>Agenda</strong></span></div>
                      <div className="row" style={{ gap: 8 }}><I.Check size={14} style={{ color: "var(--tech)" }}/><span className="t-caption">Catálogo de serviços compartilhado com Orçamentos (Orça)</span></div>
                      <div className="row" style={{ gap: 8 }}><I.X size={14} style={{ color: "var(--text-faint)" }}/><span className="t-caption t-muted">Sem cadastro de produtos nem estoque</span></div>
                    </>
                  )}
                  {segment === "hibrido" && (
                    <>
                      <div className="row" style={{ gap: 8 }}><I.Check size={14} style={{ color: "var(--tech)" }}/><span className="t-caption">Sidebar mostra <strong>Catálogo</strong> (produtos + serviços), <strong>Estoque</strong> e <strong>Agenda</strong></span></div>
                      <div className="row" style={{ gap: 8 }}><I.Check size={14} style={{ color: "var(--tech)" }}/><span className="t-caption">Mesmos serviços valem em Loja, Vendas e Orçamentos — cadastra uma vez só</span></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {section === "empresa" && (
            <div className="card">
              <SectionHead title="Empresa"/>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                <div className="field"><label className="field-label">Razão social</label><input className="input" defaultValue="Marina Costa Comércio de Roupas LTDA"/></div>
                <div className="field"><label className="field-label">Nome fantasia</label><input className="input" defaultValue="Atelier Maré"/></div>
                <div className="field"><label className="field-label">CNPJ</label><input className="input mono" defaultValue="32.421.880/0001-04"/></div>
                <div className="field"><label className="field-label">Inscrição estadual</label><input className="input mono" defaultValue="142.882.421.108"/></div>
                <div className="field"><label className="field-label">CEP</label><input className="input mono" defaultValue="04571-080"/></div>
                <div className="field"><label className="field-label">Cidade</label><input className="input" defaultValue="São Paulo, SP"/></div>
              </div>
              <div className="row" style={{ marginTop: 20, gap: 8 }}>
                <Button variant="primary">Salvar</Button>
              </div>
            </div>
          )}

          {section === "equipe" && (
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: "20px 24px" }}><SectionHead title="Equipe" action={<Button variant="primary" size="sm" icon={<I.Plus size={14}/>}>Convidar</Button>}/></div>
              {[
                { name: "Marina Costa",    email: "marina@ateliemare.com.br", role: "Proprietária", since: "Jan/25" },
                { name: "Pedro Albuquerque", email: "pedro@ateliemare.com.br", role: "Vendedor",     since: "Mar/25" },
                { name: "Ana Beatriz",     email: "ana@ateliemare.com.br",   role: "Estoque",       since: "Out/25" },
              ].map(m => (
                <div key={m.email} className="between" style={{ padding: "14px 24px", borderTop: "1px solid var(--border)" }}>
                  <div className="row" style={{ gap: 12 }}>
                    <Avatar name={m.name}/>
                    <div>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div className="t-caption t-muted">{m.email}</div>
                    </div>
                  </div>
                  <div className="row" style={{ gap: 12 }}>
                    <Badge tone="neutral">{m.role}</Badge>
                    {!isMobile && <span className="t-caption t-faint">Desde {m.since}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Logout on mobile */}
          {isMobile && (
            <button className="btn btn-secondary" onClick={onLogout} style={{ alignSelf: "stretch" }}>
              <I.Logout size={16}/> Sair da conta
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ThemeOption = ({ label, on, onClick, preview }) => (
  <button onClick={onClick}
          style={{
            padding: 12, borderRadius: 12, border: "1.5px solid " + (on ? "var(--tech)" : "var(--border)"),
            background: on ? "var(--tech-soft)" : "var(--bg-elev)",
            cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit",
            display: "flex", gap: 12, alignItems: "center",
          }}>
    <div style={{
      width: 56, height: 40, borderRadius: 6, border: "1px solid var(--border)", overflow: "hidden",
      background: preview === "dark" ? "#0A0A0A" : "#FFFFFF", flexShrink: 0,
    }}>
      <div style={{ height: 8, background: preview === "dark" ? "#1A1A1A" : "#F7F7F8", borderBottom: "1px solid " + (preview === "dark" ? "#27272A" : "#E4E4E7") }}/>
      <div style={{ padding: 4, display: "flex", gap: 3 }}>
        <span style={{ width: 12, height: 4, background: "#00C46A", borderRadius: 2 }}/>
        <span style={{ width: 8,  height: 4, background: preview === "dark" ? "#27272A" : "#E4E4E7", borderRadius: 2 }}/>
      </div>
    </div>
    <div>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div className="t-caption t-muted">{preview === "dark" ? "Padrão do produto" : "Padrão comercial"}</div>
    </div>
    {on && <I.Check size={16} style={{ marginLeft: "auto", color: "var(--tech)" }}/>}
  </button>
);

const UsageBar = ({ label, value, max }) => {
  const pct = (value / max) * 100;
  const warn = pct > 80;
  return (
    <div>
      <div className="between" style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span className="mono t-caption" style={{ color: warn ? "var(--warning)" : "var(--text-muted)" }}>{value} / {max}</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "var(--bg-sunken)" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: warn ? "var(--warning)" : "var(--tech)", borderRadius: 999, transition: "width 600ms ease" }}/>
      </div>
    </div>
  );
};

// --- Notifications drawer ---
const NotificationsPanel = ({ open, onClose }) => (
  <Drawer open={open} onClose={onClose} title="Notificações">
    <div className="row" style={{ gap: 6, marginBottom: 12 }}>
      <Pill on>Todas</Pill><Pill>Não lidas</Pill>
    </div>
    <div className="col" style={{ gap: 4 }}>
      {NOTIFICATIONS.map(n => (
        <div key={n.id} className="row" style={{ gap: 12, padding: 12, borderRadius: 10, alignItems: "flex-start", cursor: "pointer" }}
             onMouseEnter={e => e.currentTarget.style.background = "var(--bg-sunken)"}
             onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: n.tone === "warning" ? "var(--warning-soft)" : n.tone === "success" ? "var(--tech-soft)" : "var(--bg-sunken)",
            color:      n.tone === "warning" ? "#B45309"            : n.tone === "success" ? "var(--tech-deep)" : "var(--text-muted)",
          }}>
            {React.createElement(I[n.icon] || I.Bell, { size: 16 })}
          </div>
          <div className="grow">
            <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
            <div className="t-caption t-muted">{n.body}</div>
            <div className="t-caption t-faint" style={{ marginTop: 2 }}>{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  </Drawer>
);

Object.assign(window, { Clientes, Relatorios, Configuracoes, NotificationsPanel });
