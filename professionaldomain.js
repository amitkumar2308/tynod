// ===================================
//  Capabilities Page - Interactive JS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Navigation ---
    const tabs = document.querySelectorAll('.cap-tab');
    const categories = document.querySelectorAll('.cap-category');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const categoryId = tab.getAttribute('data-category');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show matching category with animation
            categories.forEach(cat => {
                cat.classList.remove('active');
                cat.style.animation = 'none';
            });

            const targetCategory = document.getElementById(`cat-${categoryId}`);
            if (targetCategory) {
                // Force reflow to restart animation
                void targetCategory.offsetWidth;
                targetCategory.style.animation = '';
                targetCategory.classList.add('active');

                // Scroll to content smoothly
                const contentSection = document.querySelector('.cap-content-section');
                if (contentSection) {
                    const tabsSection = document.querySelector('.cap-tabs-section');
                    const offset = tabsSection ? tabsSection.offsetHeight + 110 : 160;
                    const top = contentSection.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    // --- Tabs Scroll Arrows ---
    const tabsWrapper = document.getElementById('capTabsWrapper');
    const arrowLeft = document.getElementById('tabsArrowLeft');
    const arrowRight = document.getElementById('tabsArrowRight');

    if (tabsWrapper && arrowLeft && arrowRight) {
        arrowLeft.addEventListener('click', () => {
            tabsWrapper.scrollBy({ left: -250, behavior: 'smooth' });
        });

        arrowRight.addEventListener('click', () => {
            tabsWrapper.scrollBy({ left: 250, behavior: 'smooth' });
        });
    }

    // --- Scroll Effects ---
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        // Scroll to top button visibility
        if (scrollTopBtn) {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    // --- Scroll to Top ---
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Card Hover Stagger Animation on scroll ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.cap-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 80);
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all card grids
    document.querySelectorAll('.cap-cards-grid').forEach(grid => {
        cardObserver.observe(grid);
    });

    // --- Handle URL hash for direct category linking ---
    const hash = window.location.hash;
    if (hash) {
        const categoryMap = {
            '#signature': 'signature',
            '#professional': 'professional',
            '#bespoke': 'bespoke',
            '#value': 'value',
            '#trusted': 'trusted',
            '#centres': 'centres',
            '#premier': 'premier',
            '#elite': 'elite',
            '#transformation': 'transformation'
        };

        const targetCat = categoryMap[hash];
        if (targetCat) {
            const targetTab = document.querySelector(`.cap-tab[data-category="${targetCat}"]`);
            if (targetTab) {
                setTimeout(() => targetTab.click(), 300);
            }
        }
    }
});
