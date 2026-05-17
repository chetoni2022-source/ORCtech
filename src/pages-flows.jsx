// New record flows (Cliente, Venda) + Locked module upsell screen

// --- Novo Cliente ---
const NovoCliente = ({ navigate, isMobile, onToast }) => {
  const [name, setName] = React.useState("");
  const [tab, setTab] = React.useState("pessoa"); // pessoa | empresa
  const save = () => {
    onToast("Cliente cadastrado com sucesso");
    setTimeout(() => navigate("clientes"), 500);
  };

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("clientes")}>
          <I.ChevLeft size={14}/> Clientes
        </button>
      </div>
      <h1 className="t-h1" style={{ marginBottom: 4 }}>Novo cliente</h1>
      <p className="t-muted" style={{ marginBottom: 24 }}>Comece com os dados básicos. Você completa o resto depois.</p>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: 16 }}>
        <div className="card">
          {/* Tipo */}
          <div className="row" style={{ gap: 6, marginBottom: 20, background: "var(--bg-sunken)", padding: 4, borderRadius: 10, width: "fit-content" }}>
            {[["pessoa", "Pessoa física"], ["empresa", "Empresa"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)}
                      style={{
                        padding: "6px 14px", borderRadius: 8, border: 0, cursor: "pointer",
                        background: tab === k ? "var(--bg-elev)" : "transparent",
                        color: tab === k ? "var(--text)" : "var(--text-muted)",
                        fontWeight: 600, fontSize: 13, fontFamily: "inherit",
                        boxShadow: tab === k ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                      }}>{l}</button>
            ))}
          </div>

          <SectionHead title="Dados básicos"/>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div className="field" style={{ gridColumn: isMobile ? "auto" : "1 / -1" }}>
              <label className="field-label">{tab === "pessoa" ? "Nome completo" : "Razão social"}</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder={tab === "pessoa" ? "Ex: Mariana Castelli" : "Ex: Atelier Maré LTDA"}/>
            </div>
            <div className="field">
              <label className="field-label">{tab === "pessoa" ? "CPF" : "CNPJ"}</label>
              <input className="input mono" placeholder={tab === "pessoa" ? "000.000.000-00" : "00.000.000/0000-00"}/>
            </div>
            <div className="field">
              <label className="field-label">{tab === "pessoa" ? "Nascimento" : "Inscrição estadual"}</label>
              <input className="input mono" placeholder={tab === "pessoa" ? "DD/MM/AAAA" : "Opcional"}/>
            </div>
          </div>

          <SectionHead title="Contato"/>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div className="field">
              <label className="field-label">E-mail</label>
              <div className="input-icon-wrap"><span className="input-icon"><I.Mail size={16}/></span>
                <input className="input" placeholder="voce@email.com"/>
              </div>
            </div>
            <div className="field">
              <label className="field-label">WhatsApp / Telefone</label>
              <div className="input-icon-wrap"><span className="input-icon"><I.Phone size={16}/></span>
                <input className="input mono" placeholder="(00) 00000-0000"/>
              </div>
            </div>
          </div>

          <SectionHead title="Endereço"/>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "120px 1fr 1fr", gap: 12 }}>
            <div className="field">
              <label className="field-label">CEP</label>
              <input className="input mono" placeholder="00000-000"/>
            </div>
            <div className="field" style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
              <label className="field-label">Endereço</label>
              <input className="input" placeholder="Rua, número, complemento"/>
            </div>
            <div className="field">
              <label className="field-label">Cidade</label>
              <input className="input"/>
            </div>
            <div className="field">
              <label className="field-label">UF</label>
              <input className="input mono" placeholder="SP"/>
            </div>
            <div className="field">
              <label className="field-label">Tags</label>
              <input className="input" placeholder="VIP, atacado…"/>
            </div>
          </div>
        </div>

        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <SectionHead title="Prévia"/>
            <div className="row" style={{ gap: 12, marginBottom: 14 }}>
              <Avatar name={name || "Novo cliente"} size="lg"/>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name || "Novo cliente"}</div>
                <div className="t-caption t-muted">Sem histórico ainda</div>
              </div>
            </div>
            <div className="col" style={{ gap: 6 }}>
              <div className="between"><span className="t-caption t-muted">Pedidos</span><span className="mono">0</span></div>
              <div className="between"><span className="t-caption t-muted">Total gasto</span><span className="mono">R$ 0,00</span></div>
              <div className="between"><span className="t-caption t-muted">Cadastrado em</span><span className="mono">Hoje</span></div>
            </div>
          </div>
          <div className="col" style={{ gap: 8 }}>
            <Button variant="primary" fullWidth icon={<I.Check size={16}/>} onClick={save} disabled={!name}>
              Salvar cliente
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate("clientes")}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Nova Venda (PDV) ---
const NovaVenda = ({ navigate, isMobile, onToast }) => {
  const [cart, setCart] = React.useState([
    { id: PRODUCTS[4].id, name: PRODUCTS[4].name, price: PRODUCTS[4].price, image: PRODUCTS[4].image, qty: 2 },
  ]);
  const [customer, setCustomer] = React.useState(null);
  const [channel, setChannel] = React.useState("Loja");
  const [payment, setPayment] = React.useState("pix");
  const [discount, setDiscount] = React.useState(0);
  const [showCustomerPicker, setShowCustomerPicker] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - discount);

  const addProduct = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 }];
    });
  };
  const updQty = (id, delta) => setCart(prev => prev.flatMap(i => {
    if (i.id !== id) return [i];
    const q = i.qty + delta;
    return q <= 0 ? [] : [{ ...i, qty: q }];
  }));
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const finish = () => {
    onToast(`Venda registrada · ${fmtBRL(total)}`);
    setTimeout(() => navigate("loja/vendas"), 600);
  };

  const available = PRODUCTS.filter(p =>
    p.stock > 0 &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate("loja/vendas")}>
          <I.ChevLeft size={14}/> Vendas
        </button>
      </div>
      <div className="page-head">
        <div>
          <h1 className="t-h1">Nova venda</h1>
          <p>Registre uma venda manualmente. Marketplace é integrado automaticamente.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: 16 }}>
        {/* Left — Product picker + Cart */}
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <SectionHead title="Adicionar produto" hint="Busque por nome ou SKU. Clique pra adicionar ao carrinho."/>
            <div className="input-icon-wrap" style={{ marginBottom: 12 }}>
              <span className="input-icon"><I.Search size={16}/></span>
              <input className="input" placeholder="Buscar produto…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 8, maxHeight: 280, overflowY: "auto" }}>
              {available.slice(0, 6).map(p => (
                <button key={p.id} onClick={() => addProduct(p)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: 10,
                          border: "1px solid var(--border)", borderRadius: 10,
                          background: "var(--bg-elev)", cursor: "pointer", textAlign: "left",
                          fontFamily: "inherit", color: "inherit",
                        }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{p.image}</div>
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                    <div className="t-caption t-muted mono">{fmtBRL(p.price)} · {p.stock} em estoque</div>
                  </div>
                  <I.Plus size={16} style={{ color: "var(--tech)", flexShrink: 0 }}/>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "20px 24px 12px" }}>
              <SectionHead title={`Carrinho · ${cart.length} ${cart.length === 1 ? "item" : "itens"}`}/>
            </div>
            {cart.length === 0 ? (
              <div className="empty">
                <I.Cart size={28}/>
                <div style={{ fontWeight: 600, color: "var(--text)" }}>Carrinho vazio</div>
                <div className="t-caption">Adicione produtos acima</div>
              </div>
            ) : (
              <div>
                {cart.map(it => (
                  <div key={it.id} className="row" style={{ padding: "14px 24px", gap: 14, borderTop: "1px solid var(--border)" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{it.image}</div>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div>
                      <div className="t-caption t-muted mono">{fmtBRL(it.price)} cada</div>
                    </div>
                    <div className="row" style={{ gap: 6 }}>
                      <button className="btn btn-secondary btn-icon btn-sm" onClick={() => updQty(it.id, -1)}><I.X size={12}/></button>
                      <span className="mono" style={{ minWidth: 28, textAlign: "center", fontWeight: 600 }}>{it.qty}</span>
                      <button className="btn btn-secondary btn-icon btn-sm" onClick={() => updQty(it.id, +1)}><I.Plus size={12}/></button>
                    </div>
                    <div className="mono" style={{ width: 90, textAlign: "right", fontWeight: 600 }}>{fmtBRL(it.price * it.qty)}</div>
                    {!isMobile && (
                      <button className="btn btn-secondary btn-icon btn-sm" onClick={() => removeItem(it.id)} title="Remover">
                        <I.Trash size={14}/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Customer, channel, payment, total */}
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <SectionHead title="Cliente"/>
            {customer ? (
              <div className="between">
                <div className="row" style={{ gap: 10 }}>
                  <Avatar name={customer.name}/>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{customer.name}</div>
                    <div className="t-caption t-muted">{customer.city}</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setCustomer(null)}>Trocar</button>
              </div>
            ) : (
              <Button variant="secondary" fullWidth icon={<I.Plus size={14}/>} onClick={() => setShowCustomerPicker(true)}>
                Selecionar cliente
              </Button>
            )}
          </div>

          <div className="card">
            <SectionHead title="Canal"/>
            <div className="col" style={{ gap: 6 }}>
              {["Loja", "Shopee", "ML", "TikTok"].map(c => (
                <button key={c} onClick={() => setChannel(c)}
                        style={{
                          padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                          border: "1px solid " + (channel === c ? "var(--tech)" : "var(--border)"),
                          background: channel === c ? "var(--tech-soft)" : "var(--bg-elev)",
                          color: "var(--text)", fontWeight: 500, fontSize: 13,
                          textAlign: "left", fontFamily: "inherit",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                  <span>{c}</span>
                  {channel === c && <I.Check size={14} style={{ color: "var(--tech)" }}/>}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <SectionHead title="Pagamento"/>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
              {[["pix", "PIX"], ["cred", "Crédito"], ["deb", "Débito"], ["din", "Dinheiro"]].map(([k, l]) => (
                <button key={k} onClick={() => setPayment(k)}
                        style={{
                          padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                          border: "1px solid " + (payment === k ? "var(--tech)" : "var(--border)"),
                          background: payment === k ? "var(--tech-soft)" : "var(--bg-elev)",
                          color: payment === k ? "var(--tech-deep)" : "var(--text)",
                          fontWeight: 600, fontSize: 13,
                        }}>{l}</button>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: "var(--bg-sunken)" }}>
            <div className="col" style={{ gap: 8 }}>
              <div className="between"><span className="t-muted">Subtotal</span><span className="mono">{fmtBRL(subtotal)}</span></div>
              <div className="between">
                <span className="t-muted">Desconto</span>
                <input className="input mono" value={discount} onChange={e => setDiscount(Number(e.target.value) || 0)}
                       style={{ width: 100, textAlign: "right", height: 30, fontSize: 13 }}/>
              </div>
              <div className="divider"/>
              <div className="between" style={{ alignItems: "baseline" }}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span className="mono" style={{ fontWeight: 700, fontSize: 22, letterSpacing: -0.01 }}>{fmtBRL(total)}</span>
              </div>
            </div>
          </div>

          <Button variant="primary" fullWidth size="lg" icon={<I.Check size={18}/>} onClick={finish} disabled={cart.length === 0}>
            Finalizar venda
          </Button>
        </div>
      </div>

      {/* Customer picker modal */}
      <Modal open={showCustomerPicker} onClose={() => setShowCustomerPicker(false)} title="Selecionar cliente" width={500}>
        <div className="input-icon-wrap" style={{ marginBottom: 12 }}>
          <span className="input-icon"><I.Search size={16}/></span>
          <input className="input" placeholder="Buscar cliente…"/>
        </div>
        <div className="col" style={{ gap: 6, maxHeight: 320, overflowY: "auto" }}>
          {CUSTOMERS.map(c => (
            <button key={c.id} onClick={() => { setCustomer(c); setShowCustomerPicker(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: 10,
                      border: 0, background: "transparent", cursor: "pointer",
                      borderRadius: 8, textAlign: "left", fontFamily: "inherit", color: "inherit",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-sunken)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <Avatar name={c.name}/>
              <div className="grow" style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                <div className="t-caption t-muted">{c.email}</div>
              </div>
              {c.tag && <Badge tone={c.tag === "VIP" ? "success" : "neutral"}>{c.tag}</Badge>}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

// --- Blocked module / upsell page ---
const BlockedModule = ({ navigate, isMobile, module, onContract }) => {
  const cfg = module === "orca"
    ? {
        title: "ORCtech Orça",
        tagline: "Gestor de orçamentos com IA",
        description: "Monte orçamentos em segundos, envie por WhatsApp e acompanhe a aprovação. Ideal para oficinas, instaladores e prestadores de serviço.",
        price: "R$ 197 a R$ 697 / mês",
        features: [
          "IA monta o orçamento a partir de áudio ou texto livre",
          "Envio automático por WhatsApp com link de aprovação",
          "Agenda integrada com lembretes",
          "Histórico completo por cliente e veículo",
          "Catálogo de serviços e peças com preços padrão",
        ],
      }
    : {
        title: "ORCtech Loja",
        tagline: "ERP com IA para varejistas",
        description: "Cadastre um produto e a IA escreve a descrição, otimiza a foto e publica em Shopee, Mercado Livre e TikTok. Estoque, vendas e financeiro em um lugar só.",
        price: "R$ 297 a R$ 997 / mês",
        features: [
          "IA escreve descrição e título otimizados",
          "Publicação em 4 marketplaces com 1 clique",
          "Controle de estoque centralizado",
          "Sugestão de preço baseada no mercado",
          "Painel de vendas com taxas e margem",
        ],
      };

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="card" style={{
        padding: isMobile ? 24 : 40,
        background: "linear-gradient(180deg, var(--tech-soft) 0%, var(--bg-elev) 60%)",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "var(--tech)", color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
          boxShadow: "0 8px 24px rgba(0,196,106,0.3)",
        }}>
          <I.Lock size={28} stroke={2}/>
        </div>
        <div className="ia-chip" style={{ marginBottom: 12 }}>
          <I.Sparkles size={12}/> Módulo não contratado
        </div>
        <h1 className="t-h1" style={{ marginBottom: 8 }}>{cfg.title}</h1>
        <p className="t-body-l" style={{ color: "var(--text-muted)", maxWidth: 480, margin: "0 auto 8px" }}>{cfg.tagline}</p>
        <p className="t-body" style={{ color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 24px" }}>{cfg.description}</p>

        <div className="row" style={{ justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          <Button variant="primary" size="lg" icon={<I.Sparkles size={16}/>} onClick={onContract}>
            Ativar trial gratuito · 14 dias
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate("configuracoes")}>
            Falar com vendas
          </Button>
        </div>
        <div className="t-caption t-muted">A partir de <span className="mono" style={{ fontWeight: 600, color: "var(--text)" }}>{cfg.price}</span> · Combo Loja + Orça com desconto</div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <SectionHead title="O que vem incluído"/>
        <div className="col" style={{ gap: 12 }}>
          {cfg.features.map((f, i) => (
            <div key={i} className="row" style={{ gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "var(--tech-soft)", color: "var(--tech-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <I.Check size={14} stroke={2.2}/>
              </div>
              <span style={{ fontSize: 14, lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { NovoCliente, NovaVenda, BlockedModule });
