// Initial Menu Data mapped directly to your frontend/images folder
const fallbackMenu = [
  { id: 1, name: "ROYAL RAJBHOG DELUXE", category: "desi specials", price: 180, rating: 4.9, reviews: 2, badge: "BESTSELLER", badgeColor: "#3b82f6", image: "./images/royal-rajbhog.jpg", description: "Saffron, almonds & rich cottage cheese dumplings." },
  { id: 2, name: "ALPHONSO MANGO MASTANI", category: "classics seasonal delights", price: 160, rating: 4.8, reviews: 0, badge: "TRENDING", badgeColor: "#ef4444", image: "./images/mango-scoop.jpg", description: "Pure Ratnagiri Alphonso mango pulp & thick cream." },
  { id: 3, name: "SHAHI MEETHA PAAN MAGIC", category: "desi specials", price: 140, rating: 4.7, reviews: 0, badge: "POPULAR", badgeColor: "#8b5cf6", image: "./images/meetha-paan.jpg", description: "Banarasi paan leaves with gulkand syrup." },
  { id: 4, name: "ZAFRANI PISTA KULFI SCOOP", category: "classics", price: 170, rating: 4.9, reviews: 0, badge: "CHEF'S PICK", badgeColor: "#6b7280", image: "./images/pistachio-scoop.jpg", description: "Infused with Kashmiri saffron strands and roasted pistachios." },
  { id: 5, name: "GULAB JAMUN FUSION SUNDAE", category: "fusion sundaes", price: 195, rating: 5.0, reviews: 2, badge: "ROYAL SPECIAL", badgeColor: "#dc2626", image: "./images/gulab-jamun.jpg", description: "Warm gulab jamuns topped with velvet cardamom ice cream." },
  { id: 6, name: "ANJEER BADAM DELIGHT", category: "classics", price: 165, rating: 4.6, reviews: 0, badge: "HEALTHY CHOICE", badgeColor: "#f59e0b", image: "./images/matka-kulfi.jpg", description: "Real dried figs blended with crunchy California almonds." },
  { id: 7, name: "TENDER COCONUT BLISS", category: "seasonal delights", price: 150, rating: 4.8, reviews: 0, badge: "SEASONAL", badgeColor: "#db2777", image: "./images/tender-coconut.jpg", description: "Crafted with fresh pieces from soft tender coconuts." },
  { id: 8, name: "PAAN GULKAND ROYAL SCOOP", category: "desi specials", price: 155, rating: 4.9, reviews: 0, badge: "MUST TRY", badgeColor: "#b91c1c", image: "./images/gulkand-paan-scoop.jpg", description: "Organic rose petal preserve, mint & crushed betel leaf." }
];

// App State
let menuData = [];
let cart = [];
let wishlist = [];
let activeDiscount = 0;

// Load Menu
async function loadMenu() {
  const apiUrl = window.location.protocol === 'file:' ? 'http://localhost:5000/api/menu' : '/api/menu';
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error();
    const data = await res.json();
    menuData = data.map(item => ({
      ...item,
      image: item.image.startsWith('./') || item.image.startsWith('images/') ? item.image : `./images/${item.image}`
    }));
  } catch {
    menuData = fallbackMenu;
  }
  renderMenu(menuData);
}

