// ============================================================
// BOOKS DATA
// ============================================================
const booksData = [
  { id:1,  title:"Майстер і Маргарита",   author:"Михайло Булгаков",     genre:"Українська проза",    price:189, cover:"📕", badge:"Хіт" },
  { id:2,  title:"Гарі Поттер і філософський камінь", author:"Дж.К. Роулінг", genre:"Фентезі", price:245, cover:"📗", badge:"Бестселер" },
  { id:3,  title:"Вбивство в Орієнт-Експресі", author:"Агата Крісті",   genre:"Детектив",            price:155, cover:"📘", badge:"Класика" },
  { id:4,  title:"Кохання під час чуми",  author:"Ґабріель Ґарсія Маркес",genre:"Романтика",          price:210, cover:"📙", badge:"" },
  { id:5,  title:"Дюна",                  author:"Френк Герберт",        genre:"Наукова фантастика",  price:299, cover:"📕", badge:"Новинка" },
  { id:6,  title:"Тіні забутих предків",  author:"Михайло Коцюбинський", genre:"Українська проза",    price:120, cover:"📗", badge:"Класика" },
  { id:7,  title:"1984",                  author:"Джордж Орвелл",        genre:"Наукова фантастика",  price:175, cover:"📘", badge:"Хіт" },
  { id:8,  title:"Маленький принц",       author:"Антуан де Сент-Екзюпері",genre:"Дитяча",            price:98,  cover:"📙", badge:"" },
  { id:9,  title:"Собор",                 author:"Олесь Гончар",         genre:"Українська проза",    price:135, cover:"📕", badge:"" },
  { id:10, title:"Шерлок Холмс",          author:"Артур Конан Дойл",     genre:"Детектив",            price:190, cover:"📗", badge:"Класика" },
  { id:11, title:"Гра престолів",         author:"Джордж Р.Р. Мартін",   genre:"Фентезі",             price:320, cover:"📘", badge:"Бестселер" },
  { id:12, title:"Незнайко",              author:"Микола Носов",          genre:"Дитяча",              price:85,  cover:"📙", badge:"" },
];

// ============================================================
// CART STATE
// ============================================================
let cart = JSON.parse(localStorage.getItem('ksd_cart') || '[]');

function saveCart() {
  localStorage.setItem('ksd_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id) {
  const book = booksData.find(b => b.id === id);
  if (!book) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, title: book.title, author: book.author, price: book.price, cover: book.cover, qty: 1 });
  }
  saveCart();

  // Animate button
  const btn = document.querySelector(`[data-book-id="${id}"]`);
  if (btn) {
    btn.textContent = '✓ Додано!';
    btn.style.background = '#2e7d32';
    setTimeout(() => {
      btn.textContent = '🛒 В кошик';
      btn.style.background = '';
    }, 1500);
  }

  // Flash cart button
  const cartBtn = document.querySelector('.cart-btn');
  if (cartBtn) {
    cartBtn.classList.add('bounce');
    setTimeout(() => cartBtn.classList.remove('bounce'), 400);
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else saveCart();
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = total);

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Кошик порожній</p>';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (footerEl) footerEl.style.display = 'block';

  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item">
        <span class="ci-cover">${item.cover}</span>
        <div class="ci-info">
          <div class="ci-title">${item.title}</div>
          <div class="ci-author">${item.author}</div>
          <div class="ci-price">${item.price * item.qty} грн</div>
        </div>
        <div class="ci-controls">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
          <button onclick="removeFromCart(${item.id})" class="ci-remove">🗑</button>
        </div>
      </div>`;
  });
  itemsEl.innerHTML = html;

  const grandTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = grandTotal;
}

// ============================================================
// CART PANEL TOGGLE
// ============================================================
function toggleCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  const open = panel.classList.toggle('open');
  overlay.classList.toggle('visible', open);
}

// ============================================================
// ORDER
// ============================================================
function placeOrder() {
  if (cart.length === 0) return;
  alert('✅ Дякуємо за замовлення! Ми зв\'яжемося з вами найближчим часом.');
  cart = [];
  saveCart();
  toggleCart();
}

// ============================================================
// RENDER BOOKS
// ============================================================
function renderBooks(books, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (books.length === 0) {
    el.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;padding:40px">Книг за вашим запитом не знайдено 😔</p>';
    return;
  }
  el.innerHTML = books.map(b => `
    <div class="book-card">
      ${b.badge ? `<span class="book-badge">${b.badge}</span>` : ''}
      <div class="book-cover">${b.cover}</div>
      <div class="book-info">
        <div class="book-genre">${b.genre}</div>
        <h3 class="book-title">${b.title}</h3>
        <div class="book-author">${b.author}</div>
        <div class="book-footer">
          <span class="book-price">${b.price} грн</span>
          <button class="btn-cart" data-book-id="${b.id}" onclick="addToCart(${b.id})">🛒 В кошик</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================================
// NEWSLETTER
// ============================================================
function subscribeNewsletter(e) {
  e.preventDefault();
  const msg = document.getElementById('subscribeMsg');
  msg.textContent = '✅ Дякуємо! Ви успішно підписались на новини.';
  msg.style.color = '#2e7d32';
  e.target.reset();
}

// Init
updateCartUI();
