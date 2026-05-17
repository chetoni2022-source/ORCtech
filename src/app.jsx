// ORCtech app — routes, layout, dual-viewport wrapper
// Renders both desktop and mobile artboards side-by-side on the same page.

function AppInstance({ isMobile, theme, density, plan, setPlan, sessionId }) {
  const [route, setRoute] = React.useState("loja/dashboard");
  const [module, setModule] = React.useState("loja");
  const [authed, setAuthed] = React.useState(true);
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const [notifsOpen, setNotifsOpen] = React.useState(false);
  const [orcamentoPreview, setOrcamentoPreview] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [confirm, setConfirm] = React.useState(null); // { title, body, onConfirm, danger, confirmLabel }

  // If plan changes such that current module is locked, switch to the available one
  React.useEffect(() => {
    if (plan === "loja" && module === "orca") { setModule("loja"); setRoute("loja/dashboard"); }
    if (plan === "orca" && module === "loja") { setModule("orca"); setRoute("orca/dashboard"); }
  }, [plan]);

  const moduleAvailable = (m) => plan === "combo" || plan === m;

  // Sync route → module when navigating to a module-prefixed page
  const navigate = React.useCallback((to) => {
    setRoute(to);
    if (to.startsWith("loja/")) setModule("loja");
    if (to.startsWith("orca/")) setModule("orca");
    setOrcamentoPreview(null);
  }, []);

  // Cmd+K / Ctrl+K → open command palette
  React.useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const setThemeShared = React.useCallback((t) => {
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { theme: t } }, "*");
  }, []);

  const onToast = React.useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const askConfirm = React.useCallback((cfg) => setConfirm(cfg), []);

  const onLogout = () => setAuthed(false);
  const onLogin  = () => { setAuthed(true); setRoute(module === "orca" ? "orca/dashboard" : "loja/dashboard"); };

  if (!authed) {
    return (
      <div className={`app-root ${theme === "dark" ? "theme-dark" : ""} density-${density}`} style={{ position: "relative", height: "100%", overflow: "hidden" }}>
        <LoginScreen onLogin={onLogin} isMobile={isMobile} theme={theme}/>
      </div>
    );
  }

  // Locked module — show upsell
  if ((module === "orca" && !moduleAvailable("orca")) || (module === "loja" && !moduleAvailable("loja"))) {
    return (
      <div className={`app-root ${theme === "dark" ? "theme-dark" : ""} density-${density}`} style={{ position: "relative", height: "100%", overflow: "hidden" }}>
        <div className={`app-shell ${isMobile ? "mobile" : ""} density-${density}`}>
          {!isMobile && <Sidebar route={route} navigate={navigate} module={module} setModule={(m) => { if (moduleAvailable(m)) setModule(m); }} onLogout={onLogout} plan={plan}/>}
          <TopBar route={route} navigate={navigate} isMobile={isMobile}
                  openNotifications={() => setNotifsOpen(true)}
                  openMobileMenu={() => setMobileMenu(true)}
                  theme={theme} setTheme={setThemeShared}/>
          <main className="app-content">
            <BlockedModule navigate={navigate} isMobile={isMobile} module={module}
                           onContract={() => { setPlan("combo"); onToast("Trial ativado · 14 dias grátis"); }}/>
          </main>
          {isMobile && <MobileTabBar route={route} navigate={navigate} module={module} plan={plan}/>}
        </div>
      </div>
    );
  }

  // Page router
  let page;
  const routeIsCustomerDetail = route.startsWith("clientes/") && route !== "clientes/novo";
  if (routeIsCustomerDetail) {
    const customerId = route.split("/")[1];
    page = <CustomerDetail navigate={navigate} isMobile={isMobile} customerId={customerId} module={module}/>;
  } else {
    switch (route) {
      case "loja/dashboard":       page = <LojaDashboard navigate={navigate} isMobile={isMobile}/>; break;
      case "loja/produtos":        page = <LojaProdutos  navigate={navigate} isMobile={isMobile}/>; break;
      case "loja/produtos/novo":   page = <LojaNovoProduto navigate={navigate} isMobile={isMobile} onToast={onToast}/>; break;
      case "loja/vendas":          page = <LojaVendas    navigate={navigate} isMobile={isMobile}/>; break;
      case "loja/vendas/novo":     page = <NovaVenda     navigate={navigate} isMobile={isMobile} onToast={onToast} askConfirm={askConfirm}/>; break;
      case "loja/estoque":         page = <LojaEstoque   navigate={navigate} isMobile={isMobile}/>; break;
      case "orca/dashboard":       page = <OrcaDashboard navigate={navigate} isMobile={isMobile}/>; break;
      case "orca/orcamentos":      page = <OrcaOrcamentos navigate={navigate} isMobile={isMobile} onOpenPreview={setOrcamentoPreview}/>; break;
      case "orca/orcamentos/novo": page = <OrcaNovoOrcamento navigate={navigate} isMobile={isMobile} onToast={onToast}/>; break;
      case "orca/agenda":          page = <OrcaAgenda    navigate={navigate} isMobile={isMobile}/>; break;
      case "clientes":             page = <Clientes      navigate={navigate} isMobile={isMobile} module={module}/>; break;
      case "clientes/novo":        page = <NovoCliente   navigate={navigate} isMobile={isMobile} onToast={onToast}/>; break;
      case "relatorios":           page = <Analises      navigate={navigate} isMobile={isMobile} module={module}/>; break;
      case "analises":             page = <Analises      navigate={navigate} isMobile={isMobile} module={module}/>; break;
      case "configuracoes":        page = <Configuracoes navigate={navigate} isMobile={isMobile} theme={theme} setTheme={setThemeShared} density={density} setDensity={(d) => window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { density: d } }, "*")} plan={plan} setPlan={setPlan} onLogout={onLogout}/>; break;
      default:                     page = <LojaDashboard navigate={navigate} isMobile={isMobile}/>;
    }
  }

  // Decide FAB action per route (mobile only)
  const fabAction = (() => {
    if (route === "loja/produtos")  return { icon: <I.Plus size={22}/>, onClick: () => navigate("loja/produtos/novo"),    label: "Novo produto" };
    if (route === "loja/vendas")    return { icon: <I.Plus size={22}/>, onClick: () => navigate("loja/vendas/novo"),      label: "Nova venda" };
    if (route === "loja/dashboard") return { icon: <I.Plus size={22}/>, onClick: () => navigate("loja/produtos/novo"),    label: "Novo produto" };
    if (route === "orca/orcamentos")return { icon: <I.Plus size={22}/>, onClick: () => navigate("orca/orcamentos/novo"),  label: "Novo orçamento" };
    if (route === "orca/dashboard") return { icon: <I.Plus size={22}/>, onClick: () => navigate("orca/orcamentos/novo"),  label: "Novo orçamento" };
    if (route === "clientes")       return { icon: <I.Plus size={22}/>, onClick: () => navigate("clientes/novo"),         label: "Novo cliente" };
    return null;
  })();

  return (
    <div className={`app-root ${theme === "dark" ? "theme-dark" : ""} density-${density}`} style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      <div className={`app-shell ${isMobile ? "mobile" : ""} density-${density}`}>
        {!isMobile && <Sidebar route={route} navigate={navigate} module={module} setModule={setModule} onLogout={onLogout} plan={plan}/>}
        <TopBar route={route} navigate={navigate} isMobile={isMobile}
                openNotifications={() => setNotifsOpen(true)}
                openMobileMenu={() => setMobileMenu(true)}
                openSearch={() => setPaletteOpen(true)}
                theme={theme} setTheme={setThemeShared}
                module={module} setModule={setModule} plan={plan}/>
        <main className="app-content">
          {page}
        </main>
        {isMobile && <MobileTabBar route={route} navigate={navigate} module={module}/>}
      </div>

      <NotificationsPanel open={notifsOpen} onClose={() => setNotifsOpen(false)}/>

      {orcamentoPreview && <OrcaPreview orcamento={orcamentoPreview} onClose={() => setOrcamentoPreview(null)}/>}

      {isMobile && <MobileMenu open={mobileMenu} onClose={() => setMobileMenu(false)}
                                route={route} navigate={navigate} module={module} setModule={setModule}
                                theme={theme} setTheme={setThemeShared} onLogout={onLogout} plan={plan}/>}

      {/* Mobile FAB — page-specific */}
      {isMobile && fabAction && (
        <MobileFAB icon={fabAction.icon} onClick={fabAction.onClick} label={fabAction.label}/>
      )}

      {/* AI Assistant launcher + drawer (desktop only — mobile uses dedicated nav) */}
      {!isMobile && <AILauncher onClick={() => setAiOpen(true)} hidden={aiOpen || paletteOpen}/>}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} navigate={navigate}/>

      {/* Cmd+K palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} navigate={navigate}/>

      {/* Confirm dialog */}
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)}
                     title={confirm?.title} body={confirm?.body}
                     onConfirm={confirm?.onConfirm || (() => {})}
                     confirmLabel={confirm?.confirmLabel} danger={confirm?.danger}/>

      <Toast visible={!!toast} message={toast}/>
    </div>
  );
}

