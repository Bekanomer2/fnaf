
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    checkSecretDoor(); // Check if user already owns the key

    const aftonVideo = document.getElementById('afton-video');
    if (aftonVideo) aftonVideo.volume = 0.5;

    // --- ADMIN LINK ---
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
        let adminClicked = false;
        adminLink.addEventListener('click', function (e) {
            if (adminClicked) return;
            adminClicked = true;
            this.style.color = 'red';
            this.style.cursor = 'default';
            this.style.textDecoration = 'none';

            // Jumpscare
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

    // --- INTERACTIVE DOOR ---
    const door = document.getElementById('interactive-door');
    if (door) {
        door.addEventListener('click', function () {
            const overlay = document.getElementById('secret-video-overlay');
            const vid = document.getElementById('afton-video');
            if (overlay && vid) {
                overlay.style.display = 'flex'; // Use flex to center
                vid.currentTime = 0;
                vid.play().catch(e => console.error("Video play error:", e));
            }
        });
    }

    // --- INITIAL RENDER ---
    renderShop('all');
});

function closeSecretVideo() {
    const overlay = document.getElementById('secret-video-overlay');
    const vid = document.getElementById('afton-video');
    if (vid) {
        // Reloading the iframe stops the video
        const src = vid.src;
        // Strip autoplay if present so it doesn't start again in background potentially (though hidden)
        // actually just re-setting it is fine, or setting to 'about:blank' then back.
        // Simplest: just reload src.
        vid.src = src;
    }
    if (overlay) overlay.style.display = 'none';
}

// --- SHOP DATA ---
const products = [
    // PIZZAS
    { id: 'pizza_chili', name: 'Chili Pepper Pizza', price: 19.87, image: '/images/pizza_chili.png', type: 'pizza' },
    { id: 'pizza_pepperoni', name: 'Pepperoni Pizza', price: 15.50, image: '/images/pizza_chili.png', type: 'pizza' }, // Valid placeholder
    { id: 'pizza_cheese', name: 'Classic Cheese Pizza', price: 12.00, image: '/images/pizza_chili.png', type: 'pizza' },
    { id: 'pizza_fredbear', name: 'Fredbear Special', price: 29.99, image: '/images/pizza_chili.png', type: 'pizza' },
    { id: 'pizza_midnight', name: 'Midnight Snack', price: 12.50, image: '/images/pizza_chili.png', type: 'pizza' },

    // PLUSHIES
    { id: 'plush_freddy', name: 'Freddy Plushie', price: 14.99, image: '/images/freddy_plush.jpg', type: 'plush' },
    { id: 'plush_bonnie', name: 'Bonnie Plushie', price: 14.99, image: '/images/bonnie_plush.jpg', type: 'plush' },
    { id: 'plush_chica', name: 'Chica Plushie', price: 14.99, image: '/images/freddy_plush.jpg', type: 'plush' },
    { id: 'plush_foxy', name: 'Foxy Plushie', price: 16.99, image: '/images/freddy_plush.jpg', type: 'plush' },
    { id: 'plush_golden', name: 'Golden Freddy Plush', price: 99.99, image: '/images/freddy_plush.jpg', type: 'plush' },

    // MERCH
    { id: 'shirt_security', name: 'Security Guard Shirt', price: 24.99, image: '/images/shirt_security.png', type: 'merch' }, // Placeholder if needed
    { id: 'shirt_purple', name: 'Purple Hoodie', price: 39.99, image: '/images/hoodie_purple.png', type: 'merch' },
    { id: 'cap_fazbear', name: 'Fazbear Cap', price: 14.99, image: '/images/cap_fazbear.png', type: 'merch' },

    // SPECIAL
    { id: 'key_safety', name: 'Safety Key', price: 1987.00, image: '/images/key_safety.png', type: 'key' }
];

let cart = [];
let currentCategory = 'all';

// --- RENDER & FILTERS ---
function filterShop(category) {
    currentCategory = category;

    // Update active button state
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category === 'all' ? 'all' : category) ||
            (category === 'plush' && btn.textContent.includes('PLUSHIES'))) {
            btn.classList.add('active');
        }
    });

    renderShop(category);
}

