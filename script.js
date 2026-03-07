// ===================================
// Navigation & Scroll Effects
// ===================================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const scrollTopBtn = document.getElementById('scrollTop');
const loginModal = document.getElementById('loginModal');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
        if (navbar) navbar.classList.add('scrolled');
        if (scrollTopBtn) scrollTopBtn.classList.add('active');
    } else {
        if (navbar) navbar.classList.remove('scrolled');
        if (scrollTopBtn) scrollTopBtn.classList.remove('active');
    }
});

// Mobile menu toggle
menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu?.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Scroll to top
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Counter Animation
// ===================================
const counters = document.querySelectorAll('.counter');
let counterAnimated = false;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };

        updateCounter();
    });
};

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterAnimated) {
            animateCounters();
            counterAnimated = true;
        }
    });
}, observerOptions);

// Observe stats showcase section
const statsShowcase = document.querySelector('.stats-showcase');
if (statsShowcase) {
    counterObserver.observe(statsShowcase);
}

// ===================================
// Service Card Expand/Collapse
// ===================================
function toggleServiceDetails(button) {
    const serviceCard = button.closest('.service-card');
    const details = serviceCard.querySelector('.service-details');

    button.classList.toggle('active');
    details.classList.toggle('active');

    if (button.classList.contains('active')) {
        button.querySelector('span').textContent = 'View Less';
    } else {
        button.querySelector('span').textContent = 'View All';
    }
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for login link
        if (href === '#login') {
            e.preventDefault();
            openLoginModal();
            return;
        }

        // Skip if it's just '#'
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Login Modal
// ===================================
function openLoginModal() {
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking on close button
const closeModal = document.querySelector('.close-modal');
if (closeModal) {
    closeModal.addEventListener('click', closeLoginModal);
}

// Close modal when clicking outside
if (loginModal) {
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal.classList.contains('active')) {
            closeLoginModal();
        }
    });
}

// ===================================
// Form Handling
// ===================================

// Contact Form - Web3Forms Integration
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const formStatus = document.getElementById('formStatus');
        const originalBtnText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        try {
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            const result = await response.json();

            if (result.success) {
                formStatus.className = 'form-status form-status-success';
                formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your inquiry has been sent successfully. We will get back to you soon.';
                contactForm.reset();

                // Remove focus from all inputs to reset labels
                contactForm.querySelectorAll('input, textarea, select').forEach(input => {
                    input.blur();
                    input.classList.remove('has-value');
                });
            } else {
                formStatus.className = 'form-status form-status-error';
                formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Oops! Something went wrong. Please try again later.';
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formStatus.className = 'form-status form-status-error';
            formStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Please check your connection and try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Auto-hide the status message after 8 seconds
            setTimeout(() => {
                formStatus.classList.add('form-status-fade');
                setTimeout(() => {
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }, 500);
            }, 8000);
        }
    });
}

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData);

        // Here you would typically send the data to a server for authentication
        console.log('Login data:', data);

        // For demo purposes
        if (data.username === 'Nitin' && data.password === 'TYNOD@2025') {
            alert('Login successful! Welcome, ' + data.username);
            closeLoginModal();
            loginForm.reset();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .industry-card, .mv-item, .mv-v2-card, .info-item, .stat-item, .section-header, .testimonial-card.active, .contact-info, .inquiry-form, .value-card, .val-card, .ceo-content, .highlight-item, .about-v2-left, .about-v2-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.children;
                const index = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(24px)';
        element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
};

// Initialize animations on page load
window.addEventListener('load', () => {
    animateOnScroll();
});

// ===================================
// Parallax Effect for Hero Shapes
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===================================
// Form Label Animation Helper
// ===================================
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    // Add placeholder attribute to trigger label animation
    if (!input.hasAttribute('placeholder')) {
        input.setAttribute('placeholder', ' ');
    }

    // Handle select elements
    if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    }
});

// ===================================
// Lazy Loading Images
// ===================================
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===================================
// Page Load Animation
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===================================
// Prevent Form Resubmission
// ===================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ===================================
// Console Welcome Message
// ===================================
console.log(
    '%cTYNOD Website',
    'color: #3b82f6; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);
console.log(
    '%cElevating Businesses. Empowering Growth',
    'color: #0ea5e9; font-size: 16px; font-style: italic;'
);
console.log(
    '%c🚀 Built with modern web technologies',
    'color: #64748b; font-size: 14px;'
);

// ===================================
// Carousel Slider Functionality
// ===================================
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
const totalSlides = slides.length;
let autoPlayInterval;

// Function to show specific slide
function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Wrap around if index is out of bounds
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Add active class to current slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Function to change slide (called by arrow buttons)
function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetAutoPlay();
}

// Function to set specific slide (called by dot indicators)
function setSlide(index) {
    showSlide(index);
    resetAutoPlay();
}

// Auto-play functionality
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 10000); // Change slide every 10 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Initialize carousel
if (slides.length > 0) {
    showSlide(0);
    startAutoPlay();

    // Pause auto-play when hovering over carousel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
}

// ===================================
// TYNOD Advantage Carousel
// ===================================
let advCurrentIndex = 0;
const advTrack = document.getElementById('advantageTrack');
const advDotsContainer = document.getElementById('advantageDots');
let advCards = [];
let advCardsPerView = 3;
let advTotalPages = 0;
let advAutoPlayInterval;