// Wrapper that shows desktop + mobile side-by-side on a stage
function ORCtechStage() {
  const TWEAKS_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "dark",
    "density": "default",
    "show": "both",
    "plan": "combo"
  }/*EDITMODE-END*/;
  const [t, setTweak] = useTweaks(TWEAKS_DEFAULTS);

  const theme = t.theme;
  const density = t.density;
  const plan = t.plan || "combo";
  const setPlan = (p) => setTweak("plan", p);
  const showDesktop = t.show !== "mobile";
  const showMobile  = t.show !== "desktop";

  // Stage background follows the theme
  const stageBg = theme === "dark" ? "#0F0F11" : "#F0F0F2";

  return (
    <div style={{
      minHeight: "100vh",
      background: stageBg,
      padding: "32px 32px 80px",
      display: "flex",
      gap: 28,
      justifyContent: "center",
      alignItems: "flex-start",
      transition: "background 200ms ease",
      flexWrap: "wrap",
    }}>
      {showDesktop && (
        <div style={{ flex: showMobile ? "1 1 980px" : "1 1 1200px", maxWidth: 1240, minWidth: 0 }}>
          <FrameLabel label="Desktop" sub="1280 × 820"/>
          <DeviceFrame width="100%" height={820} ratio={1280}>
            <AppInstance isMobile={false} theme={theme} density={density} plan={plan} setPlan={setPlan} sessionId="desk"/>
          </DeviceFrame>
        </div>
      )}
      {showMobile && (
        <div style={{ flex: "0 0 auto" }}>
          <FrameLabel label="Mobile" sub="390 × 820"/>
          <PhoneFrame>
            <AppInstance isMobile={true} theme={theme} density={density} plan={plan} setPlan={setPlan} sessionId="mob"/>
          </PhoneFrame>
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Aparência">
          <TweakRadio label="Tema" value={theme} onChange={v => setTweak("theme", v)}
                      options={[{ value: "light", label: "Claro" }, { value: "dark", label: "Escuro" }]}/>
          <TweakSelect label="Densidade" value={density} onChange={v => setTweak("density", v)}
                       options={[{ value: "compact", label: "Compacto" }, { value: "default", label: "Padrão" }, { value: "comfy", label: "Confortável" }]}/>
        </TweakSection>
        <TweakSection label="Plano contratado">
          <TweakSelect label="Módulos" value={plan} onChange={v => setTweak("plan", v)}
                       options={[
                         { value: "combo", label: "Loja + Orça (Combo)" },
                         { value: "loja",  label: "Apenas Loja" },
                         { value: "orca",  label: "Apenas Orça" },
                       ]}/>
        </TweakSection>
        <TweakSection label="Mostrar">
          <TweakSelect label="Dispositivos" value={t.show} onChange={v => setTweak("show", v)}
                       options={[{ value: "both", label: "Desktop + Mobile" }, { value: "desktop", label: "Apenas Desktop" }, { value: "mobile", label: "Apenas Mobile" }]}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

const FrameLabel = ({ label, sub }) => (
  <div className="row" style={{ gap: 8, marginBottom: 10, marginLeft: 4 }}>
    <span style={{ fontWeight: 600, fontSize: 13, color: "var(--ftxt, #52525B)", fontFamily: "Inter, system-ui, sans-serif" }}>{label}</span>
    <span className="mono" style={{ fontSize: 12, color: "#A1A1AA" }}>{sub}</span>
  </div>
);

// Desktop browser-ish frame
const DeviceFrame = ({ children, width = "100%", height = 820, ratio = 1280 }) => (
  <div style={{
    width, maxWidth: ratio,
    borderRadius: 14,
    background: "#0A0A0A",
    boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4), 0 16px 30px -10px rgba(0,0,0,0.18)",
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.1)",
  }}>
    <div style={{
      height: 28, background: "#0A0A0A",
      display: "flex", alignItems: "center", gap: 6, padding: "0 12px",
    }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF5F57" }}/>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FEBC2E" }}/>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28C840" }}/>
      <span style={{ marginLeft: 16, fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
        app.orctech.com.br/dashboard
      </span>
    </div>
    <div style={{ height, background: "var(--bg, #FAFAFA)" }}>
      {children}
    </div>
  </div>
);

// Mobile phone frame
const PhoneFrame = ({ children }) => (
  <div style={{
    width: 390, height: 820,
    background: "#0A0A0A",
    borderRadius: 44,
    padding: 10,
    boxShadow: "0 30px 60px -20px rgba(0,0,0,0.4), 0 16px 30px -10px rgba(0,0,0,0.18)",
    position: "relative",
  }}>
    <div style={{
      position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
      width: 110, height: 26, borderRadius: 999, background: "#0A0A0A", zIndex: 2,
    }}/>
    <div style={{
      width: "100%", height: "100%",
      borderRadius: 36, overflow: "hidden",
      background: "var(--bg, #FAFAFA)",
      position: "relative",
    }}>
      {/* Status bar */}
      <div style={{
        height: 44, padding: "0 26px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 1,
        pointerEvents: "none",
        color: "var(--text, #0A0A0A)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 14, fontWeight: 600,
      }}>
        <span>9:41</span>
        <span/>
        <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <span style={{ width: 16, height: 10, borderRadius: 2, border: "1.2px solid currentColor", opacity: 0.85 }}>
            <span style={{ display: "block", height: "100%", width: "70%", background: "currentColor", borderRadius: 1 }}/>
          </span>
        </span>
      </div>
      <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  </div>
);

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ORCtechStage/>);
