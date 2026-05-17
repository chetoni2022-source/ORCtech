// Mock data for the ORCtech prototype.
// All values are realistic BR market data — names, prices, services.

const PRODUCTS = [
  { id: "p_1042", sku: "VS-0421", name: "Vestido midi linho terracota",  category: "Vestidos",   price: 189.90, stock: 14, lowStock: 5, channels: ["Shopee","ML","Loja"], status: "Ativo", image: "🌅", margin: 62, sold30d: 38 },
  { id: "p_1041", sku: "AN-0118", name: "Anel falange folheado ouro 18k",  category: "Semi-jóias", price: 49.90,  stock: 3,  lowStock: 5, channels: ["Shopee","TikTok"], status: "Ativo", image: "💍", margin: 71, sold30d: 92 },
  { id: "p_1040", sku: "BL-2210", name: "Blusa cropped canelada off-white", category: "Blusas",     price: 79.90,  stock: 27, lowStock: 8, channels: ["ML","Loja"], status: "Ativo", image: "👚", margin: 58, sold30d: 24 },
  { id: "p_1039", sku: "TN-0089", name: "Tênis chunky branco solado caramelo", category: "Calçados", price: 259.90, stock: 0,  lowStock: 3, channels: ["Shopee","ML","TikTok"], status: "Esgotado", image: "👟", margin: 44, sold30d: 17 },
  { id: "p_1038", sku: "BR-0712", name: "Brinco argola lisa pequena",   category: "Semi-jóias", price: 34.90,  stock: 41, lowStock: 10, channels: ["Shopee","ML","TikTok","Loja"], status: "Ativo", image: "✨", margin: 68, sold30d: 113 },
  { id: "p_1037", sku: "BO-3301", name: "Bolsa saco couro sintético cognac",  category: "Bolsas",  price: 219.90, stock: 8,  lowStock: 4, channels: ["Shopee","Loja"], status: "Ativo", image: "👜", margin: 55, sold30d: 9 },
  { id: "p_1036", sku: "CL-1820", name: "Colar gargantilha pingente coração",  category: "Semi-jóias", price: 89.90, stock: 22, lowStock: 6, channels: ["Shopee","TikTok"], status: "Ativo", image: "💎", margin: 64, sold30d: 41 },
  { id: "p_1035", sku: "SA-9077", name: "Saia midi plissada preta",       category: "Saias",      price: 149.90, stock: 4,  lowStock: 6, channels: ["ML","Loja"], status: "Ativo", image: "🖤", margin: 60, sold30d: 11 },
];

const SALES_TODAY = [
  { id: "v_8821", channel: "Shopee",   product: "Brinco argola lisa pequena", customer: "Mariana C.", price: 34.90,  fee: 6.28, net: 28.62, time: "14:32", status: "Pago" },
  { id: "v_8820", channel: "Loja",     product: "Vestido midi linho terracota", customer: "Cliente balcão", price: 189.90, fee: 0, net: 189.90, time: "13:58", status: "Pago" },
  { id: "v_8819", channel: "ML",       product: "Blusa cropped canelada off-white", customer: "Patrícia A.", price: 79.90,  fee: 12.78, net: 67.12, time: "13:14", status: "Enviar" },
  { id: "v_8818", channel: "TikTok",   product: "Colar gargantilha pingente coração", customer: "Júlia M.", price: 89.90, fee: 9.89, net: 80.01, time: "11:47", status: "Pago" },
  { id: "v_8817", channel: "Shopee",   product: "Anel falange folheado ouro 18k", customer: "Rafaela L.", price: 49.90, fee: 8.98, net: 40.92, time: "10:22", status: "Enviar" },
  { id: "v_8816", channel: "Loja",     product: "Bolsa saco couro sintético cognac", customer: "Eduarda P.", price: 219.90, fee: 0, net: 219.90, time: "09:51", status: "Pago" },
];

const CUSTOMERS = [
  { id: "c_201", name: "Mariana Castelli",   email: "mari.castelli@email.com",  phone: "(11) 98421-0721", city: "São Paulo, SP",  orders: 7,  total: 1284.30, lastOrder: "Hoje",     tag: "VIP" },
  { id: "c_202", name: "Patrícia Almeida",   email: "patri.almeida@email.com",  phone: "(21) 99102-3340", city: "Niterói, RJ",    orders: 3,  total: 412.70,  lastOrder: "Hoje",     tag: "Recorrente" },
  { id: "c_203", name: "Júlia Mendonça",     email: "ju.mendonca@email.com",    phone: "(31) 98744-1928", city: "Belo Horizonte, MG", orders: 12, total: 2941.10, lastOrder: "Ontem",  tag: "VIP" },
  { id: "c_204", name: "Rafaela Lima",       email: "rafa.lima@email.com",      phone: "(85) 99238-7124", city: "Fortaleza, CE",  orders: 2,  total: 134.80,  lastOrder: "3 dias",   tag: "" },
  { id: "c_205", name: "Eduarda Pacheco",    email: "edu.pacheco@email.com",    phone: "(48) 99421-0982", city: "Florianópolis, SC", orders: 5, total: 891.40, lastOrder: "Ontem",  tag: "Recorrente" },
  { id: "c_206", name: "Bruna Tavares",      email: "bru.tavares@email.com",    phone: "(11) 98842-5510", city: "Guarulhos, SP",  orders: 1,  total: 89.90,   lastOrder: "5 dias",   tag: "Novo" },
  { id: "c_207", name: "Larissa Bittencourt",email: "lari.b@email.com",          phone: "(41) 99178-3325", city: "Curitiba, PR",   orders: 9,  total: 1742.00, lastOrder: "1 sem",  tag: "Recorrente" },
];

