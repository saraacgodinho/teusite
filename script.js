const massas = [
  { nome: "Pappardelle Fresche", preco: 2.5, img: "pappardele.webp", categoria: "Massas simples" },
  { nome: "Fettuccine Fresche", preco: 2.5, img: "fettucini.jpg", categoria: "Massas simples" },
  { nome: "Cavatelli Artigianali", preco: 2.5, img: "cavatelli.webp", categoria: "Massas simples" },
  { nome: "Spaghetti Freschi", preco: 2.5, img: "spagheti.jpg", categoria: "Massas simples" },
  { nome: "Lasagne Fresche (placas)", preco: 2.5, img: "lasanha.jpg", categoria: "Massas simples" },
  { nome: "Gnocchi di Patate", preco: 3.2, img: "gnochi.avif", categoria: "Especial" },
  { nome: "Ravioli Ricotta e Spinaci", preco: 4.2, img: "ravioliriesp.jpg", categoria: "Ravioli premium" },
  { nome: "Ravioli Pollo e Pancetta", preco: 4.8, img: "raviolifrangoebacon.jpg", categoria: "Ravioli premium" }
];

const paes = [
  { nome: "Bola de Água", preco: 0.8, img: "bolasdeagua.jpg", categoria: "Simples" },
  { nome: "Pão Pita", preco: 1.0, img: "paopita.jpg", categoria: "Simples" },
  { nome: "Ciabatta", preco: 2.2, img: "ciabatta.jpeg", categoria: "Tradicional artesanal" },
  { nome: "Pão de Mafra", preco: 2.5, img: "paodemafra.webp", categoria: "Tradicional artesanal" },
  { nome: "Pão Alentejano", preco: 2.8, img: "paoalentejano.jpg", categoria: "Tradicional artesanal" },
  { nome: "Pão Australiano", preco: 2.8, img: "australiano.jpg.webp", categoria: "Especiais" },
  { nome: "Brioche Artesanal", preco: 2.5, img: "brioche.jpg", categoria: "Especiais" },
  { nome: "Pão com Chouriço", preco: 3.5, img: "paocomchourico.jpg", categoria: "Valor acrescentado" }
];

const croissants = [
  { nome: "Croissant da Casa", preco: 2.0, img: "croissantdacasa.jpg", categoria: "Simples" },
  { nome: "Manteiga & Doce", preco: 2.5, img: "manteigaedoce.webp", categoria: "Recheio premium" },
  { nome: "Chocolate", preco: 2.8, img: "chocolate.webp", categoria: "Recheio premium" },
  { nome: "Ovo & Bacon", preco: 3.5, img: "ovoebacon.png", categoria: "Recheio premium" },
  { nome: "Frango Cremoso", preco: 3.8, img: "frangocremoso.webp", categoria: "Recheio premium" },
  { nome: "Queijo & Fiambre", preco: 3.2, img: "queijofiambre.jpg", categoria: "Recheio premium" }
];

const combos = [
  { nome: "Pack Família", preco: 6.0, img: "paodemafra.webp", categoria: "Combo", descricao: "2 pães + 1 massa" },
  { nome: "Pack Jantar", preco: 6.5, img: "ravioliriesp.jpg", categoria: "Combo", descricao: "Ravioli + pão" },
  { nome: "Pack Pequeno-almoço", preco: 3.0, img: "croissantdacasa.jpg", categoria: "Combo", descricao: "Croissant + pão" }
];

let cart = JSON.parse(localStorage.getItem("trigo_cart")) || [];
let users = JSON.parse(localStorage.getItem("trigo_users")) || [];
let currentUser = JSON.parse(localStorage.getItem("trigo_current_user")) || null;

const DELIVERY_PRICE = 3.5;
const FREE_DELIVERY_THRESHOLD = 15;
const GIFT_EVERY_ITEMS = 20;

const categorias = {
  massas: { titulo: "🍝 Massas frescas", items: massas },
  paes: { titulo: "🍞 Pão artesanal", items: paes },
  croissants: { titulo: "🥐 Croissants", items: croissants },
  combos: { titulo: "📦 Combos", items: combos }
};

const destaquesGrid = document.getElementById("destaquesGrid");
const catalogoGrid = document.getElementById("catalogoGrid");
const catalogoTitulo = document.getElementById("catalogoTitulo");
const catalogoMenu = document.getElementById("catalogoMenu");

const categoriaBtns = document.querySelectorAll(".categoria-btn");
const menuCategoriaLinks = document.querySelectorAll(".menu-categoria-link");
const produtosMenuLink = document.getElementById("produtosMenuLink");
const produtosDropdown = document.getElementById("produtosDropdown");
const produtosDropdownContent = document.getElementById("produtosDropdownContent");

const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartCount = document.getElementById("cart-count");
const subtotalValue = document.getElementById("subtotalValue");
const discountValue = document.getElementById("discountValue");
const deliveryValue = document.getElementById("deliveryValue");
const totalValue = document.getElementById("totalValue");
const userStatus = document.getElementById("userStatus");
const giftInfo = document.getElementById("giftInfo");