// Render Product Cards
function renderMenu(items) {
  const container = document.getElementById('menu-container');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8;">No matching flavors found.</p>`;
    return;
  }

  container.innerHTML = items.map(item => {
    const isWishlisted = wishlist.includes(item.id);
    return `
      <div class="card">
        <div class="image-container">
          <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='./images/royal-rajbhog.jpg';">
          <span class="badge" style="background-color: ${item.badgeColor}">${item.badge}</span>
          <button class="wishlist-heart ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${item.id})">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-description">${item.description}</p>
          <div class="rating-row">
            ⭐ ${item.rating} <span>(${item.reviews} Reviews & History)</span>
          </div>
          <div class="card-footer">
            <span class="price">₹${item.price}</span>
            <button class="add-btn" onclick="addToCart(${item.id})">+ Add</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Search and Filter Logic
function filterAndSearch() {
  const searchVal = document.getElementById('search-input').value.toLowerCase();
  const activeTab = document.querySelector('.filter-tab.active').getAttribute('data-category');

  const filtered = menuData.filter(item => {
    const matchesCategory = activeTab === 'all' || item.category.toLowerCase().includes(activeTab);
    const matchesSearch = item.name.toLowerCase().includes(searchVal) || item.description.toLowerCase().includes(searchVal);
    return matchesCategory && matchesSearch;
  });

  renderMenu(filtered);
}

document.getElementById('search-input').addEventListener('input', filterAndSearch);

document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    filterAndSearch();
  });
});

// Wishlist Logic
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
  } else {
    wishlist.push(id);
  }
  document.getElementById('wishlist-count').innerText = wishlist.length;
  filterAndSearch();
}

// Cart & Quantity Logic
function addToCart(id) {
  const item = menuData.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCartUI();
  openCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  updateCartUI();
}

function updateCartUI() {
  const cartBadge = document.getElementById('cart-badge');
  const cartContainer = document.getElementById('cart-items');
  const totalPriceElem = document.getElementById('cart-total-price');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalTotal = Math.round(subtotal * (1 - activeDiscount / 100));

  cartBadge.innerText = totalCount;
  totalPriceElem.innerText = `₹${finalTotal}`;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p style="text-align: center; color: #94a3b8; margin-top: 40px;">Your royal basket is empty.</p>`;
    return;
  }

  cartContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='./images/royal-rajbhog.jpg';">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">₹${item.price * item.quantity}</div>
      </div>
      <div class="quantity-controls">
        <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

// Coupon Logic
document.getElementById('apply-coupon-btn').addEventListener('click', () => {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  const msgElem = document.getElementById('coupon-msg');

  if (code === 'SHAHI10') {
    activeDiscount = 10;
    msgElem.className = "coupon-msg success";
    msgElem.innerText = "10% Discount Applied!";
  } else if (code === 'SHAHI20') {
    activeDiscount = 20;
    msgElem.className = "coupon-msg success";
    msgElem.innerText = "20% Discount Applied!";
  } else {
    activeDiscount = 0;
    msgElem.className = "coupon-msg error";
    msgElem.innerText = "Invalid Code! Try SHAHI10 or SHAHI20";
  }

  updateCartUI();
});

// Custom Sundae Builder Modal
const sundaeModal = document.getElementById('sundae-modal');

document.getElementById('open-sundae-btn').addEventListener('click', () => {
  sundaeModal.classList.add('active');
});

document.getElementById('close-sundae-btn').addEventListener('click', () => {
  sundaeModal.classList.remove('active');
});

document.getElementById('add-sundae-to-cart-btn').addEventListener('click', () => {
  const [baseName, basePrice] = document.getElementById('sundae-base').value.split('|');
  const sauceName = document.getElementById('sundae-sauce').value;
  
  const selectedToppings = [];
  document.querySelectorAll('.topping-cb:checked').forEach(cb => {
    selectedToppings.push(cb.value);
  });

  const baseVal = parseInt(basePrice) || 0;
  const sauceVal = sauceName !== 'None' ? 30 : 0;
  const toppingVal = selectedToppings.length * 20;
  const totalPrice = 100 + baseVal + sauceVal + toppingVal;

  const customItem = {
    id: `custom-${Date.now()}`,
    name: `Custom Sundae (${baseName})`,
    price: totalPrice,
    image: './images/gulab-jamun.jpg',
    quantity: 1
  };

  cart.push(customItem);
  sundaeModal.classList.remove('active');
  updateCartUI();
  openCart();
});

// UPI Modal & Checkout
const upiModal = document.getElementById('upi-modal');

document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Your basket is empty!");
    return;
  }

  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const orderId = `#SHAH${randomNum}`;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.round(subtotal * (1 - activeDiscount / 100));

  document.getElementById('upi-order-id').innerText = `Order ${orderId} | Total: ₹${total}`;
  
  const qrData = encodeURIComponent(`upi://pay?pa=shahiscoops@upi&pn=Shahi%20Scoops&am=${total}&tn=${orderId}`);
  document.getElementById('upi-qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`;

  closeCart();
  upiModal.classList.add('active');
});

document.getElementById('close-upi-btn').addEventListener('click', () => {
  upiModal.classList.remove('active');
  cart = [];
  activeDiscount = 0;
  document.getElementById('coupon-input').value = '';
  document.getElementById('coupon-msg').innerText = '';
  updateCartUI();
});

// Cart Drawer Toggles
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('active');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('active');
}

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('close-cart-btn').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);

// Initialize
document.addEventListener('DOMContentLoaded', loadMenu);