// — Orça —
const ORCAMENTOS = [
  { id: "o_30214", client: "André Marinho",   service: "Troca de pastilhas + óleo motor", vehicle: "Honda Civic 2019", total: 920.00, status: "Aprovado",    sent: "14:02", validUntil: "20/05", channel: "WhatsApp" },
  { id: "o_30213", client: "Marta Schneider", service: "Reparo de funilaria — porta traseira", vehicle: "VW Polo 2021", total: 1840.00, status: "Aguardando", sent: "13:18", validUntil: "22/05", channel: "WhatsApp" },
  { id: "o_30212", client: "Bruno Vasques",   service: "Instalação ar split 12k BTU",      vehicle: "—",              total: 680.00,  status: "Aprovado",    sent: "11:47", validUntil: "18/05", channel: "Telefone" },
  { id: "o_30211", client: "Carla Domingos",  service: "Troca quadro elétrico residencial",vehicle: "—",              total: 2340.00, status: "Recusado",    sent: "Ontem",  validUntil: "—",      channel: "WhatsApp" },
  { id: "o_30210", client: "Lucas Pereira",   service: "Conserto de placa-mãe + fonte",    vehicle: "—",              total: 480.00,  status: "Aprovado",    sent: "Ontem",  validUntil: "19/05", channel: "Loja" },
  { id: "o_30209", client: "Renata Quirino",  service: "Desentupimento + troca de sifão",  vehicle: "—",              total: 320.00,  status: "Aguardando", sent: "Ontem",  validUntil: "16/05", channel: "WhatsApp" },
  { id: "o_30208", client: "Fábio Antunes",   service: "Manutenção preventiva 20k km",     vehicle: "Toyota Corolla 2020", total: 750.00, status: "Aprovado",    sent: "2 dias", validUntil: "16/05", channel: "WhatsApp" },
];

const AGENDA_HOJE = [
  { time: "09:00", duration: 90,  client: "André Marinho",   service: "Pastilhas + óleo",       status: "Em andamento" },
  { time: "10:30", duration: 60,  client: "Lucas Pereira",   service: "Placa-mãe + fonte",       status: "Aguardando" },
  { time: "13:00", duration: 120, client: "Marta Schneider", service: "Funilaria — porta TE",    status: "Confirmado" },
  { time: "15:30", duration: 45,  client: "Renata Quirino",  service: "Desentupimento sifão",    status: "Confirmado" },
  { time: "17:00", duration: 90,  client: "Fábio Antunes",   service: "Preventiva 20k km",       status: "Confirmado" },
];

// 7-day sparkline values (vendas R$)
const VENDAS_7D = [2120, 2480, 1980, 3160, 2740, 3580, 3420];
const ORCAS_7D  = [12, 18, 14, 22, 19, 24, 21];

const NOTIFICATIONS = [
  { id: "n_1", icon: "Warn",  tone: "warning", title: "Estoque baixo", body: "Anel falange folheado · 3 un. restantes", time: "5 min" },
  { id: "n_2", icon: "Money", tone: "success", title: "Venda aprovada", body: "Shopee · R$ 34,90 · Mariana C.", time: "12 min" },
  { id: "n_3", icon: "Receipt", tone: "neutral", title: "Orçamento aprovado", body: "André Marinho aprovou R$ 920,00", time: "1 h" },
  { id: "n_4", icon: "Truck", tone: "neutral", title: "Pedido para postar", body: "ML · Patrícia A. · prazo D+1", time: "2 h" },
];

// brl formatter
const BRL = (n) => "R$ " + n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/(?<=,\d{2})\..+/, "");
const fmtBRL = (n) => "R$ " + new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtInt = (n) => new Intl.NumberFormat("pt-BR").format(n);

Object.assign(window, {
  PRODUCTS, SALES_TODAY, CUSTOMERS, ORCAMENTOS, AGENDA_HOJE,
  VENDAS_7D, ORCAS_7D, NOTIFICATIONS,
  fmtBRL, fmtInt,
});
