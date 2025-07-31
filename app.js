// Page Navigation System
class PageManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = document.querySelectorAll('.page');
        this.navLinks = document.querySelectorAll('[data-page]');
        
        this.init();
    }
    
    init() {
        // Add event listeners for all elements with data-page attribute
        this.navLinks.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = element.getAttribute('data-page');
                if (targetPage) {
                    this.navigateToPage(targetPage);
                }
            });
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state ? e.state.page : 'home';
            this.navigateToPage(page, false);
        });
        
        // Set initial state
        history.replaceState({ page: 'home' }, '', '#home');
        
        // Ensure home page is visible initially
        this.showPage('home');
    }
    
    navigateToPage(targetPage, addToHistory = true) {
        if (targetPage === this.currentPage) return;
        
        // Hide all pages
        this.pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        this.showPage(targetPage);
        
        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === targetPage) {
                link.classList.add('active');
            }
        });
        
        // Update current page
        this.currentPage = targetPage;
        
        // Update URL and history
        if (addToHistory) {
            history.pushState({ page: targetPage }, '', `#${targetPage}`);
        }
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add page transition animation
        const targetPageElement = document.getElementById(targetPage);
        this.animatePageTransition(targetPageElement);
    }
    
    showPage(pageId) {
        const targetPageElement = document.getElementById(pageId);
        if (targetPageElement) {
            targetPageElement.classList.add('active');
        }
    }
    
    animatePageTransition(pageElement) {
        if (!pageElement) return;
        
        pageElement.style.opacity = '0';
        pageElement.style.transform = 'translateY(20px)';
        
        // Trigger animation after a brief delay
        setTimeout(() => {
            pageElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            pageElement.style.opacity = '1';
            pageElement.style.transform = 'translateY(0)';
        }, 50);
        
        // Clean up transition styles
        setTimeout(() => {
            pageElement.style.transition = '';
        }, 500);
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.querySelector('.inquiry-form');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
            
            // Add real-time validation
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        }
    }
    
    handleSubmit() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showSuccessMessage();
            this.form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        this.clearFieldError(field);
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (field.type === 'tel' && field.value && !this.isValidPhone(field.value)) {
            this.showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
        
        return true;
    }
    
    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--space-4);
            animation: fadeInUp 0.3s ease;
        `;
        
        field.style.borderColor = 'var(--color-error)';
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
        field.style.borderColor = '';
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    showSuccessMessage() {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.success-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--color-success);
                color: white;
                padding: var(--space-16) var(--space-20);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: var(--space-8);
                animation: slideIn 0.3s ease;
                max-width: 400px;
            ">
                <i class="fas fa-check-circle"></i>
                <span>Thank you! Your inquiry has been sent successfully. We'll get back to you soon.</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: auto;
                ">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Header Scroll Effect
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            this.header.style.cssText = `
                background-color: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: var(--shadow-md);
            `;
        } else {
            this.header.style.cssText = `
                background-color: var(--color-background);
                backdrop-filter: none;
                box-shadow: var(--shadow-sm);
            `;
        }
        
        this.lastScrollY = currentScrollY;
    }
}

// Card Hover Effects
class CardEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Add hover effects to cards
        const cards = document.querySelectorAll('.feature-card, .domain-card, .service-item, .contact-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
                card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                card.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
        
        // Add button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '';
            });
        });
    }
}

// Intersection Observer for Animations
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '-20px'
            }
        );
        this.init();
    }
    
    init() {
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.feature-card, .domain-card, .service-item, .contact-item'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.cssText = `
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s;
            `;
            this.observer.observe(el);
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Image Loading Animation
class ImageLoader {
    constructor() {
        this.init();
    }
    
    init() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (img.complete) {
                this.onImageLoad(img);
            } else {
                img.addEventListener('load', () => this.onImageLoad(img));
                img.addEventListener('error', () => this.onImageError(img));
            }
        });
    }
    
    onImageLoad(img) {
        img.style.cssText = `
            opacity: 0;
            transform: scale(1.05);
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;
        
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 100);
    }
    
    onImageError(img) {
        img.style.display = 'none';
        console.warn('Failed to load image:', img.src);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Add global CSS animations
const addGlobalStyles = () => {
    if (document.getElementById('global-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'global-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.2s ease forwards;
        }
        
        .btn {
            transition: all 0.2s ease !important;
        }
        
        .page {
            min-height: 50vh;
        }
        
        .page.active {
            animation: fadeInUp 0.2s ease;
        }
        
        .success-notification {
            animation: slideIn 0.3s ease;
        }
        
        /* Loading states */
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
        }
        
        /* Form validation styles */
        .form-control {
            transition: border-color 0.3s ease;
        }
        
        .form-control:focus {
            border-color: var(--color-primary);
            outline: none;
            box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
        }
        
        .error-message {
            animation: fadeInUp 0.3s ease;
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
            .success-notification > div {
                right: 10px !important;
                left: 10px !important;
                max-width: none !important;
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add global styles first
    addGlobalStyles();
    
    // Initialize all components
    const pageManager = new PageManager();
    const contactForm = new ContactForm();
    const headerScroll = new HeaderScroll();
    const cardEffects = new CardEffects();
    const scrollAnimations = new ScrollAnimations();
    const imageLoader = new ImageLoader();
    
    // Handle initial page load based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'services', 'contact'].includes(hash)) {
        setTimeout(() => {
            pageManager.navigateToPage(hash, false);
        }, 100);
    }
    
    // Add loading state management
    document.body.classList.add('loaded');
    
    // Smooth scroll for anchor links within pages
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                // Check if it's a page navigation or section scroll
                const target = document.querySelector(href);
                if (target && !target.classList.contains('page')) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Handle window resize
window.addEventListener('resize', Utils.debounce(() => {
    // Handle responsive adjustments if needed
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Mobile-specific adjustments
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}, 250));

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or timers when page is hidden
        document.body.classList.add('hidden');
    } else {
        // Resume when page becomes visible
        document.body.classList.remove('hidden');
    }
});

// Export for debugging (if needed)
if (typeof window !== 'undefined') {
    window.VIDHYARTHAMApp = {
        PageManager,
        ContactForm,
        HeaderScroll,
        CardEffects,
        ScrollAnimations,
        ImageLoader,
        Utils
    };
}