function renderShop(category) {
    const container = document.getElementById('shop-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = (category === 'all')
        ? products
        : products.filter(p => p.type === category || (category === 'merch' && p.type === 'key')); // Show key in Merch or All? Let's show in All mainly, or maybe Merch.

    // Let's ensure 'key' shows up in 'all' and maybe 'merch' users usually check merch.
    // Logic above: if Category is All, show everything.
    // If Category is Pizza, show Pizza.
    // If Category is Plush, show Plush.
    // If Category is Merch, show Merch AND Key (since Key is special item).

    filtered.forEach(p => {
        // Special render for Secret Key if desired, but standard card is fine
        const card = document.createElement('div');
        card.className = 'shop-card';
        // Use a generic placeholder if image fails loading (client logic) or just use the path
        // For simple impl, we trust the path.

        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" onerror="this.src='/images/fazbear_logo.png'">
            <h3>${p.name}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <button class="buy-btn" data-id="${p.id}">ADD TO CART</button>
        `;

        card.querySelector('.buy-btn').addEventListener('click', () => addToCart(p.id));
        container.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    cart.push(product);
    updateCartUI();
    // Animation
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.classList.add('bump');
        setTimeout(() => countEl.classList.remove('bump'), 300);
    }
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cart.length;
}

// --- CART MODAL ---
function openCart() {
    const modal = document.getElementById('cart-modal');
    const cartList = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    if (!modal || !cartList || !totalEl) return;

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <span style="cursor:pointer; color:red; margin-left:10px;" onclick="removeFromCart(${index})">[X]</span>
        `;
        cartList.appendChild(row);
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
    openCart(); // Re-render modal
    updateCartUI();
}

// --- CHECKOUT & API ---
async function processCheckout() {
    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');
    const name = nameInput ? nameInput.value : '';
    const email = emailInput ? emailInput.value : '';

    if (!name || !email) {
        alert("PLEASE IDENTIFY YOURSELF (Name and Email required)");
        return;
    }
    if (cart.length === 0) {
        alert("CART EMPTY.");
        return;
    }

    // Prepare Grid
    const orderData = {
        CustomerName: name,
        CustomerEmail: email,
        TotalAmount: cart.reduce((sum, item) => sum + item.price, 0),
        Items: cart.map(item => ({
            ProductId: item.id,
            Quantity: 1, // Simplified Quantity
            Price: item.price
        }))
    };

    try {
        const response = await fetch('/api/shop/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const result = await response.json();
            alert(`ORDER PROCESSED ID #${result.orderId}.\nTHANK YOU.`);

            // Check for Secret Key
            if (cart.some(p => p.id === 'key_safety')) {
                localStorage.setItem('faz_key_owned', 'true');
                checkSecretDoor();
                alert("YOU ACQUIRED THE SAFETY KEY. A NEW AREA IS OPEN.");
            }

            cart = [];
            updateCartUI();
            closeCart();
            nameInput.value = '';
            emailInput.value = '';
        } else {
            alert("ERROR PROCESSING ORDER. TRY AGAIN.");
        }
    } catch (e) {
        console.error("Checkout Error:", e);
        alert("CONNECTION ERROR.");
    }
}

// --- SECRET & GAME LOGIC ---
function checkSecretDoor() {
    const hasKey = localStorage.getItem('faz_key_owned');
    const doorContainer = document.getElementById('secret-door-container');
    const door = document.getElementById('interactive-door');
    const plate = door ? door.querySelector('.door-plate') : null;
    const scanner = document.getElementById('scanner-light');
    const statusText = document.getElementById('door-status-text');
    const hint = document.getElementById('door-hint');

    if (hasKey && door && plate) {
        // UNLOCKED STATE
        plate.style.borderColor = '#d4af37'; // Gold
        plate.style.cursor = 'pointer';
        plate.style.background = '#333';
        if (scanner) {
            scanner.style.background = '#0f0'; // Green
            scanner.style.boxShadow = '0 0 15px #0f0';
            scanner.parentElement.style.borderColor = '#0f0';
        }
        if (statusText) {
            statusText.textContent = "[ ACCESS GRANTED ]";
            statusText.style.color = '#0f0';
        }
        if (hint) hint.textContent = "CLICK TO ENTER";

        // Add click listener only if unlocked
        // Add click listener only if unlocked
        door.onclick = function () {
            const overlay = document.getElementById('secret-video-overlay');
            const vid = document.getElementById('afton-video');
            if (overlay && vid) {
                overlay.style.display = 'flex';
                // Trigger play by appending autoplay
                let src = vid.src;
                if (!src.includes('autoplay=1')) {
                    vid.src = src + "&autoplay=1";
                } else {
                    vid.src = src; // reload to restart
                }
            }
        };
    } else {
        // LOCKED STATE (Default HTML is locked, just ensure no click)
        if (door) door.onclick = () => alert("ACCESS DENIED. AUTHORIZED PERSONNEL ONLY.");
    }
}

// Nose Honk (Legacy)
document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'nose-trigger') {
        const audioEl = document.getElementById('honk-sound');
        if (audioEl) {
            audioEl.currentTime = 0;
            audioEl.play().catch(e => console.log('Audio play error', e));
        }
    }
});

// Auth (Legacy)
function checkAuth() {
    const savedUser = localStorage.getItem('faz_user');
    const overlay = document.getElementById('login-overlay');
    if (overlay) overlay.style.display = savedUser ? 'none' : 'block';
}