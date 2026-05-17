// Login screen — refined version
const LoginScreen = ({ onLogin, isMobile, theme }) => {
  const [email, setEmail] = React.useState("marina@ateliemare.com.br");
  const [password, setPassword] = React.useState("ateliemare2026");
  const [showPwd, setShowPwd] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const submit = (e) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 600);
  };

  if (isMobile) return <LoginMobile {...{ email, setEmail, password, setPassword, showPwd, setShowPwd, remember, setRemember, loading, submit }}/>;
  return <LoginDesktop {...{ email, setEmail, password, setPassword, showPwd, setShowPwd, remember, setRemember, loading, submit, theme }}/>;
};

// — Desktop layout — asymmetric 1.05fr / 1fr split with rich hero
const LoginDesktop = ({ email, setEmail, password, setPassword, showPwd, setShowPwd, remember, setRemember, loading, submit, theme }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "1.05fr 1fr",
    height: "100%",
    background: "var(--bg)",
  }}>
    {/* Form side */}
    <div style={{
      display: "flex", flexDirection: "column",
      padding: "40px 56px",
      background: "var(--bg)",
      minWidth: 0,
    }}>
      <Logo size={20}/>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 400 }}>
        <h1 className="t-h1" style={{ marginBottom: 6 }}>Bem-vindo de volta</h1>
        <p className="t-body t-muted" style={{ marginBottom: 32 }}>Entre na sua conta para continuar.</p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="field">
            <label className="field-label">E-mail</label>
            <div className="input-icon-wrap">
              <span className="input-icon"><I.Mail size={16}/></span>
              <input className="input" value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="voce@suaempresa.com.br" autoComplete="email"/>
            </div>
          </div>

          <div className="field">
            <div className="between">
              <label className="field-label">Senha</label>
              <button type="button" className="btn btn-ghost btn-sm" style={{ padding: 0, height: "auto" }}>
                Esqueci a senha
              </button>
            </div>
            <div className="input-icon-wrap">
              <span className="input-icon"><I.Lock size={16}/></span>
              <input className="input" type={showPwd ? "text" : "password"}
                     value={password} onChange={e => setPassword(e.target.value)}
                     style={{ paddingRight: 40 }}/>
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                      style={{
                        position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                        border: 0, background: "transparent", cursor: "pointer",
                        color: "var(--text-faint)", padding: 6, display: "flex", borderRadius: 6,
                      }}>
                {showPwd ? <I.EyeOff size={16}/> : <I.Eye size={16}/>}
              </button>
            </div>
          </div>

          <label className="row" style={{ gap: 10, cursor: "pointer", userSelect: "none", marginTop: 2 }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                   style={{ accentColor: "var(--tech)", width: 16, height: 16, margin: 0, cursor: "pointer" }}/>
            <span className="t-body">Manter conectado neste dispositivo</span>
          </label>

          <Button variant="primary" size="lg" type="submit" fullWidth disabled={loading}
                  icon={loading ? <I.Refresh size={16} className="spin"/> : null}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>

          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-faint)", margin: "6px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
            <span style={{ fontSize: 12, fontWeight: 500 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <Button variant="secondary" fullWidth icon={<SSOIcon kind="google"/>}>Google</Button>
            <Button variant="secondary" fullWidth icon={<SSOIcon kind="apple"/>}>Apple</Button>
          </div>
        </form>
      </div>

      <div className="t-caption t-faint" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>© 2026 ORCtech</span>
        <span style={{ display: "flex", gap: 16 }}>
          <span style={{ cursor: "pointer" }}>Termos</span>
          <span style={{ cursor: "pointer" }}>Privacidade</span>
          <span style={{ cursor: "pointer" }}>Suporte</span>
        </span>
      </div>
    </div>

    {/* Hero side */}
    <LoginHero theme={theme}/>
  </div>
);

// — Mobile layout — vertical, centered, with subtle decor
const LoginMobile = ({ email, setEmail, password, setPassword, showPwd, setShowPwd, remember, setRemember, loading, submit }) => (
  <div style={{
    height: "100%", overflow: "auto",
    background: "var(--bg)",
    display: "flex", flexDirection: "column",
    padding: "28px 24px 24px",
    position: "relative",
  }}>
    {/* Subtle top decor */}
    <svg viewBox="0 0 400 200" style={{ position: "absolute", top: -20, right: -40, width: 280, opacity: 0.12, pointerEvents: "none" }}>
      <circle cx="280" cy="80" r="120" fill="none" stroke="var(--tech)" strokeWidth="1"/>
      <circle cx="280" cy="80" r="80" fill="none" stroke="var(--tech)" strokeWidth="1"/>
      <circle cx="280" cy="80" r="40" fill="var(--tech)" opacity="0.6"/>
    </svg>

    <Logo size={18}/>

    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 24, paddingBottom: 24, position: "relative", zIndex: 1 }}>
      <h1 className="t-h1" style={{ marginBottom: 6 }}>Bem-vindo<br/>de volta</h1>
      <p className="t-body t-muted" style={{ marginBottom: 28 }}>Entre na sua conta para continuar.</p>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="field">
          <label className="field-label">E-mail</label>
          <div className="input-icon-wrap">
            <span className="input-icon"><I.Mail size={16}/></span>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
          </div>
        </div>
        <div className="field">
          <div className="between">
            <label className="field-label">Senha</label>
            <button type="button" className="btn btn-ghost btn-sm" style={{ padding: 0, height: "auto" }}>Esqueci</button>
          </div>
          <div className="input-icon-wrap">
            <span className="input-icon"><I.Lock size={16}/></span>
            <input className="input" type={showPwd ? "text" : "password"}
                   value={password} onChange={e => setPassword(e.target.value)}
                   style={{ paddingRight: 40 }}/>
            <button type="button" onClick={() => setShowPwd(!showPwd)}
                    style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", cursor: "pointer", color: "var(--text-faint)", padding: 6, display: "flex" }}>
              {showPwd ? <I.EyeOff size={16}/> : <I.Eye size={16}/>}
            </button>
          </div>
        </div>

        <label className="row" style={{ gap: 10, cursor: "pointer", userSelect: "none" }}>
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                 style={{ accentColor: "var(--tech)", width: 16, height: 16, margin: 0 }}/>
          <span className="t-body">Manter conectado</span>
        </label>

        <Button variant="primary" size="lg" type="submit" fullWidth disabled={loading}
                icon={loading ? <I.Refresh size={16} className="spin"/> : null}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--text-faint)", marginTop: 4 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
          <span style={{ fontSize: 12, fontWeight: 500 }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <Button variant="secondary" fullWidth icon={<SSOIcon kind="google"/>}>Google</Button>
          <Button variant="secondary" fullWidth icon={<SSOIcon kind="apple"/>}>Apple</Button>
        </div>
      </form>
    </div>

    <div className="t-caption t-faint" style={{ textAlign: "center" }}>© 2026 ORCtech</div>
  </div>
);

