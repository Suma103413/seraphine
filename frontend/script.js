// Global Cart Management
let cart = JSON.parse(localStorage.getItem('seraphine_cart')) || [];

function saveCart() {
    localStorage.setItem('seraphine_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    toggleCart(true);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-price');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item">
                        <div>
                            <strong>${item.name}</strong><br>
                            <small>$${item.price.toFixed(2)} x ${item.quantity}</small>
                        </div>
                        <button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:red;cursor:pointer;">&times;</button>
                    </div>
                `;
            });
        }
        
        if (cartTotalElement) {
            cartTotalElement.innerText = `$${total.toFixed(2)}`;
        }
    }
    
    // Checkout page logic
    const checkoutSummary = document.getElementById('checkout-summary');
    const checkoutTotal = document.getElementById('checkout-total');
    if (checkoutSummary) {
        checkoutSummary.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            checkoutSummary.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });
        if (checkoutTotal) checkoutTotal.innerText = `$${total.toFixed(2)}`;
    }
}

// Cart Toggle
function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    
    if (forceOpen === true || !drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    }
}

// Chat UI
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('open');
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input-field');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage('user', msg);
    input.value = '';

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await response.json();
        appendMessage('bot', data.reply);
    } catch (e) {
        appendMessage('bot', 'Apologies, our concierge is momentarily unavailable.');
    }
}

function appendMessage(sender, text) {
    const chatMessages = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', sender);
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // Scroll Animations Observer
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Load Products if on Index
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        fetch('/products')
            .then(res => res.json())
            .then(products => {
                products.forEach(p => {
                    productGrid.innerHTML += `
                        <div class="product-card fade-in">
                            <div class="product-image-container">
                                <img src="${p.imageURL}" alt="${p.name}">
                            </div>
                            <h3 class="product-title">${p.name}</h3>
                            <div class="product-price">$${p.price.toFixed(2)}</div>
                            <button class="btn" onclick="addToCart(${p.id}, '${p.name}', ${p.price})">Add to Bag</button>
                        </div>
                    `;
                });
                // Re-observe newly added fade-ins
                document.querySelectorAll('.fade-in').forEach(el => appearOnScroll.observe(el));
            });
    }

    // Checkout Form
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('pay-btn');
            btn.innerText = 'Processing...';
            btn.disabled = true;

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            try {
                const res = await fetch('/process-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cart: cart,
                        total: total,
                        cardNumber: document.getElementById('cc').value,
                        expiry: document.getElementById('exp').value,
                        cvv: document.getElementById('cvv').value
                    })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    cart = [];
                    saveCart();
                    alert('Payment successful! Transaction ID: ' + data.transactionId);
                    window.location.href = '/';
                }
            } catch (err) {
                alert('Payment failed.');
            } finally {
                btn.innerText = 'Complete Purchase';
                btn.disabled = false;
            }
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('contact-btn');
            btn.innerText = 'Sending...';

            try {
                const res = await fetch('/contact-submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value,
                        message: document.getElementById('message').value
                    })
                });
                const data = await res.json();
                alert(data.message);
                contactForm.reset();
            } catch (err) {
                alert('Failed to send message.');
            } finally {
                btn.innerText = 'Send Message';
            }
        });
    }
});
