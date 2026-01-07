document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId || !window.productsData) {
        window.location.href = 'index.html#shop';
        return;
    }

    const product = window.productsData.find(p => p.id === productId);
    if (!product) {
        window.location.href = 'index.html#shop';
        return;
    }

    // Populate product details
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-dosage').textContent = product.dosage;
    document.getElementById('product-price').textContent = product.price.toFixed(2);
    document.getElementById('product-stock').textContent = product.stock;

    // Set description (without PRZEZNACZENIE - that's in the red box already)
    document.getElementById('product-description').textContent = product.description;

    // Add chemical parameters as bullet points in separate div
    const paramsDiv = document.getElementById('product-params');
    if (paramsDiv && (product.cas || product.molarMass || product.formula)) {
        let paramsHTML = '';
        if (product.cas) paramsHTML += `<p>• <strong>Nr CAS:</strong> ${product.cas}</p>`;
        if (product.molarMass) paramsHTML += `<p>• <strong>Masa molowa:</strong> ${product.molarMass}</p>`;
        if (product.formula) paramsHTML += `<p>• <strong>Wzór chemiczny:</strong> ${product.formula}</p>`;
        paramsDiv.innerHTML = paramsHTML;
    }

    // Set up image gallery with zoom
    const mainImage = document.getElementById('main-image');
    const thumbnailsContainer = document.getElementById('image-thumbnails');

    if (product.images && product.images.length > 0) {
        mainImage.src = product.images[0];
        mainImage.style.cursor = 'zoom-in';

        // Add click to zoom
        mainImage.addEventListener('click', () => {
            openImageZoom(mainImage.src);
        });

        // Generate thumbnails
        product.images.forEach((imgSrc, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail glass rounded-lg overflow-hidden aspect-square border-2 ${index === 0 ? 'active border-biotune-red' : 'border-transparent'}`;
            thumbnail.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}" class="w-full h-full object-cover">`;

            thumbnail.addEventListener('click', () => {
                mainImage.src = imgSrc;
                document.querySelectorAll('.thumbnail').forEach(t => {
                    t.classList.remove('active', 'border-biotune-red');
                    t.classList.add('border-transparent');
                });
                thumbnail.classList.add('active', 'border-biotune-red');
                thumbnail.classList.remove('border-transparent');
            });

            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < product.stock) {
            quantityInput.value = currentValue + 1;
        }
    });

    quantityInput.addEventListener('input', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) value = 1;
        if (value > product.stock) value = product.stock;
        quantityInput.value = value;
    });

    // Add to cart
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        for (let i = 0; i < quantity; i++) {
            window.addToCart(product);
        }

        // Visual feedback
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Dodano do koszyka!</span>
        `;

        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            quantityInput.value = 1;
        }, 2000);
    });

    // Load reviews
    loadReviews(product);

    // Wishlist Button Logic
    const wishlistBtn = document.getElementById('add-to-wishlist-btn');
    if (wishlistBtn) {
        // Initial state
        if (window.wishlistManager && window.wishlistManager.has(product.id)) {
            wishlistBtn.classList.add('text-biotune-red', 'border-biotune-red');
            wishlistBtn.classList.remove('text-gray-400', 'border-gray-200', 'dark:border-gray-700');
            wishlistBtn.querySelector('svg').setAttribute('fill', 'currentColor');
        }

        wishlistBtn.addEventListener('click', () => {
            if (window.wishlistManager) {
                const added = window.wishlistManager.toggle(product.id);
                if (added) {
                    wishlistBtn.classList.add('text-biotune-red', 'border-biotune-red');
                    wishlistBtn.classList.remove('text-gray-400', 'border-gray-200', 'dark:border-gray-700');
                    wishlistBtn.querySelector('svg').setAttribute('fill', 'currentColor');
                } else {
                    wishlistBtn.classList.remove('text-biotune-red', 'border-biotune-red');
                    wishlistBtn.classList.add('text-gray-400', 'border-gray-200', 'dark:border-gray-700');
                    wishlistBtn.querySelector('svg').setAttribute('fill', 'none');
                }
            }
        });
    }

    // Add Review Button
    const reviewsContainer = document.getElementById('reviews-container');
    const addReviewBtn = document.createElement('button');
    addReviewBtn.className = 'mt-6 bg-gray-200 dark:bg-white/10 text-black dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-white/20 transition-colors font-medium text-sm';
    addReviewBtn.textContent = 'Dodaj opinię';
    addReviewBtn.onclick = () => showAddReviewModal(product);
    reviewsContainer.parentNode.insertBefore(addReviewBtn, reviewsContainer.nextSibling);

    // Load related products
    loadRelatedProducts(product);
});

// Image Zoom Modal
function openImageZoom(imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'zoom-modal active';
    modal.innerHTML = `<img src="${imageSrc}" alt="Zoomed Image">`;

    modal.addEventListener('click', () => {
        modal.remove();
    });

    document.body.appendChild(modal);
}

// Load Reviews
function loadReviews(product) {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-sm italic">Brak opinii dla tego produktu.</p>';
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? '' : 'empty'}">★</span>`;
    }
    return stars;
}

// Load Related Products
function loadRelatedProducts(currentProduct) {
    const relatedContainer = document.getElementById('related-products');

    if (!window.productsData) return;

    // Get 3 random products excluding current one
    const otherProducts = window.productsData.filter(p => p.id !== currentProduct.id);
    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
    const related = shuffled.slice(0, 3);

    relatedContainer.innerHTML = related.map(product => `
        <a href="product.html?id=${product.id}" class="block glass rounded-lg overflow-hidden hover:scale-105 transition-transform">
            <div class="aspect-square bg-gray-200 dark:bg-gray-800">
                <img src="${product.images && product.images[0] ? product.images[0] : './assets/products/placeholder.jpg'}" 
                     alt="${product.name}" 
                     class="w-full h-full object-cover">
            </div>
            <div class="p-4">
                <h3 class="font-bold text-black dark:text-white mb-1">${product.name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${product.dosage}</p>
                <p class="text-lg font-bold text-biotune-red">${product.price.toFixed(2)} PLN</p>
            </div>
        </a>
    `).join('');
}

// Show Add Review Modal
function showAddReviewModal(product) {
    // Check if logged in
    if (!window.authSystem || !window.authSystem.isLoggedIn()) {
        alert('Musisz być zalogowany, aby dodać opinię.');
        window.location.href = 'login.html';
        return;
    }

    // Check if purchased (mock check)
    const hasPurchased = true; // Mock: assume true for demo

    if (!hasPurchased) {
        alert('Możesz ocenić tylko produkty, które kupiłeś.');
        return;
    }

    // Show modal (simple prompt for now)
    const rating = prompt('Ocena (1-5):');
    if (rating && rating >= 1 && rating <= 5) {
        const comment = prompt('Twój komentarz:');
        if (comment) {
            // Add review (mock)
            const newReview = {
                author: window.authSystem.getCurrentUser().name,
                date: new Date().toISOString().split('T')[0],
                rating: parseInt(rating),
                comment: comment
            };

            // Append to UI
            const reviewHTML = `
                <div class="review-card dark:bg-white/5">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <p class="font-semibold text-black dark:text-white">${newReview.author}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">${newReview.date}</p>
                        </div>
                        <div class="star-rating">
                            ${generateStars(newReview.rating)}
                        </div>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 text-sm">${newReview.comment}</p>
                </div>
            `;
            document.getElementById('reviews-container').insertAdjacentHTML('afterbegin', reviewHTML);
        }
    } else {
        alert('Nieprawidłowa ocena.');
    }
}