const toggleSobreBtn = document.getElementById("toggleSobre");
const textoSobre = document.getElementById("textoSobre");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const enviarBtn = document.getElementById("enviarBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

function formatPrice(value) {
  return value.toFixed(2).replace(".", ",") + "€";
}

function saveCart() {
  localStorage.setItem("trigo_cart", JSON.stringify(cart));
}

function saveUsers() {
  localStorage.setItem("trigo_users", JSON.stringify(users));
}

function saveCurrentUser() {
  localStorage.setItem("trigo_current_user", JSON.stringify(currentUser));
}

function getFeaturedProducts() {
  return [...massas, ...paes, ...croissants, ...combos]
    .sort((a, b) => b.preco - a.preco)
    .slice(0, 4);
}

function renderCards(list, container) {
  if (!container) return;

  container.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "produto-card";
    card.innerHTML = `
      <img src="imagens/${item.img}" alt="${item.nome}" class="produto-imagem">
      <div class="produto-info">
        <span class="categoria-tag">${item.categoria}</span>
        <h4>${item.nome}</h4>
        <p>${item.descricao ? item.descricao : "Produto artesanal preparado com cuidado e sabor autêntico."}</p>
        <div class="preco">${formatPrice(item.preco)}</div>
        <button class="btn-principal full">Adicionar ao carrinho</button>
      </div>
    `;

    const button = card.querySelector("button");
    if (button) {
      button.addEventListener("click", () => addToCart(item));
    }

    container.appendChild(card);
  });
}

function renderCatalogo(categoryKey) {
  const categoria = categorias[categoryKey];
  if (!categoria || !catalogoGrid || !catalogoTitulo) return;

  catalogoTitulo.textContent = categoria.titulo;
  renderCards(categoria.items, catalogoGrid);

  categoriaBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === categoryKey);
  });
}

function fecharDropdownProdutos() {
  if (produtosDropdown) {
    produtosDropdown.classList.remove("open");
  }
}

function abrirDropdownProdutos() {
  if (produtosDropdown) {
    produtosDropdown.classList.add("open");
  }
}

function toggleDropdownProdutos() {
  if (produtosDropdown) {
    produtosDropdown.classList.toggle("open");
  }
}

