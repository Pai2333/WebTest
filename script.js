const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');
const mainNav = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const toast = document.querySelector('.toast');
const cartCount = document.querySelector('.cart-count');
const cartContent = document.querySelector('#cart-content');

let cart = [];

function showPage(pageName) {
  const target = document.querySelector(`[data-page-view="${pageName}"]`);
  if (!target) return;
  pages.forEach((page) => page.classList.toggle('active', page === target));
  document.querySelectorAll('.main-nav a').forEach((link) => link.classList.toggle('active', link.dataset.page === pageName));
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (pageName === 'cart') renderCart();
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function updateCartCount() {
  cartCount.textContent = cart.length;
}

function addToCart(product, price) {
  cart.push({ product, price });
  updateCartCount();
  notify(`${product} 已加入購物袋`);
}

function renderCart() {
  if (!cart.length) {
    cartContent.innerHTML = '<div class="cart-empty"><p>你的購物袋目前是空的，去挑一件喜歡的光吧。</p><button class="button button-dark" type="button" data-page="product">瀏覽商品 <span>→</span></button></div>';
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartContent.innerHTML = `
    <div class="cart-list">
      ${cart.map((item, index) => `<div class="cart-row"><div><strong>${item.product}</strong><p>天然水晶手串 · 8mm</p></div><strong>NT$ ${item.price.toLocaleString('zh-TW')}</strong><button class="remove-item" type="button" data-index="${index}" aria-label="移除 ${item.product}">×</button></div>`).join('')}
    </div>
    <div class="cart-summary"><div class="cart-total"><span>小計</span><strong>NT$ ${total.toLocaleString('zh-TW')}</strong></div><button class="button button-dark" type="button" id="checkout-button">前往結帳 <span>→</span></button></div>
  `;
  cartContent.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.index), 1);
      updateCartCount();
      renderCart();
    });
  });
  cartContent.querySelector('#checkout-button').addEventListener('click', () => notify('結帳功能即將開放，謝謝你的喜歡。'));
}

navLinks.forEach((link) => link.addEventListener('click', (event) => {
  const pageName = link.dataset.page;
  if (!pageName) return;
  event.preventDefault();
  showPage(pageName);
  history.replaceState(null, '', `#${pageName}`);
}));

document.querySelectorAll('.add-button').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.product, Number(button.dataset.price))));
document.querySelectorAll('.wishlist').forEach((button) => button.addEventListener('click', () => {
  button.textContent = button.textContent === '♥' ? '♡' : '♥';
  notify(button.textContent === '♥' ? '已加入收藏' : '已取消收藏');
}));

document.querySelector('#contact-form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.target.reset();
  event.target.querySelector('.form-status').textContent = '訊息已送出，我們會盡快回覆你。';
});

document.querySelector('#login-button').addEventListener('click', () => notify('登入功能即將開放，敬請期待。'));
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

const initialPage = window.location.hash.replace('#', '') || 'home';
showPage(document.querySelector(`[data-page-view="${initialPage}"]`) ? initialPage : 'home');
