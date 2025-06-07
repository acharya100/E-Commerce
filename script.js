document.addEventListener('DOMContentLoaded', () => {

    // --- DATA ---
    // Product data - in a real app, this would come from an API
    const products = [
        {
            id: 1,
            name: 'iPhone 15 Pro',
            price: 999,
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=512&hei=512&fmt=p-jpg&qlt=80&.v=1692845699233',
            description: 'The ultimate iPhone, powered by the A17 Pro chip.'
        },
        {
            id: 2,
            name: 'iPhone 15',
            price: 799,
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=512&hei=512&fmt=p-jpg&qlt=80&.v=1692923777972',
            description: 'A total powerhouse with the Dynamic Island.'
        },
        {
            id: 3,
            name: 'iPhone 14',
            price: 699,
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-yellow?wid=512&hei=512&fmt=p-jpg&qlt=80&.v=1676505838421',
            description: 'As amazing as ever, with a dual-camera system.'
        },
        {
            id: 4,
            name: 'iPhone SE',
            price: 429,
            image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-se-finish-select-202209-6-1inch-product-red?wid=512&hei=512&fmt=p-jpg&qlt=80&.v=1661477492931',
            description: 'Serious power. Great value. A15 Bionic chip.'
        }
    ];

    // Cart array
    let cart = [];

    // --- DOM ELEMENTS ---
    const productGrid = document.getElementById('product-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-modal');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartQuantitySpan = document.querySelector('.cart-quantity');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');


    // --- FUNCTIONS ---

    // Function to render products on the page
    function renderProducts() {
        productGrid.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Function to render items in the cart
    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Clear cart items

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        updateCartTotals();
    }
    
    // Function to add an item to the cart
    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        renderCart();
    }

    // Function to update item quantity in cart
    function updateQuantity(productId, action) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;

        if (action === 'increase') {
            cartItem.quantity++;
        } else if (action === 'decrease') {
            cartItem.quantity--;
            if (cartItem.quantity <= 0) {
                removeFromCart(productId);
                return; // Exit function early as item is removed
            }
        }
        renderCart();
    }

    // Function to remove an item from the cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }
    
    // Function to update cart total quantity and price
    function updateCartTotals() {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        cartQuantitySpan.textContent = totalQuantity;
        cartTotalSpan.textContent = totalPrice.toFixed(2);
    }
    
    // --- EVENT LISTENERS ---

    // Show/Hide Cart
    cartIcon.addEventListener('click', () => cartModal.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartModal.classList.remove('active'));

    // Add to Cart button clicks
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
            // Optional: Show a quick confirmation
            e.target.textContent = 'Added!';
            setTimeout(() => { e.target.textContent = 'Add to Cart'; }, 1000);
        }
    });

    // Cart interactions (quantity change, remove)
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const productId = parseInt(target.dataset.id);
        
        if (target.classList.contains('quantity-btn')) {
            const action = target.dataset.action;
            updateQuantity(productId, action);
        }

        if (target.classList.contains('remove-item')) {
            removeFromCart(productId);
        }
    });

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Thank you for your purchase! (This is a demo)');
            cart = [];
            renderCart();
            cartModal.classList.remove('active');
        } else {
            alert('Your cart is empty!');
        }
    });

    // --- INITIALIZATION ---
    renderProducts();
});