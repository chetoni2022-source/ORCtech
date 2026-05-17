// Sidebar, TopBar, MobileTabBar, ModuleSwitcher
// Routes are simple string keys. App holds state and passes navigate().

// nav config per module — adapts to the customer's business segment.
// Segment ortogonal ao plano: varejo só produtos, servicos só serviços,
// hibrido tem ambos (e mostra "Catálogo" unificado).
const NAV_ORCA = [
  { key: "orca/dashboard",  label: "Painel",      icon: "Home" },
  { key: "orca/orcamentos", label: "Orçamentos",  icon: "FileText", count: 7 },
  { key: "orca/agenda",     label: "Agenda",      icon: "Calendar", count: 5 },
  { key: "clientes",        label: "Clientes",    icon: "Users" },
  { key: "analises",        label: "Análises",    icon: "Chart" },
];

const NAV_BOTTOM = [
  { key: "configuracoes", label: "Configurações", icon: "Settings" },
];

function getNavLoja(segment) {
  if (segment === "servicos") {
    return [
      { key: "loja/dashboard", label: "Painel",   icon: "Home" },
      { key: "loja/servicos",  label: "Serviços", icon: "Tool", count: 8 },
      { key: "loja/vendas",    label: "Vendas",   icon: "Cart", count: 6 },
      { key: "loja/agenda",    label: "Agenda",   icon: "Calendar", count: 5 },
      { key: "clientes",       label: "Clientes", icon: "Users" },
      { key: "analises",       label: "Análises", icon: "Chart" },
    ];
  }
  if (segment === "hibrido") {
    return [
      { key: "loja/dashboard", label: "Painel",   icon: "Home" },
      { key: "loja/catalogo",  label: "Catálogo", icon: "Layers", count: 16 },
      { key: "loja/vendas",    label: "Vendas",   icon: "Cart", count: 6 },
      { key: "loja/estoque",   label: "Estoque",  icon: "Pkg" },
      { key: "loja/agenda",    label: "Agenda",   icon: "Calendar", count: 5 },
      { key: "clientes",       label: "Clientes", icon: "Users" },
      { key: "analises",       label: "Análises", icon: "Chart" },
    ];
  }
  // varejo (default)
  return [
    { key: "loja/dashboard", label: "Painel",   icon: "Home" },
    { key: "loja/produtos",  label: "Produtos", icon: "Box", count: 8 },
    { key: "loja/vendas",    label: "Vendas",   icon: "Cart", count: 6 },
    { key: "loja/estoque",   label: "Estoque",  icon: "Pkg" },
    { key: "clientes",       label: "Clientes", icon: "Users" },
    { key: "analises",       label: "Análises", icon: "Chart" },
  ];
}

function getNav(module, segment = "varejo") {
  return module === "orca" ? NAV_ORCA : getNavLoja(segment);
}

