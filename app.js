// Mock Data
const restaurants = [
  { id: 1, name: "Luigi's Artisan Pizza", category: "Italian", rating: 4.8, time: "25-35 min", fee: "$1.99", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "The Burger Joint", category: "American", rating: 4.5, time: "15-25 min", fee: "$0", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Oceanside Sushi", category: "Japanese", rating: 4.9, time: "35-45 min", fee: "$3.49", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80" }
];

const menuItems = [
  { id: 101, name: "The Classic Double", desc: "Two smashed beef patties, American cheese, secret sauce.", price: 14.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80" },
  { id: 102, name: "Crispy Mozzarella Sticks", desc: "6 pieces of perfectly fried mozzarella.", price: 8.99, image: "https://images.unsplash.com/photo-1536510344784-b43e97721fd8?auto=format&fit=crop&w=400&q=80" },
  { id: 103, name: "Thick-Cut Onion Rings", desc: "Beer-battered onion rings with dipping sauce.", price: 7.49, image: "https://images.unsplash.com/photo-1639024470097-f582da574d56?auto=format&fit=crop&w=400&q=80" }
];

// App State
let appState = {
  users: JSON.parse(localStorage.getItem('crave_users')) || [],
  currentUser: JSON.parse(localStorage.getItem('crave_current_user')) || null,
  cart: JSON.parse(localStorage.getItem('crave_cart')) || [],
  orders: JSON.parse(localStorage.getItem('crave_orders')) || [],
  currentPage: 'auth', // 'auth', 'home', 'menu', 'checkout', 'tracking', 'orders'
  authTab: 'signup', // 'login' or 'signup'
  activeOrderId: null
};

// State initial check
if (appState.currentUser) {
  appState.currentPage = 'home';
}

// Persist helpers
const saveUsers = () => localStorage.setItem('crave_users', JSON.stringify(appState.users));
const saveCurrentUser = () => localStorage.setItem('crave_current_user', JSON.stringify(appState.currentUser));
const saveCart = () => localStorage.setItem('crave_cart', JSON.stringify(appState.cart));
const saveOrders = () => localStorage.setItem('crave_orders', JSON.stringify(appState.orders));

const updateCartBadge = () => {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const total = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
};

// --- Render Main ---
const renderApp = () => {
  const appEl = document.getElementById('app');
  if (!appState.currentUser) {
    appEl.innerHTML = renderAuth();
  } else {
    appEl.innerHTML = `
      ${renderNav()}
      <main class="container" style="padding-top: 40px; padding-bottom: 80px;">
        ${appState.currentPage === 'home' ? renderHome() : ''}
        ${appState.currentPage === 'menu' ? renderMenu() : ''}
        ${appState.currentPage === 'checkout' ? renderCheckout() : ''}
        ${appState.currentPage === 'tracking' ? renderTracking() : ''}
        ${appState.currentPage === 'orders' ? renderOrders() : ''}
      </main>
    `;
    updateCartBadge();
  }
};

// --- View: Authentication ---
const renderAuth = () => `
  <div class="location-gate">
    <div class="card" style="padding: 40px; max-width: 440px; width: 100%;">
      <h1 class="section-title" style="text-align: center; color: var(--primary);">CraveDash</h1>
      <p style="text-align: center; margin-bottom: 24px; color: var(--secondary);">Bengaluru's Premium Food Delivery</p>
      
      <div style="display: flex; gap: 8px; margin-bottom: 24px; background: var(--surface-container); padding: 4px; border-radius: var(--radius-md);">
        <button style="flex: 1; padding: 10px; border-radius: var(--radius-sm); border: none; font-weight: bold; background: ${appState.authTab === 'signup' ? 'var(--surface-lowest)' : 'transparent'}; box-shadow: ${appState.authTab === 'signup' ? 'var(--shadow-1)' : 'none'}; cursor: pointer;" onclick="switchAuthTab('signup')">Sign Up</button>
        <button style="flex: 1; padding: 10px; border-radius: var(--radius-sm); border: none; font-weight: bold; background: ${appState.authTab === 'login' ? 'var(--surface-lowest)' : 'transparent'}; box-shadow: ${appState.authTab === 'login' ? 'var(--shadow-1)' : 'none'}; cursor: pointer;" onclick="switchAuthTab('login')">Login</button>
      </div>

      ${appState.authTab === 'signup' ? `
        <form id="signup-form" onsubmit="handleSignup(event)">
          <input type="text" id="su-name" class="input-field" placeholder="Full Name" required style="margin-bottom: 16px;">
          <input type="email" id="su-email" class="input-field" placeholder="Email Address" required style="margin-bottom: 16px;">
          <input type="tel" id="su-phone" class="input-field" placeholder="Phone Number" required style="margin-bottom: 16px;">
          <input type="password" id="su-pass" class="input-field" placeholder="Create Password" required style="margin-bottom: 16px;">
          <select id="su-city" class="input-field" required style="margin-bottom: 24px;">
            <option value="">Select City...</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="other">Other City</option>
          </select>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Create Account</button>
        </form>
      ` : `
        <form id="login-form" onsubmit="handleLogin(event)">
          <input type="text" id="lg-identity" class="input-field" placeholder="Email or Phone Number" required style="margin-bottom: 16px;">
          <input type="password" id="lg-pass" class="input-field" placeholder="Password" required style="margin-bottom: 24px;">
          <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
        </form>
      `}
    </div>
  </div>
`;

// --- View: Navbar ---
const renderNav = () => `
  <nav class="glass" style="position: sticky; top: 0; z-index: 100; padding: 16px 0; border-bottom: 1px solid var(--surface-container);">
    <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
      <h1 class="font-display" style="font-weight: 700; color: var(--primary); font-size: 24px; cursor: pointer;" onclick="navigate('home')">CraveDash</h1>
      <div style="display: flex; gap: 16px; align-items: center;">
        <span style="font-weight: 600; display: none; @media(min-width: 768px){display: block;}">Hi, ${appState.currentUser.name}</span>
        <button class="btn btn-ghost" onclick="navigate('orders')">My Orders</button>
        <button class="btn btn-secondary btn-icon" onclick="toggleCart()" style="position: relative;">
          <span class="material-symbols-outlined">shopping_cart</span>
          <span id="cart-badge" style="position: absolute; top: -5px; right: -5px; background: var(--primary); color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; display: none;">0</span>
        </button>
        <button class="btn btn-ghost btn-icon" onclick="handleLogout()" title="Logout"><span class="material-symbols-outlined">logout</span></button>
      </div>
    </div>
  </nav>
`;

// --- View: Home ---
const renderHome = () => `
  <div class="fade-in-up">
    <div class="card" style="background: var(--primary-dark); color: white; padding: 40px; margin-bottom: 40px; text-align: center; border-radius: var(--radius-xl);">
      <h2 class="font-display" style="font-size: 32px; margin-bottom: 16px;">Craving something delicious?</h2>
      <p style="opacity: 0.9;">Order from Bengaluru's best spots, delivered fast.</p>
    </div>
    <div class="section-header">
      <h3 class="section-title">Popular Near You</h3>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
      ${restaurants.map(r => `
        <div class="card" style="cursor: pointer;" onclick="navigate('menu')">
          <img src="${r.image}" class="card-image" alt="${r.name}">
          <div style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h4 style="font-weight: 700; font-size: 18px;">${r.name}</h4>
              <span class="badge badge-surface" style="border: 1px solid var(--surface-container-high);"><span class="material-symbols-outlined" style="font-size: 14px; color: var(--warning);">star</span> ${r.rating}</span>
            </div>
            <p style="color: var(--secondary); margin-top: 4px; font-size: 14px;">${r.category} • ${r.time} • Delivery: ${r.fee}</p>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
`;

// --- View: Menu ---
const renderMenu = () => `
  <div class="fade-in-up">
    <button class="btn btn-ghost" style="margin-bottom: 24px; padding: 0;" onclick="navigate('home')">
      <span class="material-symbols-outlined">arrow_back</span> Back to Restaurants
    </button>
    <div class="section-header">
      <h2 class="section-title">The Burger Joint Menu</h2>
    </div>
    <div style="display: grid; gap: 16px;">
      ${menuItems.map(item => `
        <div class="card" style="display: flex; gap: 16px; padding: 16px; flex-direction: row; align-items: center;">
          <img src="${item.image}" style="width: 100px; height: 100px; object-fit: cover; border-radius: var(--radius-md);" alt="${item.name}">
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            <div>
              <h4 style="font-weight: 700; font-size: 18px;">${item.name}</h4>
              <p style="color: var(--secondary); font-size: 14px;">${item.desc}</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span style="font-weight: 700; color: var(--primary);">$${item.price.toFixed(2)}</span>
              <button class="btn btn-primary btn-sm" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
`;

// --- View: Checkout ---
const renderCheckout = () => {
  const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + (subtotal * 0.05);

  return `
  <div class="fade-in-up" style="max-width: 600px; margin: 0 auto;">
    <button class="btn btn-ghost" style="margin-bottom: 24px; padding: 0;" onclick="navigate('home')">
      <span class="material-symbols-outlined">arrow_back</span> Back
    </button>
    <h2 class="section-title">Checkout</h2>
    <div class="card" style="padding: 24px; margin-bottom: 24px;">
      <h3 style="margin-bottom: 16px; font-weight: 700;">Order Summary</h3>
      ${appState.cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>${item.quantity}x ${item.name}</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('')}
      <hr style="border: none; border-top: 1px solid var(--surface-container); margin: 16px 0;">
      <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 18px;">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>

    <div class="card" style="padding: 24px; margin-bottom: 24px;">
      <h3 style="margin-bottom: 16px; font-weight: 700;">Payment Method</h3>
      <div style="display: flex; gap: 16px; margin-bottom: 24px;">
        <label class="card" style="flex: 1; padding: 16px; text-align: center; cursor: pointer; border: 2px solid var(--primary);">
          <input type="radio" name="payment" value="card" checked style="display: none;" onchange="togglePaymentFields(true)">
          <span class="material-symbols-outlined" style="font-size: 32px; color: var(--primary);">credit_card</span>
          <div style="font-weight: 600; margin-top: 8px;">Online Card</div>
        </label>
        <label class="card" style="flex: 1; padding: 16px; text-align: center; cursor: pointer; border: 2px solid transparent; background: var(--surface-container-low);">
          <input type="radio" name="payment" value="cod" style="display: none;" onchange="togglePaymentFields(false)">
          <span class="material-symbols-outlined" style="font-size: 32px; color: var(--secondary);">payments</span>
          <div style="font-weight: 600; margin-top: 8px;">Cash on Delivery</div>
        </label>
      </div>

      <div id="card-fields" style="display: block;">
        <p style="color: var(--secondary); font-size: 14px; margin-bottom: 16px;">This is a mock checkout. You can type anything below.</p>
        <input type="text" class="input-field" placeholder="Card Number" style="margin-bottom: 16px;">
        <div style="display: flex; gap: 16px;">
          <input type="text" class="input-field" placeholder="MM/YY" style="flex: 1;">
          <input type="text" class="input-field" placeholder="CVV" style="flex: 1;">
        </div>
      </div>
    </div>
    
    <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="placeOrder()">Pay & Place Order</button>
  </div>
`};

// --- View: Orders List ---
const renderOrders = () => `
  <div class="fade-in-up" style="max-width: 800px; margin: 0 auto;">
    <h2 class="section-title">My Orders</h2>
    ${appState.orders.filter(o => o.userEmail === appState.currentUser.email).length === 0 ? `
      <div style="text-align: center; padding: 40px; color: var(--secondary);">You have no orders yet.</div>
    ` : `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${appState.orders.filter(o => o.userEmail === appState.currentUser.email).sort((a,b) => b.timestamp - a.timestamp).map(order => `
          <div class="card" style="padding: 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="viewOrderTracking(${order.id})">
            <div>
              <h4 style="font-weight: 700;">Order #${order.id}</h4>
              <p style="color: var(--secondary); font-size: 14px;">${new Date(order.timestamp).toLocaleString()} • ${order.items.length} items</p>
              <span class="badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-primary'}" style="margin-top: 8px;">${order.status}</span>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; font-size: 18px;">$${order.total.toFixed(2)}</div>
              <button class="btn btn-ghost btn-sm" style="margin-top: 8px;">Track Order <span class="material-symbols-outlined" style="font-size: 16px;">arrow_forward</span></button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  </div>
`;

// --- View: Tracking (Fake Real Time) ---
const renderTracking = () => {
  const order = appState.orders.find(o => o.id === appState.activeOrderId);
  if (!order) return '<p>Order not found</p>';

  // Determine animation state based on status
  let animDuration = "20s";
  let mapDisplay = order.status === 'Delivered' ? 'none' : 'block';
  
  return `
  <div class="fade-in-up" style="max-width: 600px; margin: 0 auto;">
    <button class="btn btn-ghost" style="margin-bottom: 24px; padding: 0;" onclick="navigate('orders')">
      <span class="material-symbols-outlined">arrow_back</span> All Orders
    </button>
    <div class="card" style="padding: 32px; text-align: center; margin-bottom: 24px;">
      <h2 class="font-display" style="color: var(--primary); margin-bottom: 8px;">Order #${order.id}</h2>
      
      <div id="tracking-status" style="font-size: 18px; font-weight: 600; color: ${order.status === 'Delivered' ? 'var(--success)' : 'var(--on-surface)'}; margin-bottom: 24px;">
        ${order.status === 'Delivered' ? 'Order Delivered! Enjoy your meal.' : 'Preparing your order...'}
      </div>
      
      ${order.status !== 'Delivered' ? `
      <div class="tracking-map" id="live-map">
        <svg width="100%" height="100%" viewBox="0 0 400 400" preserveAspectRatio="none" style="position: absolute; inset: 0;">
          <path id="route-path" d="M 50,50 Q 200,50 200,200 T 350,350" fill="none" stroke="#D4D4D4" stroke-width="8" stroke-dasharray="10,10"/>
        </svg>
        <div class="dest-marker" style="left: 38px; top: 38px; background: var(--secondary);"><span class="material-symbols-outlined">restaurant</span></div>
        <div class="dest-marker" style="left: 332px; top: 332px;"><span class="material-symbols-outlined">home</span></div>
        <div id="delivery-agent" class="delivery-marker" style="offset-path: path('M 50,50 Q 200,50 200,200 T 350,350'); animation: moveOnPath ${animDuration} linear forwards;">
          <span class="material-symbols-outlined">two_wheeler</span>
        </div>
      </div>
      ` : `
        <div style="background: #E8F5E9; padding: 40px; border-radius: var(--radius-xl); display: flex; justify-content: center;">
          <span class="material-symbols-outlined" style="font-size: 64px; color: var(--success);">check_circle</span>
        </div>
      `}
    </div>
  </div>
`};


// --- Auth Logic ---
window.switchAuthTab = (tab) => {
  appState.authTab = tab;
  renderApp();
};

window.handleSignup = (e) => {
  e.preventDefault();
  const name = document.getElementById('su-name').value;
  const email = document.getElementById('su-email').value;
  const phone = document.getElementById('su-phone').value;
  const pass = document.getElementById('su-pass').value;
  const city = document.getElementById('su-city').value;

  if (city !== 'bengaluru') {
    alert("Sorry! CraveDash is currently only available in Bengaluru.");
    return;
  }
  
  if (appState.users.find(u => u.email === email || u.phone === phone)) {
    alert("Account with this email or phone already exists. Please login.");
    return;
  }

  const newUser = { name, email, phone, pass, city };
  appState.users.push(newUser);
  saveUsers();
  
  appState.currentUser = newUser;
  saveCurrentUser();
  appState.currentPage = 'home';
  renderApp();
  showToast(`Welcome to CraveDash, ${name}!`);
};

window.handleLogin = (e) => {
  e.preventDefault();
  const identity = document.getElementById('lg-identity').value;
  const pass = document.getElementById('lg-pass').value;

  const user = appState.users.find(u => (u.email === identity || u.phone === identity) && u.pass === pass);
  
  if (!user) {
    alert("Invalid credentials. You must sign up first if you don't have an account.");
    return;
  }

  appState.currentUser = user;
  saveCurrentUser();
  appState.currentPage = 'home';
  renderApp();
  showToast(`Welcome back, ${user.name}!`);
};

window.handleLogout = () => {
  appState.currentUser = null;
  appState.cart = [];
  appState.currentPage = 'auth';
  saveCurrentUser();
  saveCart();
  renderApp();
};


// --- Navigation & Core UI ---
window.navigate = (page) => {
  appState.currentPage = page;
  renderApp();
  window.scrollTo(0, 0);
};

window.showToast = (message, type="success") => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeInDown 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// --- Cart Logic ---
window.addToCart = (id) => {
  const item = menuItems.find(i => i.id === id);
  const existing = appState.cart.find(i => i.id === id);
  if (existing) existing.quantity += 1;
  else appState.cart.push({ ...item, quantity: 1 });
  
  saveCart();
  updateCartBadge();
  showToast(`Added ${item.name} to cart!`);
};

window.updateQuantity = (id, delta) => {
  const item = appState.cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) appState.cart = appState.cart.filter(i => i.id !== id);
    saveCart();
    renderCartModal(); // re-render overlay
    updateCartBadge();
  }
};

window.toggleCart = () => {
  const overlayContainer = document.getElementById('overlay-container');
  if (overlayContainer.innerHTML) {
    overlayContainer.innerHTML = '';
  } else {
    renderCartModal();
  }
};

window.renderCartModal = () => {
  const overlayContainer = document.getElementById('overlay-container');
  const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  overlayContainer.innerHTML = `
    <div class="overlay" onclick="toggleCart()">
      <div class="cart-drawer" onclick="event.stopPropagation()">
        <div style="padding: 24px; border-bottom: 1px solid var(--surface-container); display: flex; justify-content: space-between; align-items: center;">
          <h2 class="font-display">Your Cart</h2>
          <button class="btn btn-icon btn-ghost" onclick="toggleCart()"><span class="material-symbols-outlined">close</span></button>
        </div>
        
        <div style="flex: 1; overflow-y: auto; padding: 24px;">
          ${appState.cart.length === 0 ? '<p style="text-align: center; color: var(--secondary);">Your cart is empty.</p>' : ''}
          ${appState.cart.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <div>
                <h4 style="font-weight: 600;">${item.name}</h4>
                <p style="color: var(--primary); font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div class="qty-stepper">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
              </div>
            </div>
          `).join('')}
        </div>

        ${appState.cart.length > 0 ? `
          <div style="padding: 24px; background: var(--surface-container-low);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; font-weight: 700; font-size: 18px;">
              <span>Subtotal</span><span>$${subtotal.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="proceedToCheckout()">Proceed to Checkout</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};

// --- Checkout & Tracking Logic ---
window.proceedToCheckout = () => {
  toggleCart();
  navigate('checkout');
};

window.togglePaymentFields = (isCard) => {
  const labels = document.querySelectorAll('input[name="payment"]');
  labels.forEach(input => {
    input.parentElement.style.borderColor = input.checked ? 'var(--primary)' : 'transparent';
    input.parentElement.style.background = input.checked ? 'var(--surface-lowest)' : 'var(--surface-container-low)';
  });
  document.getElementById('card-fields').style.display = isCard ? 'block' : 'none';
};

window.placeOrder = () => {
  if (appState.cart.length === 0) return;
  
  const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + (subtotal * 0.05);
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  
  const newOrder = {
    id: Math.floor(Math.random() * 900000) + 100000,
    userEmail: appState.currentUser.email,
    items: [...appState.cart],
    total: total,
    status: 'Preparing',
    timestamp: Date.now(),
    paymentMethod: paymentMethod === 'card' ? 'Online Card' : 'Cash on Delivery'
  };

  appState.orders.push(newOrder);
  saveOrders();
  
  // Clear cart
  appState.cart = [];
  saveCart();
  updateCartBadge();

  // Go to tracking
  appState.activeOrderId = newOrder.id;
  navigate('tracking');
  startFakeTracking(newOrder.id);
};

window.viewOrderTracking = (orderId) => {
  appState.activeOrderId = orderId;
  navigate('tracking');
  const order = appState.orders.find(o => o.id === orderId);
  if (order && order.status !== 'Delivered') {
    startFakeTracking(orderId);
  }
};

window.startFakeTracking = (orderId) => {
  const statusEl = document.getElementById('tracking-status');
  if (!statusEl) return;

  let currentOrder = appState.orders.find(o => o.id === orderId);

  // Fake timeline
  statusEl.innerText = "Order arriving in 11 mins";
  currentOrder.status = "On the way";
  saveOrders();

  setTimeout(() => {
    const el = document.getElementById('tracking-status');
    if(el && appState.activeOrderId === orderId) {
      el.innerText = "Agent is near your location (2 mins left)";
    }
  }, 10000); // After 10s of animation

  setTimeout(() => {
    const el = document.getElementById('tracking-status');
    if(el && appState.activeOrderId === orderId) {
      el.innerText = "Arrived at your location!";
      el.style.color = "var(--success)";
      
      const map = document.getElementById('live-map');
      if(map) map.style.display = 'none';
    }
    
    currentOrder.status = "Delivered";
    saveOrders();
    // re-render if we are still on the page to show checkmark
    if(appState.currentPage === 'tracking' && appState.activeOrderId === orderId){
        renderApp();
    }
  }, 20000); // Finish animation
};

// --- Init ---
document.addEventListener('DOMContentLoaded', renderApp);