// Hero side panel for desktop — dark, with floating KPI mock and bottom social-proof
const LoginHero = ({ theme }) => (
  <div style={{
    background: "#0A0A0A",
    color: "#fff",
    padding: "48px 56px",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    position: "relative", overflow: "hidden",
    minWidth: 0,
  }}>
    {/* Background mesh */}
    <div style={{
      position: "absolute", inset: 0,
      background: `
        radial-gradient(60% 50% at 90% 10%, rgba(0,196,106,0.18) 0%, transparent 70%),
        radial-gradient(50% 50% at 10% 90%, rgba(0,196,106,0.08) 0%, transparent 70%)
      `,
      pointerEvents: "none",
    }}/>
    {/* Grid lines */}
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }}>
      <defs>
        <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#fff" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>

    {/* Top: logo */}
    <div style={{ position: "relative", zIndex: 2 }}>
      <Logo size={18} onDark/>
    </div>

    {/* Middle: headline + floating mockup */}
    <div style={{ position: "relative", zIndex: 2 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 12px", borderRadius: 999,
        background: "rgba(0,196,106,0.14)", color: "var(--tech)",
        fontSize: 12, fontWeight: 600,
        border: "1px solid rgba(0,196,106,0.25)",
        marginBottom: 28,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--tech)" }}/>
        Plataforma com IA
      </div>

      <h2 style={{
        fontSize: 52, lineHeight: 1.02, margin: 0,
        fontWeight: 700, letterSpacing: "-0.035em",
        color: "#fff",
        marginBottom: 18,
      }}>
        Inteligência<br/>
        <span style={{ color: "var(--tech)" }}>que age.</span>
      </h2>
      <p style={{
        fontSize: 16, lineHeight: 1.55, color: "rgba(255,255,255,0.65)",
        maxWidth: 420, margin: 0, letterSpacing: "-0.003em",
      }}>
        Cadastra um produto e a IA escreve a descrição, otimiza a foto e publica em Shopee, ML e TikTok. Você foca em vender.
      </p>

      {/* Floating mockup card */}
      <div style={{
        marginTop: 36,
        background: "rgba(26,26,26,0.85)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: 18,
        maxWidth: 360,
        backdropFilter: "blur(8px)",
        boxShadow: "0 24px 48px -16px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Vendas hoje</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 600, color: "var(--tech)",
            padding: "2px 8px", borderRadius: 999, background: "rgba(0,196,106,0.16)",
          }}>
            <I.ArrowUp size={11}/> 12%
          </span>
        </div>
        <div style={{
          fontSize: 32, fontWeight: 700, letterSpacing: "-0.028em",
          fontVariantNumeric: "tabular-nums",
          color: "#fff", marginBottom: 14,
        }}>R$ 3.420,00</div>
        {/* Mini bars */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 36 }}>
          {[40, 55, 38, 70, 60, 82, 78].map((h, i) => (
            <div key={i} style={{
              flex: 1, height: `${h}%`,
              background: i === 6 ? "var(--tech)" : "rgba(0,196,106,0.35)",
              borderRadius: 3, minHeight: 4,
            }}/>
          ))}
        </div>
      </div>
    </div>

    {/* Bottom: social proof */}
    <div style={{ position: "relative", zIndex: 2, display: "flex", gap: 32, flexWrap: "wrap" }}>
      <HeroStat value="12.4k" label="lojistas ativos"/>
      <HeroStat value="2.1M" label="produtos cadastrados"/>
      <HeroStat value="98%" label="aprovação no suporte"/>
    </div>
  </div>
);