// Sidebar (desktop)
const Sidebar = ({ route, navigate, module, setModule, onLogout, plan = "combo", segment = "varejo" }) => {
  const items = getNav(module, segment);
  const isActive = (key) => {
    if (key === route) return true;
    if (key === "clientes" && route.startsWith("clientes")) return true;
    // Catálogo "ativo" também em sub-rotas de produtos/serviços (segmento híbrido)
    if (key === "loja/catalogo" && (route === "loja/produtos" || route === "loja/servicos")) return true;
    return false;
  };
  return (
    <aside className="sidebar">
      <div style={{ padding: "16px 16px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo size={18}/>
        <button className="btn btn-secondary btn-icon btn-sm" title="Buscar">
          <I.Search size={16}/>
        </button>
      </div>

      <ModuleSwitcher module={module} setModule={setModule} navigate={navigate} plan={plan}/>

      <nav style={{ padding: "8px 8px", flex: 1, minHeight: 0, overflow: "auto" }}>
        {items.map(it => (
          <button key={it.key} className={`nav-item ${isActive(it.key) ? "active" : ""}`}
                  onClick={() => navigate(it.key)}>
            {React.createElement(I[it.icon], { size: 18, stroke: isActive(it.key) ? 2 : 1.75 })}
            <span>{it.label}</span>
            {it.count != null && <span className="badge-count">{it.count}</span>}
          </button>
        ))}
      </nav>

      <div style={{ padding: 8, borderTop: "1px solid var(--border)" }}>
        {NAV_BOTTOM.map(it => (
          <button key={it.key} className={`nav-item ${route === it.key ? "active" : ""}`}
                  onClick={() => navigate(it.key)}>
            {React.createElement(I[it.icon], { size: 18 })}
            <span>{it.label}</span>
          </button>
        ))}
        <button className="nav-item" onClick={onLogout}>
          <I.Logout size={18}/><span>Sair</span>
        </button>
      </div>

      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name="Marina Costa"/>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Marina Costa</div>
          <div className="t-caption t-faint" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Atelier Maré · Plano Pro</div>
        </div>
      </div>
    </aside>
  );
};

// Module switcher — segmented control between Loja / Orça
const ModuleSwitcher = ({ module, setModule, navigate, plan = "combo" }) => {
  const opts = [
    { k: "loja",  label: "Loja",  hint: "Varejo" },
    { k: "orca",  label: "Orça",  hint: "Serviços" },
  ];
  const isAvailable = (k) => plan === "combo" || plan === k;
  return (
    <div style={{ padding: "4px 12px 12px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2,
        background: "var(--bg-sunken)", padding: 4, borderRadius: 10,
        border: "1px solid var(--border)",
      }}>
        {opts.map(o => {
          const on = module === o.k;
          const locked = !isAvailable(o.k);
          return (
            <button key={o.k}
                    onClick={() => { setModule(o.k); navigate(`${o.k}/dashboard`); }}
                    title={locked ? "Módulo não contratado · clique para conhecer" : ""}
                    style={{
                      border: 0, cursor: "pointer", padding: "8px 10px",
                      borderRadius: 8, textAlign: "left",
                      background: on ? "var(--bg-elev)" : "transparent",
                      color: on ? "var(--text)" : locked ? "var(--text-faint)" : "var(--text-muted)",
                      boxShadow: on ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                      fontFamily: "inherit",
                      transition: "background 120ms ease, color 120ms ease",
                      position: "relative",
                    }}>
              <div style={{ fontSize: 12, color: "var(--text-faint)", fontWeight: 500 }}>ORCtech</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 1, display: "flex", alignItems: "center", gap: 6 }}>
                {o.label}
                {on && !locked && <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--tech)" }}/>}
                {locked && <I.Lock size={11} style={{ marginLeft: "auto", opacity: 0.7 }}/>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// TopBar
const TopBar = ({ route, navigate, isMobile, openNotifications, openSearch, theme, setTheme, openMobileMenu, module, setModule, plan = "combo" }) => {
  const crumbs = getBreadcrumb(route);
  return (
    <header className="topbar">
      {isMobile && (
        <button className="btn btn-secondary btn-icon btn-sm" onClick={openMobileMenu} title="Menu">
          <I.Menu size={18}/>
        </button>
      )}
      {isMobile && (
        plan === "combo"
          ? <MobileModuleSwitcher module={module} setModule={setModule} navigate={navigate} plan={plan}/>
          : <Logo size={16}/>
      )}

      {!isMobile && (
        <div className="row grow" style={{ gap: 8, minWidth: 0 }}>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="t-faint">/</span>}
              <span style={{ color: i === crumbs.length - 1 ? "var(--text)" : "var(--text-muted)", fontWeight: i === crumbs.length - 1 ? 600 : 500, fontSize: 14, whiteSpace: "nowrap" }}>
                {c}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="grow"/>

      {!isMobile && (
        <button onClick={openSearch}
                className="row"
                style={{
                  width: 280, maxWidth: "30vw", height: 36,
                  padding: "0 12px", gap: 10,
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--border)",
                  borderRadius: 8, cursor: "pointer",
                  fontFamily: "inherit",
                  color: "var(--text-faint)",
                }}>
          <I.Search size={16}/>
          <span style={{ flex: 1, textAlign: "left", fontSize: 13 }}>Buscar produtos, clientes, pedidos…</span>
          <span style={{
            padding: "2px 6px", borderRadius: 4,
            background: "var(--bg-elev)", border: "1px solid var(--border)",
            fontSize: 11, fontWeight: 600,
          }}>⌘K</span>
        </button>
      )}

      {isMobile && (
        <button onClick={openSearch} className="btn btn-secondary btn-icon btn-sm" title="Buscar (Cmd+K)">
          <I.Search size={16}/>
        </button>
      )}

      <button className="btn btn-secondary btn-icon btn-sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Tema">
        {theme === "dark" ? <I.Sun size={16}/> : <I.Moon size={16}/>}
      </button>

      <button className="btn btn-secondary btn-icon btn-sm" onClick={openNotifications} title="Notificações" style={{ position: "relative" }}>
        <I.Bell size={16}/>
        <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 999, background: "var(--tech)", border: "1.5px solid var(--bg-elev)" }}/>
      </button>
    </header>
  );
};

// Mobile bottom tab bar — first 4 nav items of current module + more
const MobileTabBar = ({ route, navigate, module, segment = "varejo" }) => {
  const items = getNav(module, segment).slice(0, 4);
  return (
    <nav className="tabbar">
      {items.map(it => {
        const active = route === it.key || (it.key === "clientes" && route.startsWith("clientes"));
        return (
          <button key={it.key} className={`tabbar-item ${active ? "active" : ""}`} onClick={() => navigate(it.key)}>
            {React.createElement(I[it.icon], { size: 22, stroke: active ? 2 : 1.75 })}
            <span>{it.label}</span>
          </button>
        );
      })}
      <button className={`tabbar-item ${route === "configuracoes" ? "active" : ""}`} onClick={() => navigate("configuracoes")}>
        <I.Settings size={22}/><span>Mais</span>
      </button>
    </nav>
  );
};

// Mobile slide-in nav drawer
const MobileMenu = ({ open, onClose, route, navigate, module, setModule, theme, setTheme, onLogout, plan = "combo", segment = "varejo" }) => {
  if (!open) return null;
  const items = [...getNav(module, segment), ...NAV_BOTTOM];
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 80, background: "rgba(10,10,10,0.5)" }}>
      <aside onClick={e => e.stopPropagation()}
             style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 280, maxWidth: "85%",
                      background: "var(--sidebar-bg)", display: "flex", flexDirection: "column",
                      animation: "slideleft 220ms ease" }}>
        <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size={18}/>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}><I.X size={16}/></button>
        </div>
        <ModuleSwitcher module={module} setModule={setModule} navigate={(k) => { navigate(k); onClose(); }} plan={plan}/>
        <nav style={{ padding: 8, flex: 1, overflow: "auto" }}>
          {items.map(it => {
            const active = route === it.key || (it.key === "clientes" && route.startsWith("clientes"));
            return (
              <button key={it.key} className={`nav-item ${active ? "active" : ""}`}
                      onClick={() => { navigate(it.key); onClose(); }}>
                {React.createElement(I[it.icon], { size: 18 })}<span>{it.label}</span>
                {it.count != null && <span className="badge-count">{it.count}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: 8, borderTop: "1px solid var(--border)" }}>
          <button className="nav-item" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <I.Sun size={18}/> : <I.Moon size={18}/>}<span>Tema {theme === "dark" ? "claro" : "escuro"}</span>
          </button>
          <button className="nav-item" onClick={onLogout}><I.Logout size={18}/><span>Sair</span></button>
        </div>
      </aside>
      <style>{`@keyframes slideleft { from { transform: translateX(-20px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>
    </div>
  );
};

// breadcrumb based on route
function getBreadcrumb(route) {
  const map = {
    "loja/dashboard":        ["ORCtech Loja", "Painel"],
    "loja/catalogo":         ["ORCtech Loja", "Catálogo"],
    "loja/produtos":         ["ORCtech Loja", "Produtos"],
    "loja/produtos/novo":    ["ORCtech Loja", "Produtos", "Novo produto"],
    "loja/servicos":         ["ORCtech Loja", "Serviços"],
    "loja/servicos/novo":    ["ORCtech Loja", "Serviços", "Novo serviço"],
    "loja/vendas":           ["ORCtech Loja", "Vendas"],
    "loja/vendas/novo":      ["ORCtech Loja", "Vendas", "Nova venda"],
    "loja/estoque":          ["ORCtech Loja", "Estoque"],
    "loja/agenda":           ["ORCtech Loja", "Agenda"],
    "orca/dashboard":        ["ORCtech Orça", "Painel"],
    "orca/orcamentos":       ["ORCtech Orça", "Orçamentos"],
    "orca/orcamentos/novo":  ["ORCtech Orça", "Orçamentos", "Novo orçamento"],
    "orca/agenda":           ["ORCtech Orça", "Agenda"],
    "clientes":              ["Clientes"],
    "clientes/novo":         ["Clientes", "Novo cliente"],
    "relatorios":            ["Análises"],
    "analises":              ["Análises"],
    "configuracoes":         ["Configurações"],
  };
  return map[route] || ["—"];
}

Object.assign(window, { Sidebar, TopBar, MobileTabBar, ModuleSwitcher, MobileMenu, getBreadcrumb, getNav });