function initAdvantageCarousel() {
    if (!advTrack) return;

    advCards = advTrack.querySelectorAll('.adv-card');
    if (advCards.length === 0) return;

    function calcCardsPerView() {
        if (window.innerWidth <= 1024) return 1;
        return 2;
    }

    advCardsPerView = calcCardsPerView();
    advTotalPages = Math.ceil(advCards.length / advCardsPerView);

    // Generate dots based on individual cards sliding rather than pages
    updateAdvantageDots();

    advCurrentIndex = 0;
    updateAdvantagePosition();
    startAdvAutoPlay();

    // Recalculate on resize
    window.addEventListener('resize', () => {
        const newPerView = calcCardsPerView();
        if (newPerView !== advCardsPerView) {
            advCardsPerView = newPerView;
            updateAdvantageDots();
            updateAdvantagePosition();
        }
    });

    // Pause on hover
    const wrapper = advTrack.parentElement;
    wrapper.addEventListener('mouseenter', stopAdvAutoPlay);
    wrapper.addEventListener('mouseleave', startAdvAutoPlay);

    // Touch/drag support
    let startX = 0, isDragging = false;
    wrapper.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    wrapper.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            changeAdvantage(diff > 0 ? 1 : -1);
        }
    });

    wrapper.addEventListener('mousedown', (e) => { startX = e.clientX; isDragging = true; });
    wrapper.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) {
            changeAdvantage(diff > 0 ? 1 : -1);
        }
    });
    wrapper.addEventListener('mouseleave', () => { isDragging = false; });
}

function updateAdvantagePosition() {
    if (!advTrack || advCards.length === 0) return;
    const card = advCards[0];
    const gap = 24; // 1.5rem gap
    const cardWidth = card.offsetWidth + gap;

    // We now treat advCurrentIndex as the card index directly.
    // Ensure we don't scroll past the max
    const maxIndex = Math.max(0, advCards.length - advCardsPerView);
    advCurrentIndex = Math.max(0, Math.min(advCurrentIndex, maxIndex));

    advTrack.style.transform = `translateX(-${advCurrentIndex * cardWidth}px)`;

    // Update dots (create dots based on maxIndex + 1 to account for all slides individually)
    const dots = advDotsContainer.querySelectorAll('.adv-dot');
    if (dots.length > 0) {
        dots.forEach((d, i) => d.classList.toggle('active', i === advCurrentIndex));
    }
}

function updateAdvantageDots() {
    const maxIndex = Math.max(0, advCards.length - advCardsPerView);
    advDotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = 'adv-dot' + (i === advCurrentIndex ? ' active' : '');
        dot.onclick = () => setAdvantage(i);
        advDotsContainer.appendChild(dot);
    }
}

function changeAdvantage(direction) {
    const maxIndex = Math.max(0, advCards.length - advCardsPerView);
    advCurrentIndex += direction;

    // Loop around behavior
    if (advCurrentIndex > maxIndex) advCurrentIndex = 0;
    if (advCurrentIndex < 0) advCurrentIndex = maxIndex;

    updateAdvantagePosition();
    resetAdvAutoPlay();
}

function setAdvantage(index) {
    advCurrentIndex = index;
    updateAdvantagePosition();
    resetAdvAutoPlay();
}

function startAdvAutoPlay() {
    stopAdvAutoPlay();
    advAutoPlayInterval = setInterval(() => changeAdvantage(1), 5000);
}

function stopAdvAutoPlay() {
    clearInterval(advAutoPlayInterval);
}

function resetAdvAutoPlay() {
    stopAdvAutoPlay();
    startAdvAutoPlay();
}

// Initialize on load
window.addEventListener('load', initAdvantageCarousel);

// ===================================
// Testimonials Carousel Functionality
// ===================================
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const totalTestimonials = testimonials.length;
let testimonialAutoPlay;

// Function to show specific testimonial
function showTestimonial(index) {
    // Remove active class from all testimonials and dots
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    // Wrap around if index is out of bounds
    if (index >= totalTestimonials) {
        currentTestimonial = 0;
    } else if (index < 0) {
        currentTestimonial = totalTestimonials - 1;
    } else {
        currentTestimonial = index;
    }

    // Add active class to current testimonial and dot
    testimonials[currentTestimonial].classList.add('active');
    testimonialDots[currentTestimonial].classList.add('active');
}

// Function to change testimonial (called by arrow buttons)
function changeTestimonial(direction) {
    showTestimonial(currentTestimonial + direction);
    resetTestimonialAutoPlay();
}

// Function to set specific testimonial (called by dot indicators)
function setTestimonial(index) {
    showTestimonial(index);
    resetTestimonialAutoPlay();
}

// Auto-play functionality for testimonials
function startTestimonialAutoPlay() {
    testimonialAutoPlay = setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 3000); // Change testimonial every 3 seconds
}

function stopTestimonialAutoPlay() {
    clearInterval(testimonialAutoPlay);
}

function resetTestimonialAutoPlay() {
    stopTestimonialAutoPlay();
    startTestimonialAutoPlay();
}

// Initialize testimonials carousel
if (testimonials.length > 0) {
    showTestimonial(0);
    startTestimonialAutoPlay();

    // Pause auto-play when hovering over testimonials carousel
    const testimonialCarousel = document.querySelector('.testimonials-carousel');
    if (testimonialCarousel) {
        testimonialCarousel.addEventListener('mouseenter', stopTestimonialAutoPlay);
        testimonialCarousel.addEventListener('mouseleave', startTestimonialAutoPlay);
    }
}

// ===================================
// Consulting Services Modal Logic
// ===================================
const consultingModal = document.getElementById('consultingModal');

function openConsultingModal() {
    if (consultingModal) {
        consultingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeConsultingModal() {
    if (consultingModal) {
        consultingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close when clicking outside
if (consultingModal) {
    consultingModal.addEventListener('click', (e) => {
        if (e.target === consultingModal) {
            closeConsultingModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && consultingModal.classList.contains('active')) {
            closeConsultingModal();
        }
    });
}