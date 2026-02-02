 document.addEventListener('DOMContentLoaded', function() {
            // Initialize cart
            let cart = [];
            let cartCount = 0;
            let totalPrice = 0;
            
            // Telegram Configuration
            const TELEGRAM_USERNAME = 'jiro_uvu_7';
            
            // Product images data
            const productImages = [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
            ];
            
            // DOM Elements
            const categories = document.querySelectorAll('.category');
            const cartSidebar = document.querySelector('.cart-sidebar');
            const filterSidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.overlay');
            
            // Initialize
            loadFeaturedProducts();
            loadAllProducts();
            updateCart();
            initializeCheckoutModal();
            
            // Category selection
            categories.forEach(category => {
                category.addEventListener('click', function() {
                    categories.forEach(cat => cat.classList.remove('active'));
                    this.classList.add('active');
                    filterProductsByCategory(this.textContent);
                });
            });
            
            // See more button
            document.querySelector('.see-more').addEventListener('click', function() {
                showNotification('Loading more products...', 'info');
                
                setTimeout(() => {
                    const productsGrid = document.querySelector('.products-grid');
                    const newProduct = document.createElement('div');
                    newProduct.className = 'product-card';
                    newProduct.innerHTML = `
                        <div class="product-image">
                            <img src="${productImages[2]}" alt="Puma Suede Classic" class="product-img">
                            <div class="product-overlay">
                                <button class="quick-view">Quick View</button>
                            </div>
                        </div>
                        <div class="stock-info">8 stocks left</div>
                        <div class="rating">
                            ${generateStars(4.0)}
                            <span class="review-count">150 Review</span>
                        </div>
                        <div class="product-name">Puma - Suede Classic</div>
                        <div class="product-price">$89.99</div>
                        <button class="add-to-cart">Add to cart</button>
                    `;
                    
                    productsGrid.appendChild(newProduct);
                    
                    // Add event listeners
                    newProduct.querySelector('.add-to-cart').addEventListener('click', function() {
                        const productName = 'Puma - Suede Classic';
                        addToCart(productName);
                        showNotification(`${productName} added to cart!`);
                    });
                    
                    newProduct.querySelector('.quick-view').addEventListener('click', function(e) {
                        e.stopPropagation();
                        openQuickView(newProduct);
                    });
                    
                    showNotification('New products loaded!');
                }, 1000);
            });
            
            // Bottom navigation functionality
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const target = this.getAttribute('data-target');
                    
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                    
                    if (this.getAttribute('href') === '#cart') {
                        openCart();
                        return;
                    }
                    
                    switch(target) {
                        case 'home':
                            showHomePage();
                            break;
                        case 'products':
                            scrollToProducts();
                            break;
                        case 'profile':
                            showProfilePage();
                            break;
                    }
                });
            });
            
            // Back to home button
            document.querySelector('.back-btn').addEventListener('click', function() {
                showHomePage();
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                document.querySelector('.nav-item[data-target="home"]').classList.add('active');
            });
            
            // Profile item click handlers
            document.querySelectorAll('.profile-item').forEach(item => {
                item.addEventListener('click', function() {
                    const profileInfo = this.querySelector('.profile-info h4').textContent;
                    showNotification(`Opening ${profileInfo}...`, 'info');
                    
                    setTimeout(() => {
                        showNotification(`${profileInfo} page loaded`, 'success');
                    }, 500);
                });
            });
            
            // Edit profile button
            document.querySelector('.edit-profile').addEventListener('click', function() {
                showNotification('Edit profile feature coming soon!', 'info');
            });
            
            // Logout button
            document.querySelector('.logout-btn').addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    showNotification('Logged out successfully!', 'info');
                    showHomePage();
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    document.querySelector('.nav-item[data-target="home"]').classList.add('active');
                }
            });
            
            // Filter toggle button
            document.querySelector('.filter-toggle').addEventListener('click', openFilters);
            
            // Close sidebar buttons
            document.querySelector('.close-sidebar').addEventListener('click', closeFilters);
            document.querySelector('.close-cart').addEventListener('click', closeCart);
            
            // Apply filters button
            document.querySelector('.apply-filters').addEventListener('click', function() {
                const selectedRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked'))
                    .map(checkbox => checkbox.value);
                const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
                    .map(checkbox => checkbox.value);
                
                showNotification(`Applied ${selectedRatings.length + selectedBrands.length} filters`);
                closeFilters();
            });
            
            // Color selection
            document.querySelectorAll('.color-option').forEach(color => {
                color.addEventListener('click', function() {
                    document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Size selection
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Sellers list
            document.querySelectorAll('.seller-item').forEach(seller => {
                seller.addEventListener('click', function() {
                    if (this.classList.contains('see-more')) {
                        showNotification('Loading more sellers...', 'info');
                        return;
                    }
                    
                    const sellerName = this.textContent;
                    showNotification(`Showing products from ${sellerName}`);
                });
            });
            
            // Checkout button in cart
            document.querySelector('.checkout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                if (cart.length === 0) {
                    showNotification('Your cart is empty!', 'error');
                    return;
                }
                openCheckoutModal();
            });
            
            // Overlay click
            overlay.addEventListener('click', function() {
                closeFilters();
                closeCart();
                closeCheckoutModal();
                closeSuccessModal();
            });
            
           // Search functionality
    document.querySelector('.search-btn').addEventListener('click', searchProducts);
    document.querySelector('.search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    document.querySelector('.clear-search').addEventListener('click', function() {
        document.querySelector('.search-input').value = '';
        document.getElementById('search-results').style.display = 'none';
        this.style.display = 'none';
        
        // Show all products
        document.querySelectorAll('#all-products-grid .product-card').forEach(card => {
            card.style.display = 'block';
        });
    });
    
    document.querySelector('.search-input').addEventListener('input', function() {
        if (this.value.trim()) {
            document.querySelector('.clear-search').style.display = 'flex';
        } else {
            document.querySelector('.clear-search').style.display = 'none';
        }
    });
            // Quick view modal
            document.querySelector('.close-modal').addEventListener('click', closeQuickView);
            
            document.querySelector('.product-modal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeQuickView();
                }
            });
            
            document.querySelector('.add-to-cart-modal').addEventListener('click', function() {
                const productName = document.getElementById('modalProductName').textContent;
                addToCart(productName);
                showNotification(`${productName} added to cart!`);
                closeQuickView();
            });
            
            document.querySelector('.buy-now').addEventListener('click', function() {
                const productName = document.getElementById('modalProductName').textContent;
                addToCart(productName);
                showNotification(`Purchase successful! ${productName} added to cart.`, 'success');
                closeQuickView();
                openCart();
            });
            
            // Functions
            function loadFeaturedProducts() {
                const productsGrid = document.getElementById('featured-products-grid');
                
                const featuredProducts = [
                    {
                        name: 'Nike - Air Max 270',
                        stock: 8,
                        rating: 4.7,
                        reviews: 320,
                        price: 149.99,
                        image: productImages[0]
                    },
                    {
                        name: 'Adidas - Ultraboost',
                        stock: 15,
                        rating: 4.5,
                        reviews: 280,
                        price: 129.99,
                        image: productImages[1]
                    },
                    {
                        name: 'Puma - Cali Sport',
                        stock: 6,
                        rating: 4.3,
                        reviews: 150,
                        price: 79.99,
                        image: productImages[2]
                    },
                    {
                        name: 'Leather Jacket',
                        stock: 10,
                        rating: 4.6,
                        reviews: 210,
                        price: 119.99,
                        image: productImages[3]
                    }
                ];
                
                featuredProducts.forEach((product) => {
                    const productCard = createProductCard(product);
                    productsGrid.appendChild(productCard);
                });
            }
            
            function loadAllProducts() {
                const allProductsGrid = document.getElementById('all-products-grid');
                
                const allProducts = [
                    {
                        name: 'Nike - Air Max 270',
                        stock: 8,
                        rating: 4.7,
                        reviews: 320,
                        price: 149.99,
                        image: productImages[0]
                    },
                    {
                        name: 'Adidas - Superstar',
                        stock: 15,
                        rating: 4.5,
                        reviews: 280,
                        price: 89.99,
                        image: productImages[1]
                    },
                    {
                        name: 'Puma - Cali Sport',
                        stock: 6,
                        rating: 4.3,
                        reviews: 150,
                        price: 79.99,
                        image: productImages[2]
                    },
                    {
                        name: 'Levi\'s Denim Jacket',
                        stock: 10,
                        rating: 4.6,
                        reviews: 210,
                        price: 119.99,
                        image: productImages[3]
                    },
                    {
                        name: 'Vans - Old Skool',
                        stock: 20,
                        rating: 4.4,
                        reviews: 180,
                        price: 69.99,
                        image: productImages[4]
                    },
                    {
                        name: 'Converse - Chuck Taylor',
                        stock: 12,
                        rating: 4.5,
                        reviews: 250,
                        price: 59.99,
                        image: productImages[5]
                    },
                    {
                        name: 'New Balance - 574',
                        stock: 7,
                        rating: 4.2,
                        reviews: 95,
                        price: 89.99,
                        image: productImages[6]
                    },
                    {
                        name: 'Reebok - Classic',
                        stock: 9,
                        rating: 4.3,
                        reviews: 120,
                        price: 74.99,
                        image: productImages[7]
                    }
                ];
                
                allProducts.forEach((product) => {
                    const productCard = createProductCard(product);
                    allProductsGrid.appendChild(productCard);
                });
            }
            
            function createProductCard(product) {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" class="product-img">
                        <div class="product-overlay">
                            <button class="quick-view">Quick View</button>
                        </div>
                    </div>
                    <div class="stock-info">${product.stock} stocks left</div>
                    <div class="rating">
                        ${generateStars(product.rating)}
                        <span class="review-count">${product.reviews} Review</span>
                    </div>
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart">Add to cart</button>
                `;
                
                // Add event listeners
                productCard.querySelector('.add-to-cart').addEventListener('click', function() {
                    addToCart(product.name, product.price, product.image);
                    showNotification(`${product.name} added to cart!`);
                });
                
                productCard.querySelector('.quick-view').addEventListener('click', function(e) {
                    e.stopPropagation();
                    openQuickView(productCard);
                });
                
                return productCard;
            }
            
            function addToCart(productName, productPrice, productImage) {
                // Check if product already in cart
                const existingItem = cart.find(item => item.name === productName);
                
                if (existingItem) {
                    existingItem.quantity++;
                    existingItem.total = existingItem.price * existingItem.quantity;
                } else {
                    // Find product to get correct price and image if not provided
                    let price = productPrice;
                    let image = productImage;
                    
                    if (!price || !image) {
                        // Try to find in featured products
                        const featuredProducts = document.querySelectorAll('#featured-products-grid .product-card');
                        const allProducts = document.querySelectorAll('#all-products-grid .product-card');
                        const allProductElements = [...featuredProducts, ...allProducts];
                        
                        allProductElements.forEach(card => {
                            const name = card.querySelector('.product-name').textContent;
                            if (name === productName) {
                                const priceText = card.querySelector('.product-price').textContent;
                                price = parseFloat(priceText.replace('$', ''));
                                image = card.querySelector('.product-img').src;
                            }
                        });
                    }
                    
                    // If price not found, generate random
                    if (!price) {
                        price = Math.floor(Math.random() * 80) + 40;
                    }
                    
                    if (!image) {
                        image = productImages[0];
                    }
                    
                    cart.push({
                        name: productName,
                        price: price,
                        quantity: 1,
                        total: price,
                        image: image
                    });
                }
                
                updateCart();
            }
            
            function updateCart() {
                const cartItemsContainer = document.querySelector('.cart-items');
                const cartCountElement = document.querySelector('.cart-count');
                const totalPriceElement = document.querySelector('.total-price');
                
                // Clear cart items
                cartItemsContainer.innerHTML = '';
                
                // Update cart count
                cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCountElement.textContent = cartCount;
                
                // Calculate total price
                totalPrice = cart.reduce((sum, item) => sum + item.total, 0);
                totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
                
                // If cart is empty
                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = `
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <p>Your cart is empty</p>
                        </div>
                    `;
                    return;
                }
                
                // Add cart items
                cart.forEach((item, index) => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-actions">
                                <button class="quantity-btn minus" data-index="${index}">-</button>
                                <span class="item-quantity">${item.quantity}</span>
                                <button class="quantity-btn plus" data-index="${index}">+</button>
                                <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
                            </div>
                        </div>
                    `;
                    
                    cartItemsContainer.appendChild(cartItem);
                });
                
                // Add event listeners to quantity buttons
                document.querySelectorAll('.quantity-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        const item = cart[index];
                        
                        if (this.classList.contains('minus')) {
                            if (item.quantity > 1) {
                                item.quantity--;
                                item.total = item.price * item.quantity;
                            } else {
                                cart.splice(index, 1);
                            }
                        } else if (this.classList.contains('plus')) {
                            item.quantity++;
                            item.total = item.price * item.quantity;
                        }
                        
                        updateCart();
                    });
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        cart.splice(index, 1);
                        updateCart();
                        showNotification('Item removed from cart', 'warning');
                    });
                });
                
                // Update checkout order summary
                updateCheckoutOrderSummary();
            }
            
            function filterProductsByCategory(category) {
                const products = document.querySelectorAll('.product-card');
                
                products.forEach(product => {
                    const productName = product.querySelector('.product-name').textContent.toLowerCase();
                    
                    if (category === 'All product') {
                        product.style.display = 'block';
                        return;
                    }
                    
                    if (category === 'Sneakers' && (
                        productName.includes('sneakers') || 
                        productName.includes('ultraboost') ||
                        productName.includes('new balance') ||
                        productName.includes('air max') ||
                        productName.includes('superstar') ||
                        productName.includes('vans') ||
                        productName.includes('converse') ||
                        productName.includes('reebok')
                    )) {
                        product.style.display = 'block';
                    } else if (category === 'Jackets' && productName.includes('jacket')) {
                        product.style.display = 'block';
                    } else if (category === 'Accessories') {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
                
                showNotification(`Showing ${category.toLowerCase()}`, 'info');
            }
            
            function showHomePage() {
                document.getElementById('profile-page').classList.remove('active');
                document.getElementById('main-content').style.display = 'block';
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                showNotification('Welcome back to store!', 'info');
            }
            
            function scrollToProducts() {
                document.getElementById('profile-page').classList.remove('active');
                document.getElementById('main-content').style.display = 'block';
                
                const featuredSection = document.getElementById('featured-products');
                if (featuredSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const scrollPosition = featuredSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }
                
                showNotification('Scroll to featured products', 'info');
            }
            
            function showProfilePage() {
                document.getElementById('main-content').style.display = 'none';
                document.getElementById('profile-page').classList.add('active');
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                showNotification('Viewing profile page', 'info');
            }
            
            function openQuickView(productCard) {
                const productModal = document.getElementById('productModal');
                const productImage = productCard.querySelector('.product-img').src;
                const productName = productCard.querySelector('.product-name').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                const productRating = productCard.querySelector('.rating').innerHTML;
                const stockInfo = productCard.querySelector('.stock-info').textContent;
                
                // Set modal content
                document.getElementById('modalProductImage').src = productImage;
                document.getElementById('modalProductName').textContent = productName;
                document.getElementById('modalPrice').textContent = productPrice;
                document.getElementById('modalRating').innerHTML = productRating;
                document.getElementById('modalStock').textContent = stockInfo;
                
                // Set description based on product name
                let description = "High-quality product with premium materials and excellent craftsmanship.";
                if (productName.toLowerCase().includes('nike')) {
                    description = "Nike performance shoes with responsive cushioning and breathable materials.";
                } else if (productName.toLowerCase().includes('jacket')) {
                    description = "Premium leather jacket with multiple color options and comfortable fit.";
                } else if (productName.toLowerCase().includes('puma')) {
                    description = "Puma sports shoes with retro design and modern comfort technology.";
                } else if (productName.toLowerCase().includes('adidas')) {
                    description = "Adidas athletic shoes with innovative design and superior performance.";
                } else if (productName.toLowerCase().includes('balance')) {
                    description = "New Balance shoes with classic design and modern comfort features.";
                }
                
                document.getElementById('modalDescription').textContent = description;
                
                // Show modal
                productModal.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            function closeQuickView() {
                document.getElementById('productModal').classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            function openFilters() {
                filterSidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            function closeFilters() {
                filterSidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            function openCart() {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            function closeCart() {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            function showNotification(message, type = 'success') {
                // Remove existing notifications
                const existingNotification = document.querySelector('.notification');
                if (existingNotification) {
                    existingNotification.remove();
                }
                
                // Create notification
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
                
                document.body.appendChild(notification);
                
                // Remove after 3 seconds
                setTimeout(() => {
                    notification.style.animation = 'slideUp 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }
            
            function generateStars(rating) {
                let stars = '';
                const fullStars = Math.floor(rating);
                const hasHalfStar = rating % 1 >= 0.5;
                
                for (let i = 1; i <= 5; i++) {
                    if (i <= fullStars) {
                        stars += '<i class="fas fa-star"></i>';
                    } else if (i === fullStars + 1 && hasHalfStar) {
                        stars += '<i class="fas fa-star-half-alt"></i>';
                    } else {
                        stars += '<i class="far fa-star"></i>';
                    }
                }
                
                return stars;
            }
            
             function searchProducts() {
        const searchInput = document.querySelector('.search-input');
        const searchTerm = searchInput.value.trim().toLowerCase();
        const searchResults = document.getElementById('search-results');
        const resultsCount = document.getElementById('results-count');
        const searchResultsGrid = document.querySelector('.search-results-grid');
        const noResults = document.getElementById('no-results');
        
        if (!searchTerm) {
            showNotification('Please enter a search term', 'warning');
            return;
        }
        
        const allProducts = document.querySelectorAll('#all-products-grid .product-card');
        const featuredProducts = document.querySelectorAll('#featured-products-grid .product-card');
        const products = [...allProducts, ...featuredProducts];
        
        let foundCount = 0;
        searchResultsGrid.innerHTML = '';
        
        products.forEach(productCard => {
            const productName = productCard.querySelector('.product-name').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                const clonedCard = productCard.cloneNode(true);
                searchResultsGrid.appendChild(clonedCard);
                
                // Re-attach event listeners
                clonedCard.querySelector('.add-to-cart').addEventListener('click', function() {
                    const productName = clonedCard.querySelector('.product-name').textContent;
                    addToCart(productName);
                    showNotification(`${productName} added to cart!`);
                });
                
                clonedCard.querySelector('.quick-view').addEventListener('click', function(e) {
                    e.stopPropagation();
                    openQuickView(clonedCard);
                });
                
                foundCount++;
            }
        });
                
           // Update results
        resultsCount.textContent = `${foundCount} result(s) for "${searchTerm}"`;
        
        if (foundCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
        
        searchResults.style.display = 'block';
        
        // Scroll to results
        searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        showNotification(`Found ${foundCount} product(s)`, 'success');
    }
            
            // Checkout Modal Functions
            function initializeCheckoutModal() {
                const checkoutModal = document.getElementById('checkoutModal');
                const successModal = document.getElementById('successModal');
                const checkoutForm = document.getElementById('checkoutForm');
                
                // Event Listeners for Checkout Modal
                document.querySelector('.close-checkout').addEventListener('click', closeCheckoutModal);
                document.querySelector('.cancel-checkout').addEventListener('click', closeCheckoutModal);
                document.querySelector('.close-success').addEventListener('click', closeSuccessModal);
                
                // Close modal when clicking outside
                checkoutModal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeCheckoutModal();
                    }
                });
                
                successModal.addEventListener('click', function(e) {
                    if (e.target === this) {
                        closeSuccessModal();
                    }
                });
                
                // Form submission
                checkoutForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    processOrder();
                });
            }
            
            function openCheckoutModal() {
                if (cart.length === 0) {
                    showNotification('Your cart is empty!', 'error');
                    return;
                }
                
                const checkoutModal = document.getElementById('checkoutModal');
                
                // Update order summary
                updateCheckoutOrderSummary();
                
                // Reset form
                document.getElementById('checkoutForm').reset();
                
                // Show modal
                checkoutModal.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Auto-focus on first input
                setTimeout(() => {
                    document.getElementById('customerName').focus();
                }, 300);
            }
            
            function closeCheckoutModal() {
                const checkoutModal = document.getElementById('checkoutModal');
                checkoutModal.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            function closeSuccessModal() {
                const successModal = document.getElementById('successModal');
                successModal.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
                showNotification('Thank you for your order!', 'success');
            }
            
            function updateCheckoutOrderSummary() {
                const orderSummary = document.getElementById('modalOrderSummary');
                const orderTotal = document.getElementById('modalOrderTotal');
                
                if (cart.length === 0) {
                    orderSummary.innerHTML = '<p class="empty-cart-text">Cart is empty</p>';
                    orderTotal.textContent = '$0.00';
                    return;
                }
                
                let summaryHTML = '';
                let subtotal = 0;
                
                cart.forEach(item => {
                    subtotal += item.total;
                    summaryHTML += `
                        <div class="order-summary-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>$${item.total.toFixed(2)}</span>
                        </div>
                    `;
                });
                
                // Fixed $2 delivery fee (no tax)
                const deliveryFee = 2.00;
                const total = subtotal + deliveryFee;
                
                summaryHTML += `
                    <div class="order-summary-item">
                        <span>Subtotal</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="order-summary-item">
                        <span>Delivery Fee</span>
                        <span>$${deliveryFee.toFixed(2)}</span>
                    </div>
                `;
                
                orderSummary.innerHTML = summaryHTML;
                orderTotal.textContent = `$${total.toFixed(2)}`;
            }
            
            function processOrder() {
                const submitBtn = document.querySelector('.submit-order');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // Validate form
                if (!validateCheckoutForm()) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Get form data
                const orderData = getOrderData();
                
                // Generate order ID
                const orderId = generateOrderId();
                
                // Send to Telegram
                sendOrderToTelegram(orderData, orderId);
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success modal
                showSuccessModal(orderId);
                
                // Clear cart
                cart = [];
                updateCart();
                
                // Reset form
                document.getElementById('checkoutForm').reset();
            }
            
            function validateCheckoutForm() {
                const requiredFields = ['customerName', 'customerPhone', 'province', 'district', 'commune', 'address'];
                
                for (const fieldId of requiredFields) {
                    const field = document.getElementById(fieldId);
                    if (!field.value.trim()) {
                        showNotification(`Please fill in ${field.placeholder || fieldId}`, 'error');
                        field.focus();
                        return false;
                    }
                }
                
                // Validate phone number
                const phone = document.getElementById('customerPhone').value;
                const phoneRegex = /^[0-9]{8,15}$/;
                if (!phoneRegex.test(phone)) {
                    showNotification('Please enter a valid phone number (8-15 digits)', 'error');
                    document.getElementById('customerPhone').focus();
                    return false;
                }
                
                // Check terms agreement
                if (!document.getElementById('agreeTerms').checked) {
                    showNotification('Please agree to the Terms & Conditions', 'error');
                    return false;
                }
                
                return true;
            }
            
            function getOrderData() {
                const countryCode = document.getElementById('countryCode').value;
                const phone = document.getElementById('customerPhone').value;
                const fullPhone = `${countryCode}${phone}`;
                
                return {
                    customer: {
                        name: document.getElementById('customerName').value,
                        phone: fullPhone
                    },
                    address: {
                        province: document.getElementById('province').value,
                        district: document.getElementById('district').value,
                        commune: document.getElementById('commune').value,
                        street: document.getElementById('address').value,
                        notes: document.getElementById('notes').value || 'No notes'
                    },
                    payment: document.querySelector('input[name="payment"]:checked').value,
                    cart: cart.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        total: item.total
                    })),
                    summary: {
                        subtotal: cart.reduce((sum, item) => sum + item.total, 0),
                        delivery: 2.00,
                        total: cart.reduce((sum, item) => sum + item.total, 0) + 2.00
                    },
                    timestamp: new Date().toLocaleString()
                };
            }
            
            function generateOrderId() {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 1000);
                return `JTS-${timestamp}-${random}`;
            }
            
            function sendOrderToTelegram(orderData, orderId) {
                try {
                    // Format message for Telegram
                    const message = formatTelegramMessage(orderData, orderId);
                    
                    // Encode the message for URL
                    const encodedMessage = encodeURIComponent(message);
                    
                    // Create Telegram URL
                    const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`;
                    
                    // Open Telegram in new tab
                    window.open(telegramUrl, '_blank');
                    
                    // Also log to console for debugging
                    console.log('Order sent to Telegram:', {
                        orderId: orderId,
                        data: orderData,
                        telegramUrl: telegramUrl
                    });
                    
                    return true;
                    
                } catch (error) {
                    console.error('Error sending to Telegram:', error);
                    showNotification('Failed to open Telegram. Please copy order details manually.', 'error');
                    return false;
                }
            }
            
            function formatTelegramMessage(orderData, orderId) {
                const itemsList = orderData.cart.map(item => 
                    `• ${item.name} × ${item.quantity} = $${item.total.toFixed(2)}`
                ).join('\n');
                
                const paymentMethods = {
                    'cash': '💵 Cash on Delivery',
                    'aba': '🏦 ABA Pay',
                    'acleda': '🏛️ Acleda Bank Transfer'
                };
                
                return `🛍️ *NEW ORDER - JONG TINH STORE*

━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* ${orderId}
📅 *Date:* ${orderData.timestamp}

━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER INFORMATION*
• *Name:* ${orderData.customer.name}
• *Phone:* ${orderData.customer.phone}

━━━━━━━━━━━━━━━━━━━━
📍 *DELIVERY ADDRESS*
• *Province:* ${orderData.address.province}
• *District:* ${orderData.address.district}
• *Commune:* ${orderData.address.commune}
• *Address:* ${orderData.address.street}
• *Notes:* ${orderData.address.notes}

━━━━━━━━━━━━━━━━━━━━
🛒 *ORDER ITEMS*
${itemsList}

━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY*
• Subtotal: $${orderData.summary.subtotal.toFixed(2)}
• Delivery: $${orderData.summary.delivery.toFixed(2)}
• *Total: $${orderData.summary.total.toFixed(2)}*

━━━━━━━━━━━━━━━━━━━━
💳 *PAYMENT METHOD*
${paymentMethods[orderData.payment] || orderData.payment}

━━━━━━━━━━━━━━━━━━━━
📦 *STATUS:* 📍 PENDING`;
            }
            
            function showSuccessModal(orderId) {
                const successModal = document.getElementById('successModal');
                document.getElementById('generatedOrderId').textContent = orderId;
                
                closeCheckoutModal();
                successModal.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            // Initialize navigation on page load
            const hash = window.location.hash.substring(1) || 'home';
            const navItem = document.querySelector(`.nav-item[href="#${hash}"]`);
            
            if (navItem) {
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                navItem.classList.add('active');
                
                const target = navItem.getAttribute('data-target');
                
                switch(target) {
                    case 'home':
                        showHomePage();
                        break;
                    case 'products':
                        setTimeout(() => scrollToProducts(), 100);
                        break;
                    case 'profile':
                        showProfilePage();
                        break;
                }
            }
        });