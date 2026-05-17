// Reusable UI building blocks (Logo, Button, Card, Badge, Avatar, Sparkline).
// Components are global via window assignment — match the file naming pattern.

const Logo = ({ size = 18, onDark = false, style }) => (
  <span className={"logo " + (onDark ? "logo-on-dark" : "")} style={{ fontSize: size, ...style }}>
    <span className="orc">ORC</span><span className="tech">tech</span>
  </span>
);

const Button = ({ children, variant = "primary", size, icon, iconRight, onClick, type, disabled, style, className = "", title, fullWidth }) => {
  const cls = ["btn", `btn-${variant}`, size ? `btn-${size}` : "", className, fullWidth ? "btn-full" : ""].filter(Boolean).join(" ");
  return (
    <button type={type || "button"} className={cls} onClick={onClick} disabled={disabled} title={title}
            style={fullWidth ? { width: "100%", ...style } : style}>
      {icon}{children}{iconRight}
    </button>
  );
};

const IconButton = ({ icon, size = "default", onClick, title, variant = "secondary" }) => (
  <button type="button" className={`btn btn-${variant} btn-icon ${size === "sm" ? "btn-sm" : ""}`} onClick={onClick} title={title}>
    {icon}
  </button>
);

const Badge = ({ children, tone = "neutral", dot = false }) => (
  <span className={`badge badge-${tone}`}>{dot ? <span className="dot"/> : null}{children}</span>
);

// Map a status string to a tone
const statusTone = (s) => {
  const k = s.toLowerCase();
  if (k.includes("pago") || k.includes("aprovado") || k.includes("ativo") || k.includes("confirma")) return "success";
  if (k.includes("aguard") || k.includes("estoque baixo") || k.includes("enviar") || k.includes("andamento") || k.includes("baixo")) return "warning";
  if (k.includes("recusad") || k.includes("esgotad") || k.includes("erro") || k.includes("cancel")) return "error";
  return "neutral";
};

// Deterministic color per name — uses a small curated palette compatible with brand neutrals.
const AVATAR_PALETTE = [
  { bg: "#FEEFE5", fg: "#9A3E12" }, // terracota
  { bg: "#E6F9F0", fg: "#00845A" }, // tech soft → deep green
  { bg: "#EAF2FF", fg: "#1E3A8A" }, // indigo
  { bg: "#FFEEF4", fg: "#9D174D" }, // rose
  { bg: "#F3E8FF", fg: "#5B21B6" }, // violet
  { bg: "#FEF7CD", fg: "#854D0E" }, // amber
  { bg: "#E0F2FE", fg: "#075985" }, // sky
  { bg: "#ECFCCB", fg: "#3F6212" }, // lime
];
function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

const Avatar = ({ name, size }) => {
  const initials = name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
  const c = avatarColor(name || "?");
  return (
    <span className={`avatar ${size === "lg" ? "avatar-lg" : ""}`}
          style={{ background: c.bg, color: c.fg, borderColor: "transparent" }}>
      {initials}
    </span>
  );
};

// Tiny sparkline (SVG). values = [n,n,n…]
const Sparkline = ({ values, height = 36, width = 120, color = "var(--tech)", strokeWidth = 1.75, fill = true }) => {
  if (!values?.length) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const pts = values.map((v, i) => [i * stepX, height - 4 - ((v - min) / range) * (height - 8)]);
  const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = d + ` L ${width},${height} L 0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block", overflow: "visible" }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={`sg-${values.join("-")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#sg-${values.join("-")})`} stroke="none"/>
        </>
      )}
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts.at(-1)[0]} cy={pts.at(-1)[1]} r="3" fill={color}/>
    </svg>
  );
};

// Bar chart (mini)
const MiniBars = ({ values, height = 60, color = "var(--tech)", labels }) => {
  const max = Math.max(...values) || 1;
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 6, height, width: "100%" }}>
      {values.map((v, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 4, height: "100%" }}>
          <div style={{ width: "100%", height: `${(v / max) * 100}%`, minHeight: 4, background: color, borderRadius: 4, opacity: i === values.length - 1 ? 1 : 0.55 }}/>
          {labels?.[i] && <span style={{ fontSize: 10, color: "var(--text-faint)", flexShrink: 0 }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

// Donut for share-of-something
const Donut = ({ segments, size = 96, stroke = 14 }) => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke}/>
      {segments.map((s, i) => {
        const len = (s.value / total) * c;
        const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
                           strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} strokeLinecap="butt"/>;
        offset += len;
        return el;
      })}
    </svg>
  );
};

// Modal shell — overlay covers parent .app-root (positioned relative)
const Modal = ({ open, onClose, children, title, width = 560, footer }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}
         style={{
           position: "absolute", inset: 0, background: "rgba(10,10,10,0.45)",
           display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60,
           padding: 16
         }}>
      <div onClick={e => e.stopPropagation()} className="card"
           style={{ width, maxWidth: "100%", maxHeight: "90%", overflow: "auto", padding: 0, boxShadow: "var(--shadow-pop)" }}>
        {title && (
          <div className="between" style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
            <h3 className="t-h3" style={{ margin: 0 }}>{title}</h3>
            <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}><I.X size={16}/></button>
          </div>
        )}
        <div style={{ padding: 24 }}>{children}</div>
        {footer && <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</div>}
      </div>
    </div>
  );
};

// Slide-over (right drawer)
const Drawer = ({ open, onClose, children, title, width = 420 }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 70, background: "rgba(10,10,10,0.4)" }}>
      <div onClick={e => e.stopPropagation()}
           style={{
             position: "absolute", top: 0, bottom: 0, right: 0, width, maxWidth: "100%",
             background: "var(--bg-elev)", borderLeft: "1px solid var(--border)",
             boxShadow: "var(--shadow-pop)", display: "flex", flexDirection: "column",
             animation: "slideright 220ms ease",
           }}>
        <div className="between" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 className="t-h3" style={{ margin: 0 }}>{title}</h3>
          <button className="btn btn-secondary btn-icon btn-sm" onClick={onClose}><I.X size={16}/></button>
        </div>
        <div style={{ padding: 20, overflow: "auto", flex: 1 }}>{children}</div>
      </div>
      <style>{`@keyframes slideright { from { transform: translateX(20px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>
    </div>
  );
};

const Toast = ({ visible, message, tone = "success" }) => {
  if (!visible) return null;
  return (
    <div className={`toast toast-${tone}`}>
      <span className="toast-dot" style={{ width: 8, height: 8, borderRadius: 999, background: "var(--tech)" }}/>
      <span>{message}</span>
    </div>
  );
};

// Channel pill (Shopee/ML/etc) — neutral text, no brand colors per brandbook
const ChannelPill = ({ name }) => (
  <span className="badge badge-neutral" style={{ fontSize: 11 }}>{name}</span>
);

// Section header inside a page
const SectionHead = ({ title, action, hint }) => (
  <div className="between" style={{ marginBottom: 12 }}>
    <div>
      <div className="t-h3">{title}</div>
      {hint && <div className="t-caption t-muted" style={{ marginTop: 2 }}>{hint}</div>}
    </div>
    {action}
  </div>
);

Object.assign(window, {
  Logo, Button, IconButton, Badge, Avatar, Sparkline, MiniBars, Donut, Modal, Drawer, Toast, ChannelPill, SectionHead, statusTone,
});
