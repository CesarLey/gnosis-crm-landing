// Simple Scroll Animation using Intersection Observer

document.addEventListener('DOMContentLoaded', () => {

    // Select elements to animate
    const cards = document.querySelectorAll('.feature-card');
    const heroText = document.querySelector('.hero-text');

    // Create Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Initial State for Animation
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.2}s`; // Staggered delay
        observer.observe(card);
    });

    // Animate Hero on Load
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroText.style.transition = 'all 1s ease-out';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 100);
    }

    // --- Dynamic Words Animation (Infinite Possibilities) ---
    const wordList = document.querySelector('.rotating-words');
    const originalItems = document.querySelectorAll('.rotating-words li');

    if (wordList && originalItems.length > 0) {

        const HEADER_OFFSET = 75; // Center point in 200px container (item 50px)
        const ITEM_HEIGHT = 50;
        const CLONE_COUNT = 2; // Buffer clones for seamless loop

        // 1. Create Clones for visual continuity
        // Tail Clones (Append to end): Clone first few items
        // Head Clones (Prepend to start): Clone last few items
        const firstClones = [];
        const lastClones = [];

        for (let i = 0; i < CLONE_COUNT; i++) {
            firstClones.push(originalItems[i].cloneNode(true));
            const tailIndex = originalItems.length - 1 - i;
            lastClones.unshift(originalItems[tailIndex].cloneNode(true));
        }

        firstClones.forEach(clone => wordList.appendChild(clone));
        lastClones.forEach(clone => wordList.insertBefore(clone, wordList.firstChild));

        // 2. Re-query all items (Originals + Clones)
        const allItems = document.querySelectorAll('.rotating-words li');

        // 3. Set Initial State
        // Start at the first ORIGINAL item (skipping head clones)
        let currentIndex = CLONE_COUNT;

        // Clean slate
        allItems.forEach(item => item.classList.remove('active'));
        allItems[currentIndex].classList.add('active');

        // Initial Position (Instant)
        wordList.style.transition = 'none';
        wordList.style.transform = `translateY(${HEADER_OFFSET - (currentIndex * ITEM_HEIGHT)}px)`;

        // 4. Animation Loop
        setInterval(() => {
            currentIndex++;

            // Turn on transition for the move
            wordList.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

            // Apply Move
            const scrollOffset = HEADER_OFFSET - (currentIndex * ITEM_HEIGHT);
            wordList.style.transform = `translateY(${scrollOffset}px)`;

            // Update Highlight
            allItems.forEach(item => item.classList.remove('active'));
            if (allItems[currentIndex]) allItems[currentIndex].classList.add('active');

            // 5. Check for Loop Reset (Snap Back)
            // If we reached the first 'Tail Clone' (Visual equivalent of start)
            const totalOriginals = originalItems.length;
            if (currentIndex === CLONE_COUNT + totalOriginals) {

                // Wait for animation to finish (500ms), then snap
                setTimeout(() => {
                    wordList.style.transition = 'none'; // Silent jump
                    currentIndex = CLONE_COUNT; // Back to real start

                    const snapOffset = HEADER_OFFSET - (currentIndex * ITEM_HEIGHT);
                    wordList.style.transform = `translateY(${snapOffset}px)`;

                    // Re-highlight current (visually same, but correct DOM instance)
                    allItems.forEach(item => item.classList.remove('active'));
                    allItems[currentIndex].classList.add('active');
                }, 500);
            }
        }, 1000); // Trigger every 1s
    }

    // --- Billing Toggle Logic ---
    const billingSwitch = document.getElementById('billingSwitch');
    const pricingCards = document.querySelectorAll('.dynamic-price-card');

    if (billingSwitch && pricingCards.length > 0) {
        // Function to update prices
        const updatePrices = () => {
            const isAnnual = billingSwitch.checked;

            pricingCards.forEach(card => {
                const monthlyPrice = card.getAttribute('data-price-monthly');
                const annualPrice = card.getAttribute('data-price-annual'); // Monthly equivalent
                const annualTotal = card.getAttribute('data-annual-total');

                const priceMain = card.querySelector('.price-main');
                const oldPrice = card.querySelector('.old-price');
                const discountBadge = card.querySelector('.discount-badge');
                const priceSubtitle = card.querySelector('.price-subtitle');

                if (isAnnual) {
                    // Annual View
                    if (priceMain) priceMain.innerHTML = `<span class="currency">$</span>${annualPrice} <span class="period">MXN / mes</span>`;
                    if (oldPrice) {
                        oldPrice.textContent = `$${monthlyPrice}`;
                        oldPrice.style.display = 'inline';
                    }
                    if (discountBadge) discountBadge.style.display = 'inline-block';
                    if (priceSubtitle) priceSubtitle.textContent = `En un solo pago anual de $${annualTotal}`;
                } else {
                    // Monthly View
                    if (priceMain) priceMain.innerHTML = `<span class="currency">$</span>${monthlyPrice} <span class="period">MXN / mes</span>`;
                    if (oldPrice) oldPrice.style.display = 'none';
                    if (discountBadge) discountBadge.style.display = 'none';
                    if (priceSubtitle) priceSubtitle.textContent = 'Pago mensual recurrente';
                }
            });
        };

        // Initialize: Set to Checked (Annual) to match pre-rendered HTML
        billingSwitch.checked = true;
        updatePrices(); // Ensure UI sync

        // Event Listener
        billingSwitch.addEventListener('change', updatePrices);
    }
    // --- Help Cards Accordion Logic ---
    const helpCards = document.querySelectorAll('.help-category-card');

    if (helpCards.length > 0) {
        helpCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent toggling if clicking a link directly (though event bubbling usually handles this, good safety)
                if (e.target.tagName === 'A') return;

                // Close other cards (Accordion behavior)
                helpCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('active')) {
                        otherCard.classList.remove('active');
                    }
                });

                // Toggle current card
                card.classList.toggle('active');
            });
        });
    }

    // --- FAQ Toggle Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                // Optional: Close others
                faqItems.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });

                item.classList.toggle('active');
            });
        });
    }
});
