 // Data for Cambodian food items
        const categories = [
            { id: 'all', name: 'All', icon: 'fa-utensils' },
            { id: 'curry', name: 'Curry', icon: 'fa-bowl-rice' },
            { id: 'noodles', name: 'Noodles', icon: 'fa-bowl-food' },
            { id: 'grilled', name: 'Grilled', icon: 'fa-fire' },
            { id: 'soup', name: 'Soup', icon: 'fa-mug-hot' },
            { id: 'salad', name: 'Salad', icon: 'fa-leaf' },
            { id: 'dessert', name: 'Dessert', icon: 'fa-ice-cream' },
            { id: 'drinks', name: 'Drinks', icon: 'fa-glass-water' }
        ];

        const foodItems = [
            {
                id: 1,
                name: "Fish Amok",
                description: "Traditional Khmer curry with fish, coconut milk, and spices, steamed in banana leaves.",
                price: 12.50,
                category: "curry",
                rating: 4.8,
                popular: true,
                recent: true,
                recommended: true,
                image: "fish-amok"
            },
            {
                id: 2,
                name: "Beef Lok Lak",
                description: "Stir-fried marinated beef served with fresh vegetables, rice, and Kampot pepper sauce.",
                price: 14.00,
                category: "grilled",
                rating: 4.7,
                popular: true,
                recent: false,
                recommended: true,
                image: "lok-lak"
            },
            {
                id: 3,
                name: "Khmer Noodle Soup",
                description: "Rice noodles in flavorful broth with beef, bean sprouts, herbs, and lime.",
                price: 9.50,
                category: "noodles",
                rating: 4.5,
                popular: true,
                recent: true,
                recommended: false,
                image: "noodle-soup"
            },
            {
                id: 4,
                name: "Green Mango Salad",
                description: "Fresh green mango salad with dried shrimp, herbs, peanuts, and tangy dressing.",
                price: 8.00,
                category: "salad",
                rating: 4.3,
                popular: false,
                recent: true,
                recommended: true,
                image: "mango-salad"
            },
            {
                id: 5,
                name: "Cambodian BBQ Pork",
                description: "Marinated pork skewers grilled to perfection, served with pickled vegetables.",
                price: 10.50,
                category: "grilled",
                rating: 4.6,
                popular: true,
                recent: false,
                recommended: false,
                image: "bbq-pork"
            },
            {
                id: 6,
                name: "Pumpkin Custard",
                description: "Traditional Khmer dessert made with pumpkin, coconut milk, and palm sugar.",
                price: 6.50,
                category: "dessert",
                rating: 4.4,
                popular: false,
                recent: true,
                recommended: true,
                image: "pumpkin-custard"
            },
            {
                id: 7,
                name: "Sour Soup with Fish",
                description: "Tangy and spicy soup with fish, pineapple, tomatoes, and herbs.",
                price: 11.00,
                category: "soup",
                rating: 4.2,
                popular: false,
                recent: false,
                recommended: true,
                image: "sour-soup"
            },
            {
                id: 8,
                name: "Palm Sugar Iced Coffee",
                description: "Traditional Cambodian iced coffee sweetened with palm sugar.",
                price: 4.50,
                category: "drinks",
                rating: 4.9,
                popular: true,
                recent: true,
                recommended: true,
                image: "khmer-coffee"
            }
        ];

        // Cart state
        let cart = [];
        let activeCategory = 'all';
        let activeTab = 'popular';

        // DOM Elements
        const categoriesGrid = document.getElementById('categoriesGrid');
        const foodGrid = document.getElementById('foodGrid');
        const tabs = document.querySelectorAll('.tab');
        const cartCount = document.getElementById('cartCount');
        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');
        const searchInput = document.getElementById('searchInput');
        const placeOrderBtn = document.getElementById('placeOrderBtn');
        const cartSlider = document.getElementById('cartSlider');
        const closeCartBtn = document.getElementById('closeCart');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSubtotalEl = document.getElementById('cartSubtotal');
        const cartTaxEl = document.getElementById('cartTax');
        const cartTotalEl = document.getElementById('cartTotal');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const overlay = document.getElementById('overlay');
        const cartIcon = document.getElementById('cartIcon');

        // Placeholder images for demo
             const imageMap = {
            'fish-amok': '/images/fish-amok.jpg',
            'lok-lak': '/images/lok-lak.jpg',
            'noodle-soup': '/images/noodle-soup.jpg',
            'mango-salad': '/images/mango-salad.jpg',
            'bbq-pork': '/images/bbq-pork.jpg',
            'pumpkin-custard': '/images/pumpkin-custard.jpg',
            'sour-soup': '/images/sour-soup.jpg',
            'khmer-coffee': '/images/khmer-coffee.jpg'
        };
        // Initialize
        function init() {
            renderCategories();
            renderFoodItems();
            updateCartSummary();
            
            // Add event listeners
            setupEventListeners();
            
            // Handle mobile view
            handleMobileView();
        }

        // Render categories
        function renderCategories() {
            categoriesGrid.innerHTML = '';
            
            categories.forEach(category => {
                const categoryCard = document.createElement('div');
                categoryCard.className = `category-card ${category.id === activeCategory ? 'active' : ''}`;
                categoryCard.dataset.category = category.id;
                
                categoryCard.innerHTML = `
                    <i class="fas ${category.icon} category-icon"></i>
                    <div class="category-name">${category.name}</div>
                `;
                
                categoriesGrid.appendChild(categoryCard);
            });
        }

        // Render food items
        function renderFoodItems() {
            foodGrid.innerHTML = '';
            
            // Filter by category
            let filteredItems = activeCategory === 'all' 
                ? foodItems 
                : foodItems.filter(item => item.category === activeCategory);
            
            // Filter by tab
            if (activeTab === 'popular') {
                filteredItems = filteredItems.filter(item => item.popular);
            } else if (activeTab === 'recent') {
                filteredItems = filteredItems.filter(item => item.recent);
            } else if (activeTab === 'recommended') {
                filteredItems = filteredItems.filter(item => item.recommended);
            }
            
            // Render items
            filteredItems.forEach(item => {
                const foodCard = document.createElement('div');
                foodCard.className = 'food-card';
                
                // Check if item is in cart
                const inCart = cart.some(cartItem => cartItem.id === item.id);
                const cartItem = cart.find(cartItem => cartItem.id === item.id);
                
                foodCard.innerHTML = `
                    <div class="food-image" style="background-image: url('${imageMap[item.image]}')"></div>
                    <div class="food-info">
                        <div class="food-header">
                            <h3 class="food-title">${item.name}</h3>
                            <div class="food-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <p class="food-description">${item.description}</p>
                        <div class="food-actions">
                            <button class="wishlist-btn" data-id="${item.id}" aria-label="Add to wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>${item.rating}</span>
                            </div>
                            <button class="order-btn ${inCart ? 'added' : ''}" data-id="${item.id}">
                                ${inCart ? `Added (${cartItem ? cartItem.quantity : ''})` : 'Order Now'}
                            </button>
                        </div>
                    </div>
                `;
                
                foodGrid.appendChild(foodCard);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.wishlist-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    toggleWishlist(id, this);
                });
            });
            
            document.querySelectorAll('.order-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    addToCart(id, this);
                });
            });
        }

        // Toggle wishlist
        function toggleWishlist(id, button) {
            button.classList.toggle('active');
            const icon = button.querySelector('i');
            
            if (button.classList.contains('active')) {
                icon.className = 'fas fa-heart';
                showNotification(`${getFoodItem(id).name} added to wishlist`);
            } else {
                icon.className = 'far fa-heart';
                showNotification(`${getFoodItem(id).name} removed from wishlist`);
            }
        }

        // Add to cart
        function addToCart(id, button) {
            const item = getFoodItem(id);
            
            // Check if already in cart
            const existingIndex = cart.findIndex(cartItem => cartItem.id === id);
            
            if (existingIndex > -1) {
                // Increase quantity
                cart[existingIndex].quantity += 1;
                button.textContent = `Added (${cart[existingIndex].quantity})`;
                showNotification(`${item.name} quantity increased to ${cart[existingIndex].quantity}`);
            } else {
                // Add to cart
                cart.push({...item, quantity: 1});
                button.textContent = 'Added';
                button.classList.add('added');
                showNotification(`${item.name} added to cart`);
                
                // Open cart slider when adding first item
                if (cart.length === 1) {
                    openCartSlider();
                }
            }
            
            // Update cart count and summary
            updateCartCount();
            updateCartSummary();
            updateCartItems();
        }

        // Update cart items in slider
        function updateCartItems() {
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <p>Add some delicious Khmer food!</p>
                    </div>
                `;
                return;
            }
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image" style="background-image: url('${imageMap[item.image]}')"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}" aria-label="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Add event listeners to cart item buttons
            document.querySelectorAll('.decrease').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    updateCartItemQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.increase').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    updateCartItemQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.dataset.id);
                    removeFromCart(id);
                });
            });
            
            // Update cart totals in slider
            updateCartSliderTotals();
        }

        // Update cart item quantity
        function updateCartItemQuantity(id, change) {
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex === -1) return;
            
            cart[itemIndex].quantity += change;
            
            // If quantity reaches 0, remove item
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
                showNotification(`${getFoodItem(id).name} removed from cart`);
                
                // Update order button
                const orderBtn = document.querySelector(`.order-btn[data-id="${id}"]`);
                if (orderBtn) {
                    orderBtn.textContent = 'Order Now';
                    orderBtn.classList.remove('added');
                }
            } else {
                showNotification(`${getFoodItem(id).name} quantity updated to ${cart[itemIndex].quantity}`);
                
                // Update order button text
                const orderBtn = document.querySelector(`.order-btn[data-id="${id}"]`);
                if (orderBtn) {
                    orderBtn.textContent = `Added (${cart[itemIndex].quantity})`;
                }
            }
            
            // Update UI
            updateCartCount();
            updateCartSummary();
            updateCartItems();
        }

        // Remove item from cart
        function removeFromCart(id) {
            const itemIndex = cart.findIndex(item => item.id === id);
            if (itemIndex === -1) return;
            
            const itemName = cart[itemIndex].name;
            cart.splice(itemIndex, 1);
            
            // Update order button
            const orderBtn = document.querySelector(`.order-btn[data-id="${id}"]`);
            if (orderBtn) {
                orderBtn.textContent = 'Order Now';
                orderBtn.classList.remove('added');
            }
            
            showNotification(`${itemName} removed from cart`);
            
            // Update UI
            updateCartCount();
            updateCartSummary();
            updateCartItems();
            
            // If cart is empty, close slider
            if (cart.length === 0) {
                closeCartSlider();
            }
        }

        // Update cart slider totals
        function updateCartSliderTotals() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            
            cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            cartTaxEl.textContent = `$${tax.toFixed(2)}`;
            cartTotalEl.textContent = `$${total.toFixed(2)}`;
        }

        // Get food item by ID
        function getFoodItem(id) {
            return foodItems.find(item => item.id === id);
        }

        // Update cart count
        function updateCartCount() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        // Update cart summary in sidebar
        function updateCartSummary() {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            
            subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            taxEl.textContent = `$${tax.toFixed(2)}`;
            totalEl.textContent = `$${total.toFixed(2)}`;
        }

        // Open cart slider
        function openCartSlider() {
            cartSlider.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Close cart slider
        function closeCartSlider() {
            cartSlider.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Show notification
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 10px;
                left: 10px;
                background-color: var(--primary);
                color: white;
                padding: 12px 20px;
                border-radius: var(--radius-sm);
                z-index: 1100;
                box-shadow: var(--shadow);
                animation: slideIn 0.3s ease;
                text-align: center;
                font-weight: 500;
            `;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Setup event listeners
        function setupEventListeners() {
            // Category filter
            document.querySelectorAll('.category-card').forEach(card => {
                card.addEventListener('click', function() {
                    // Update active category
                    activeCategory = this.dataset.category;
                    
                    // Update UI
                    document.querySelectorAll('.category-card').forEach(c => {
                        c.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Re-render food items
                    renderFoodItems();
                });
            });
            
            // Tab switching
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Update active tab
                    activeTab = this.dataset.tab;
                    
                    // Update UI
                    tabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Re-render food items
                    renderFoodItems();
                });
            });
            
            // Search
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                if (searchTerm.length > 0) {
                    // Filter food items by search term
                    const filteredItems = foodItems.filter(item => 
                        item.name.toLowerCase().includes(searchTerm) || 
                        item.description.toLowerCase().includes(searchTerm)
                    );
                    
                    // Update food grid
                    foodGrid.innerHTML = '';
                    
                    filteredItems.forEach(item => {
                        const foodCard = document.createElement('div');
                        foodCard.className = 'food-card';
                        
                        const inCart = cart.some(cartItem => cartItem.id === item.id);
                        const cartItem = cart.find(cartItem => cartItem.id === item.id);
                        
                        foodCard.innerHTML = `
                            <div class="food-image" style="background-image: url('${imageMap[item.image]}')"></div>
                            <div class="food-info">
                                <div class="food-header">
                                    <h3 class="food-title">${item.name}</h3>
                                    <div class="food-price">$${item.price.toFixed(2)}</div>
                                </div>
                                <p class="food-description">${item.description}</p>
                                <div class="food-actions">
                                    <button class="wishlist-btn" data-id="${item.id}">
                                        <i class="far fa-heart"></i>
                                    </button>
                                    <div class="rating">
                                        <i class="fas fa-star"></i>
                                        <span>${item.rating}</span>
                                    </div>
                                    <button class="order-btn ${inCart ? 'added' : ''}" data-id="${item.id}">
                                        ${inCart ? `Added (${cartItem ? cartItem.quantity : ''})` : 'Order Now'}
                                    </button>
                                </div>
                            </div>
                        `;
                        
                        foodGrid.appendChild(foodCard);
                    });
                    
                    // Add event listeners to new buttons
                    document.querySelectorAll('.wishlist-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const id = parseInt(this.dataset.id);
                            toggleWishlist(id, this);
                        });
                    });
                    
                    document.querySelectorAll('.order-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const id = parseInt(this.dataset.id);
                            addToCart(id, this);
                        });
                    });
                } else {
                    // If search is empty, re-render normally
                    renderFoodItems();
                }
            });
            
            // Place order button
            placeOrderBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Please add items to your cart before placing an order');
                } else {
                    showNotification(`Order placed successfully! Total: $${totalEl.textContent.substring(1)}`);
                    
                    // Clear cart
                    cart = [];
                    updateCartCount();
                    updateCartSummary();
                    updateCartItems();
                    
                    // Reset order buttons
                    document.querySelectorAll('.order-btn').forEach(btn => {
                        btn.textContent = 'Order Now';
                        btn.classList.remove('added');
                    });
                    
                    // Close cart slider
                    closeCartSlider();
                }
            });
            
            // Checkout button in cart slider
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Your cart is empty');
                    return;
                }
                
                showNotification(`Order placed successfully! Total: $${cartTotalEl.textContent.substring(1)}`);
                
                // Clear cart
                cart = [];
                updateCartCount();
                updateCartSummary();
                updateCartItems();
                
                // Reset order buttons
                document.querySelectorAll('.order-btn').forEach(btn => {
                    btn.textContent = 'Order Now';
                    btn.classList.remove('added');
                });
                
                // Close cart slider
                closeCartSlider();
            });
            
            // Filter button
            document.getElementById('filterBtn').addEventListener('click', function() {
                showNotification('Filter options will be available soon!');
            });
            
            // Cart icon click to open slider
            cartIcon.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Your cart is empty');
                } else {
                    openCartSlider();
                }
            });
            
            // Close cart slider
            closeCartBtn.addEventListener('click', closeCartSlider);
            overlay.addEventListener('click', closeCartSlider);
            
            // Close cart slider on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeCartSlider();
                }
            });
            
            // Prevent cart slider from closing when clicking inside it
            cartSlider.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Handle mobile view
        function handleMobileView() {
            // Make sure cart slider fits mobile screens
            if (window.innerWidth <= 480) {
                cartSlider.style.maxWidth = '100%';
            }
            
            // Add touch event for better mobile interaction
            let touchStartX = 0;
            let touchEndX = 0;
            
            document.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            document.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                
                // Swipe right to close cart slider
                if (cartSlider.classList.contains('open') && touchEndX - touchStartX > 50) {
                    closeCartSlider();
                }
            });
        }
        
        // Send order to Telegram
        function sendTelegram() {
            if (cart.length === 0) {
                showNotification('Please add items to your cart before placing an order');
                return;
            }
            
            const tableNumber = document.getElementById('nub-table').value;
            if (!tableNumber || tableNumber < 1) {
                showNotification('Please enter a valid table number');
                return;
            }
            
            const cartItems = cart.map(item => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;
            
            const message = `📦 NEW ORDER\n\nTable: ${tableNumber}\n\nItems:\n${cartItems}\n\nSubtotal: $${subtotal.toFixed(2)}\nTax: $${tax.toFixed(2)}\nTotal: $${total.toFixed(2)}`;
            const tgUser = "soklay_LTR";
            
            window.open(`https://t.me/${tgUser}?text=${encodeURIComponent(message)}`);
            
            // Clear cart after sending
            cart = [];
            updateCartCount();
            updateCartSummary();
            updateCartItems();
            
            // Reset order buttons
            document.querySelectorAll('.order-btn').forEach(btn => {
                btn.textContent = 'Order Now';
                btn.classList.remove('added');
            });
            
            // Close cart slider
            closeCartSlider();
            
            showNotification('Order sent successfully!');
        }

        // Initialize on load
        document.addEventListener('DOMContentLoaded', init);
        
        // Handle window resize
        window.addEventListener('resize', handleMobileView);