const HeroStat = ({ value, label }) => (
  <div>
    <div style={{
      fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em",
      fontVariantNumeric: "tabular-nums", color: "#fff",
    }}>{value}</div>
    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{label}</div>
  </div>
);

// Brand-friendly inline SSO icons
const SSOIcon = ({ kind }) => {
  if (kind === "google") return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.27c0-.71-.06-1.4-.18-2.07H12v3.91h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.22-4.74 3.22-7.92z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.57 6.57 0 0 1 5.48 12c0-.73.13-1.43.36-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.16-3.16C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
  if (kind === "apple") return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.4 12.4c0-2.7 2.2-4 2.3-4-1.3-1.8-3.2-2.1-3.9-2.1-1.6-.2-3.2.96-4 .96-.83 0-2.13-.93-3.5-.9-1.78.03-3.44 1.04-4.36 2.64-1.88 3.26-.48 8.07 1.34 10.72.9 1.3 1.95 2.74 3.34 2.7 1.34-.06 1.85-.87 3.47-.87 1.6 0 2.07.87 3.5.83 1.44-.02 2.36-1.32 3.24-2.62.7-.94 1.24-1.94 1.6-3.03-1.65-.6-2.99-2.27-3.03-4.32zM13.83 4.5c.72-.88 1.21-2.1 1.08-3.32-1.04.04-2.32.7-3.07 1.58-.67.77-1.27 2.01-1.11 3.2 1.17.09 2.37-.58 3.1-1.46z"/>
    </svg>
  );
  return null;
};

window.LoginScreen = LoginScreen;