function abrirCategoria(categoryKey) {
  renderCatalogo(categoryKey);
  fecharDropdownProdutos();

  if (catalogoMenu) {
    catalogoMenu.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function addToCart(product) {
  cart.push(product);
  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function getSubtotal() {
  return cart.reduce((acc, item) => acc + item.preco, 0);
}

function getDiscount(subtotal) {
  if (currentUser && currentUser.firstOrder === true) {
    return subtotal * 0.10;
  }
  return 0;
}

function getDeliveryCost(subtotal) {
  if (cart.length === 0) return 0;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_PRICE;
}

function getGiftCount() {
  return Math.floor(cart.length / GIFT_EVERY_ITEMS);
}

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";
  if (cartCount) cartCount.textContent = cart.length;

  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.style.display = "block";
    if (giftInfo) giftInfo.classList.add("escondido");
  } else {
    if (cartEmpty) cartEmpty.style.display = "none";
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div>
        <strong>${item.nome}</strong>
        <span>${item.categoria} • ${formatPrice(item.preco)}</span>
      </div>
      <div>${formatPrice(item.preco)}</div>
      <button class="btn-remover" data-index="${index}">Remover</button>
    `;
    cartItems.appendChild(li);
  });

  document.querySelectorAll(".btn-remover").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.index)));
  });

  const subtotal = getSubtotal();
  const discount = getDiscount(subtotal);
  const deliveryCost = getDeliveryCost(subtotal);
  const total = subtotal - discount + deliveryCost;
  const giftCount = getGiftCount();

  if (subtotalValue) subtotalValue.textContent = formatPrice(subtotal);
  if (discountValue) discountValue.textContent = "-" + formatPrice(discount);
  if (deliveryValue) deliveryValue.textContent = formatPrice(deliveryCost);
  if (totalValue) totalValue.textContent = formatPrice(total);

  if (giftInfo) {
    if (giftCount > 0) {
      giftInfo.classList.remove("escondido");
      giftInfo.textContent = `Oferta ativa: tens direito a ${giftCount} saco(s) de pão com 4 unidades.`;
    } else {
      giftInfo.classList.add("escondido");
    }
  }
}

function updateUserStatus() {
  if (!userStatus) return;

  if (!currentUser) {
    userStatus.textContent = "Não tens sessão iniciada.";
    return;
  }

  userStatus.textContent = `Sessão iniciada como ${currentUser.name} (${currentUser.email})${currentUser.firstOrder ? " • Tens 10% na primeira encomenda." : ""}`;
}

function registerUser() {
  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");

  if (!registerName || !registerEmail || !registerPassword) return;

  const name = registerName.value.trim();
  const email = registerEmail.value.trim().toLowerCase();
  const password = registerPassword.value.trim();

  if (!name || !email || !password) {
    alert("Preenche todos os campos para criar conta.");
    return;
  }

  const exists = users.find((user) => user.email === email);
  if (exists) {
    alert("Já existe uma conta com esse email.");
    return;
  }

  const newUser = {
    name,
    email,
    password,
    firstOrder: true
  };

  users.push(newUser);
  saveUsers();

  alert("Conta criada com sucesso. Agora já podes fazer login.");

  registerName.value = "";
  registerEmail.value = "";
  registerPassword.value = "";
}

function loginUser() {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  if (!loginEmail || !loginPassword) return;

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    alert("Preenche email e palavra-passe.");
    return;
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Dados de login inválidos.");
    return;
  }

  currentUser = user;
  saveCurrentUser();
  updateUserStatus();
  renderCart();

  alert(`Bem-vindo, ${currentUser.name}!`);
}

function syncCurrentUser() {
  if (!currentUser) return;

  const index = users.findIndex((u) => u.email === currentUser.email);
  if (index !== -1) {
    users[index] = currentUser;
    saveUsers();
    saveCurrentUser();
  }
}

function enviarEncomenda() {
  const clienteNome = document.getElementById("clienteNome");
  const clienteTelefone = document.getElementById("clienteTelefone");
  const clienteMorada = document.getElementById("clienteMorada");
  const metodoPagamento = document.getElementById("metodoPagamento");

  if (!clienteNome || !clienteTelefone || !clienteMorada || !metodoPagamento) return;

  if (!currentUser) {
    alert("Tens de iniciar sessão antes de enviar a encomenda.");
    return;
  }

  if (cart.length === 0) {
    alert("O carrinho está vazio.");
    return;
  }

  const nome = clienteNome.value.trim();
  const telefone = clienteTelefone.value.trim();
  const morada = clienteMorada.value.trim();
  const pagamento = metodoPagamento.value;

  if (!nome || !telefone || !morada || !pagamento) {
    alert("Preenche todos os campos da encomenda.");
    return;
  }

  const subtotal = getSubtotal();
  const discount = getDiscount(subtotal);
  const deliveryCost = getDeliveryCost(subtotal);
  const total = subtotal - discount + deliveryCost;
  const giftCount = getGiftCount();

  let produtosTexto = "";
  cart.forEach((item) => {
    produtosTexto += `- ${item.nome} (${item.preco.toFixed(2)}€)\n`;
  });

  const ofertaTexto = giftCount > 0
    ? `${giftCount} saco(s) de pão com 4 unidades`
    : "Sem oferta";

  emailjs.send("service_jj3z9l3", "template_y6dkezs", {
    nome: nome,
    telefone: telefone,
    morada: morada,
    pagamento: pagamento,
    produtos: produtosTexto,
    subtotal: subtotal.toFixed(2) + "€",
    desconto: discount.toFixed(2) + "€",
    entrega: deliveryCost.toFixed(2) + "€",
    total: total.toFixed(2) + "€",
    oferta: ofertaTexto,
    zona: "Cascais e arredores, até 20 km de Cascais"
  })
  .then(() => {
    if (currentUser.firstOrder) {
      currentUser.firstOrder = false;
      syncCurrentUser();
    }

    clearCart();
    updateUserStatus();

    clienteNome.value = "";
    clienteTelefone.value = "";
    clienteMorada.value = "";
    metodoPagamento.value = "";

    alert("Encomenda enviada com sucesso! Vamos entrar em contacto contigo.");
  })
  .catch(() => {
    alert("Erro ao enviar encomenda. Confirma a configuração do EmailJS.");
  });
}

if (toggleSobreBtn && textoSobre) {
  toggleSobreBtn.addEventListener("click", () => {
    textoSobre.classList.toggle("escondido");
    toggleSobreBtn.textContent = textoSobre.classList.contains("escondido")
      ? "Clica aqui para saber mais"
      : "Fechar texto";
  });
}

if (registerBtn) {
  registerBtn.addEventListener("click", registerUser);
}

if (loginBtn) {
  loginBtn.addEventListener("click", loginUser);
}

if (enviarBtn) {
  enviarBtn.addEventListener("click", enviarEncomenda);
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", clearCart);
}

if (produtosMenuLink) {
  produtosMenuLink.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdownProdutos();
  });
}

if (produtosDropdownContent) {
  produtosDropdownContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

categoriaBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    renderCatalogo(btn.dataset.category);

    if (catalogoMenu) {
      catalogoMenu.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

menuCategoriaLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    abrirCategoria(link.dataset.category);
  });
});

document.addEventListener("click", (e) => {
  if (produtosDropdown && !produtosDropdown.contains(e.target)) {
    fecharDropdownProdutos();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    fecharDropdownProdutos();
  }
});

if (destaquesGrid) {
  renderCards(getFeaturedProducts(), destaquesGrid);
}

renderCatalogo("massas");
updateUserStatus();
renderCart();
emailjs.send("SERVICE_ID", "TEMPLATE_ID", {
  customer_name: "João",
  email: "cliente@email.com",
  product_name: "Produto X",
  quantity: "1",
  total: "19,99€"
}, "PUBLIC_KEY");
