
document.addEventListener('DOMContentLoaded', function () {
    // 1. Проверка авторизации и Куки (localStorage)
    checkAuth();

    const aftonVideo = document.getElementById('afton-video');
    if (aftonVideo) aftonVideo.volume = 0.5;

    // 2. Логика админ-ссылки
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        let adminClicked = false;
        adminLink.addEventListener('click', function (e) {
            if (adminClicked) return;

            adminClicked = true;
            this.style.color = 'red';
            this.style.cursor = 'default';
            this.style.textDecoration = 'none';

            // Скример перехода
            const jumpscare = document.getElementById('secret-jumpscare');
            if (jumpscare) jumpscare.style.display = 'block';

            const helloSound = new Audio('/sounds/Bbhello.oga');
            helloSound.volume = 0.2;
            helloSound.play().catch(err => console.log('Audio play failed', err));

            setTimeout(function () {
                window.location.href = '/Game/SecretMenu';
            }, 800);
        });
    }

    // 3. Render Shop Items
    const container = document.getElementById('shop-container');
    if (container) {
        console.log("Found shop container, rendering products...");
        renderShop();
    } else {
        console.error("Shop container not found!");
    }

    // 4. Cart Logic (Initial UI update if needed, though render handles init state)
});

// --- SHOP DATA & LOGIC ---

const products = [
    // PIZZAS
    {
        id: 'pizza_chili',
        name: 'Chili Pepper Pizza',
        price: 19.87,
        image: '/images/pizza_chili.png',
        type: 'pizza'
    },
    {
        id: 'pizza_pepperoni',
        name: 'Pepperoni Pizza',
        price: 15.50,
        image: '/images/pizza_chili.png', // Placeholder
        type: 'pizza'
    },
    {
        id: 'pizza_cheese',
        name: 'Classic Cheese Pizza',
        price: 12.00,
        image: '/images/pizza_chili.png', // Placeholder
        type: 'pizza'
    },

    // PLUSHIES
    {
        id: 'plush_freddy',
        name: 'Freddy Plushie',
        price: 14.99,
        image: '/images/freddy_plush.jpg',
        type: 'plush'
    },
    {
        id: 'plush_bonnie',
        name: 'Bonnie Plushie',
        price: 14.99,
        image: '/images/bonnie_plush.jpg',
        type: 'plush'
    },
    {
        id: 'plush_chica',
        name: 'Chica Plushie',
        price: 14.99,
        image: '/images/freddy_plush.jpg', // Placeholder
        type: 'plush'
    },
    {
        id: 'plush_foxy',
        name: 'Foxy Plushie',
        price: 16.99,
        image: '/images/freddy_plush.jpg', // Placeholder
        type: 'plush'
    }
];

let cart = [];
let hasPizza = false;
let hasPlush = false;
let noseCount = 0;

function renderShop() {
    const container = document.getElementById('shop-container');
    if (!container) return;

    container.innerHTML = '';

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <button class="buy-btn" data-id="${p.id}">ADD TO CART</button>
        `;
        // Add event listener directly to button to avoid inline onclick issues
        const btn = card.querySelector('.buy-btn');
        btn.addEventListener('click', () => addToCart(p.id));

        container.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    cart.push(product);

    // Game Logic Checks
    if (product.type === 'pizza') hasPizza = true;
    if (product.type === 'plush') hasPlush = true;
    checkGlitch();

    // UI Updates
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.textContent = cart.length;
        countEl.classList.add('bump');
        setTimeout(() => countEl.classList.remove('bump'), 300);
    }

    console.log("Added to cart: " + product.name);
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    const cartList = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');

    if (!modal || !cartList || !totalEl) return;

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <span class="remove-item" style="cursor:pointer; color:red; margin-left:10px;">[X]</span>
        `;

        itemRow.querySelector('.remove-item').addEventListener('click', () => removeFromCart(index));
        cartList.appendChild(itemRow);
    });

    totalEl.textContent = total.toFixed(2);
    modal.style.display = 'flex';
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.style.display = 'none';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    openCart(); // Re-render logic
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.length;
}

function processCheckout() {
    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');

    const name = nameInput ? nameInput.value : '';
    const email = emailInput ? emailInput.value : '';

    if (!name || !email) {
        alert("PLEASE IDENTIFY YOURSELF (Name and Email required)");
        return;
    }

    if (cart.length === 0) {
        alert("CART EMPTY. PURCHASE REQUIRED.");
        return;
    }

    // Success Simulation
    alert(`ORDER PROCESSED FOR ${name.toUpperCase()}.\nTHANK YOU FOR CHOOSING FAZBEAR ENTERTAINMENT.`);

    cart = [];
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = 0;

    closeCart();

    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
}

// --- Game Logic ---

function checkGlitch() {
    // Если купил всё — можно намекнуть игроку глитчем
    if (hasPizza && hasPlush) {
        const glitch = document.querySelector('.monitor-glitch');
        if (glitch) {
            glitch.style.opacity = '0.2';
            setTimeout(() => glitch.style.opacity = '0', 300);
        }
    }
}

// Nose Honk Logic
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'nose-trigger') {
        const audioEl = document.getElementById('honk-sound');
        if (audioEl) {
            audioEl.currentTime = 0;
            audioEl.play().catch(e => console.log('Audio play error', e));
        }

        // Эффект нажатия (визуальный отклик)
        const poster = document.getElementById('freddy-poster');
        if (poster) {
            poster.style.transform = 'scale(0.95)';
            setTimeout(() => poster.style.transform = 'scale(1)', 100);
        }

        // Логика квеста
        if (hasPizza && hasPlush) {
            noseCount++;
            console.log("Nose clicks:", noseCount);
            if (noseCount >= 5) {
                const overlay = document.getElementById('secret-video-overlay');
                if (overlay) {
                    overlay.style.display = 'block'; // fadeIn equiv
                    // simplified fade in just show it
                }
                const video = document.getElementById('afton-video');
                if (video) video.play();
            }
        }
    }
});


// Функции регистрации
function login() {
    const userInput = document.getElementById('username');
    const user = userInput ? userInput.value : '';
    if (user.length > 1) {
        localStorage.setItem('faz_user', user);
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'none'; // fadeOut equiv
    }
}

function checkAuth() {
    const savedUser = localStorage.getItem('faz_user');
    if (!savedUser) {
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'block';
    } else {
        const overlay = document.getElementById('login-overlay');
        if (overlay) overlay.style.display = 'none';
    }
}