// DOM Elements
const header = document.querySelector('header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const glassNav = document.querySelector('.glass-nav');
const themeToggle = document.querySelector('.theme-toggle');
const sections = document.querySelectorAll('section');
const skillBars = document.querySelectorAll('.skill-progress-bar');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('.contact-form');
const bgGradient = document.querySelector('.bg-gradient');
const heroSection = document.querySelector('.hero-section');
const heroImage = document.querySelector('.hero-image');
const projectShowcases = document.querySelectorAll('.project-showcase');
const expertiseItems = document.querySelectorAll('.expertise-item');
const educationTimeline = document.querySelector('.education-timeline');
const certificationCards = document.querySelectorAll('.certification-card');
const socialLinks = document.querySelectorAll('.social-links a, .contact-social a');

// Sidebar functionality
const sidebar = document.querySelector('.sidebar');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize AOS (Animate On Scroll) if available
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}

// Debounce function to limit execution of expensive functions
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Mobile Menu Toggle with improved animation
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    sidebar.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    // Make sure we only animate items if they exist
    if (glassNav) {
        glassNav.classList.toggle('active');

        // Animate menu items sequentially if they exist
        const menuItems = glassNav.querySelectorAll('li');
        if (menuItems.length > 0) {
            menuItems.forEach((item, index) => {
                if (glassNav.classList.contains('active')) {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, 100 * index);
                } else {
                    item.classList.remove('animate-in');
                }
            });
        }
    }
});

// Close mobile menu when clicking outside - with improved event delegation
document.addEventListener('click', (e) => {
    if (!glassNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && glassNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        glassNav.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // Close sidebar when clicking outside on mobile
    if (window.innerWidth <= 991) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        }
    }
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize project galleries with fullscreen viewer
    initProjectGalleries();

    // Setup fullscreen viewer for individual project images
    const fullscreenViewer = initFullscreenViewer();

    // Add fullscreen functionality to all project images
    const projectImageSelectors = [
        '.project-screenshot',
        '.slider-image',
        '.secondary-project-image img',
        '.project-small-screenshot'
    ];

    projectImageSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(img => {
            img.addEventListener('click', () => {
                if (img.src) {
                    fullscreenViewer.open(null, [img.src], 0);
                }
            });
            // Add cursor pointer to indicate clickable
            img.style.cursor = 'pointer';
        });
    });

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        updateAllThemeIcons('dark');
    } else if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        updateAllThemeIcons('light');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        updateAllThemeIcons('dark');
    } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
        updateAllThemeIcons('light');
    }

    // Add click event to all theme toggle buttons
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Toggle between dark and light theme
            const isDark = document.body.classList.contains('dark-theme');
            document.body.classList.toggle('dark-theme', !isDark);
            document.body.classList.toggle('light-theme', isDark);

            // Update theme icons
            updateAllThemeIcons(isDark ? 'light' : 'dark');

            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });
    });

    // Initialize other components
    initScrollHandlers();
    initSmoothScrolling();
    observeElements();
});

// Helper function to update all theme toggle icons
function updateAllThemeIcons(theme) {
    document.querySelectorAll('.theme-toggle i').forEach(icon => {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// Initialize scroll event handlers with debouncing
function initScrollHandlers() {
    let lastScroll = 0;
    const sections = document.querySelectorAll('section');
    const heroSection = document.querySelector('.hero-section');
    const heroImage = document.querySelector('.hero-image');

    // Debounced scroll handler
    const handleScroll = debounce(() => {
        const currentScroll = window.pageYOffset;

        // Parallax effect for hero section
        if (heroSection && currentScroll < window.innerHeight) {
            const parallaxValue = currentScroll * 0.5;
            heroSection.style.backgroundPositionY = `${parallaxValue}px`;

            // Subtle parallax for hero image
            if (heroImage) {
                heroImage.style.transform = `translateY(${parallaxValue * 0.2}px)`;
            }
        }

        // Header show/hide effect
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }

        lastScroll = currentScroll;

        // Update active nav item based on scroll position
        updateActiveNavItem(sections);
    }, 10);

    window.addEventListener('scroll', handleScroll);

    // Scroll-to-top button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }, 100));

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Update active navigation item based on scroll position
function updateActiveNavItem(sections) {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu if open
                if (glassNav.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    glassNav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }

                // Calculate offset for fixed header
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Add active class to current nav item
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Enhanced Intersection Observer for Animations
function observeElements() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Special handling for different element types
                if (entry.target.classList.contains('skill-progress-bar')) {
                    animateSkillBar(entry.target);
                } else if (entry.target.classList.contains('project-card')) {
                    entry.target.classList.add('slide-up');
                } else if (entry.target.classList.contains('expertise-item')) {
                    entry.target.classList.add('fade-in');
                } else if (entry.target.classList.contains('certification-card')) {
                    entry.target.classList.add('fade-in');
                } else if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('animate');
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.skill-progress-bar, .project-card, .expertise-item, .certification-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced Skill Progress Animation with easing
function animateSkillBar(bar) {
    const progress = bar.getAttribute('data-progress');
    const duration = 1000; // reduced from 1500ms for better performance
    const startTime = performance.now();
    const startWidth = 0;
    const endWidth = progress;

    function updateWidth(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentWidth = startWidth + (endWidth - startWidth) * easeProgress;
        bar.style.width = `${currentWidth}%`;

        if (progress < 1) {
            requestAnimationFrame(updateWidth);
        }
    }

    requestAnimationFrame(updateWidth);
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Enhanced Contact Form Handling with better validation and feedback
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea');

    // Add focus effects
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const formProps = Object.fromEntries(formData);

        // Enhanced form validation with visual feedback
        let isValid = true;
        let errorMessage = '';

        // Reset previous error states
        formInputs.forEach(input => {
            input.parentElement.classList.remove('error');
        });

        if (!formProps.name.trim()) {
            isValid = false;
            errorMessage += 'Please enter your name.\n';
            contactForm.querySelector('[name="name"]').parentElement.classList.add('error');
        }

        if (!formProps.email.trim()) {
            isValid = false;
            errorMessage += 'Please enter your email.\n';
            contactForm.querySelector('[name="email"]').parentElement.classList.add('error');
        } else if (!isValidEmail(formProps.email)) {
            isValid = false;
            errorMessage += 'Please enter a valid email address.\n';
            contactForm.querySelector('[name="email"]').parentElement.classList.add('error');
        }

        if (!formProps.message.trim()) {
            isValid = false;
            errorMessage += 'Please enter your message.\n';
            contactForm.querySelector('[name="message"]').parentElement.classList.add('error');
        }

        if (!isValid) {
            showNotification(errorMessage, 'error');
            return;
        }

        // Show loading state with animation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Here you would typically send the form data to your backend
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message with animation
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();

            // Reset form input states
            formInputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
        } catch (error) {
            // Show error message with animation
            showNotification('Sorry, there was an error sending your message. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system for form feedback
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Add icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }

    notification.innerHTML = `${icon}<span>${message}</span>`;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Email validation helper with improved regex
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Social links hover effect
socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.classList.add('pulse');
    });

    link.addEventListener('mouseleave', () => {
        link.classList.remove('pulse');
    });
});

// Project image slider functionality
function initProjectImageSliders() {
    document.querySelectorAll('.project-image-slider').forEach(slider => {
        const images = JSON.parse(slider.getAttribute('data-images'));
        let current = 0;
        const imgEl = slider.querySelector('.slider-image');
        const leftBtn = slider.querySelector('.slider-arrow-left');
        const rightBtn = slider.querySelector('.slider-arrow-right');
        const dotsContainer = slider.querySelector('.slider-dots');

        // Create dot indicators
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            images.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
                dot.addEventListener('click', () => {
                    current = idx;
                    updateImage();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function updateImage() {
            imgEl.src = images[current];
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.slider-dot').forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === current);
                });
            }
        }

        leftBtn.addEventListener('click', () => {
            current = (current - 1 + images.length) % images.length;
            updateImage();
        });
        rightBtn.addEventListener('click', () => {
            current = (current + 1) % images.length;
            updateImage();
        });
    });
}

// --- Project Modal Preview ---
function getProjectCardData(card) {
    // Extract info from card for modal
    const title = card.querySelector('.project-header h3')?.textContent || '';
    const desc = card.querySelector('.project-info p, .project-content.small p')?.textContent || '';
    const links = Array.from(card.querySelectorAll('.project-links a')).map(a => ({
        href: a.href,
        text: a.textContent,
        icon: a.querySelector('i')?.outerHTML || ''
    }));
    let images = [];
    const slider = card.querySelector('.project-image-slider');
    if (slider) {
        try { images = JSON.parse(slider.getAttribute('data-images')); } catch { }
    }
    return { title, desc, links, images };
}

function openProjectModal(card) {
    const modal = document.getElementById('project-modal');
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    const imgEl = modal.querySelector('.modal-slider-image');
    const leftBtn = modal.querySelector('.modal-slider-arrow-left');
    const rightBtn = modal.querySelector('.modal-slider-arrow-right');
    const titleEl = modal.querySelector('.modal-title');
    const descEl = modal.querySelector('.modal-description');
    const linksEl = modal.querySelector('.modal-links');
    let { title, desc, links, images } = getProjectCardData(card);
    let current = 0;
    function updateModalImage() {
        if (images.length > 0) {
            imgEl.src = images[current];
        } else {
            imgEl.src = '';
        }
    }
    titleEl.textContent = title;
    descEl.textContent = desc;
    linksEl.innerHTML = links.map(l => `<a href="${l.href}" target="_blank">${l.icon} ${l.text}</a>`).join(' ');
    updateModalImage();
    modal.classList.add('active');
    // Slider controls
    leftBtn.onclick = () => { current = (current - 1 + images.length) % images.length; updateModalImage(); };
    rightBtn.onclick = () => { current = (current + 1) % images.length; updateModalImage(); };
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        leftBtn.onclick = rightBtn.onclick = null;
        overlay.onclick = closeBtn.onclick = null;
    }
    overlay.onclick = closeBtn.onclick = closeModal;
    document.addEventListener('keydown', function escClose(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escClose); } });
}
// Attach modal to all project cards
function initProjectModals() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', e => {
            // Prevent modal open if clicking a link
            if (e.target.closest('a')) return;
            openProjectModal(card);
        });
    });
}

// --- Animated Typing Effect ---
function initHeroTyping() {
    const h2 = document.querySelector('.hero-text h2');
    if (!h2) return;
    const titles = [
        'Software Engineer',
        'Flutter Developer',
        'Problem Solver',
        'Mobile App Specialist'
    ];
    let i = 0, j = 0, isDeleting = false, current = '';
    const typeSpan = document.createElement('span');
    typeSpan.className = 'typed-text';
    h2.innerHTML = '';
    h2.appendChild(typeSpan);
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.textContent = '|';
    h2.appendChild(cursor);
    function type() {
        const full = titles[i];
        if (isDeleting) {
            current = full.substring(0, j--);
        } else {
            current = full.substring(0, j++);
        }
        typeSpan.textContent = current;
        if (!isDeleting && j > full.length) {
            isDeleting = true;
            setTimeout(type, 1200);
        } else if (isDeleting && j === 0) {
            isDeleting = false;
            i = (i + 1) % titles.length;
            setTimeout(type, 400);
        } else {
            setTimeout(type, isDeleting ? 40 : 90);
        }
    }
    type();
}

// Fullscreen Image Viewer functionality
function initFullscreenViewer() {
    const viewer = document.querySelector('.fullscreen-viewer');
    const viewerImage = viewer.querySelector('.fullscreen-image');
    const closeBtn = viewer.querySelector('.fullscreen-close');
    const prevBtn = viewer.querySelector('.fullscreen-prev');
    const nextBtn = viewer.querySelector('.fullscreen-next');
    const counter = viewer.querySelector('.fullscreen-counter');
    const loading = viewer.querySelector('.fullscreen-loading');

    let currentGallery = null;
    let currentImages = [];
    let currentIndex = 0;

    // Function to open the fullscreen viewer
    function openViewer(gallery, images, index) {
        currentGallery = gallery;
        currentImages = images;
        currentIndex = index;

        // Show loading indicator
        loading.style.display = 'block';
        viewerImage.style.opacity = '0';

        // Set image source
        viewerImage.src = images[index];
        viewerImage.alt = `Image ${index + 1} of ${images.length}`;

        // Update counter
        counter.textContent = `${index + 1} / ${images.length}`;

        // Show viewer
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Handle image load
        viewerImage.onload = function () {
            loading.style.display = 'none';
            viewerImage.style.opacity = '1';
        };

        // Handle image error
        viewerImage.onerror = function () {
            loading.style.display = 'none';
            viewerImage.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
            viewerImage.style.opacity = '1';
        };
    }

    // Function to close the viewer
    function closeViewer() {
        viewer.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling

        // Clear current image after animation
        setTimeout(() => {
            viewerImage.src = '';
            currentGallery = null;
        }, 300);
    }

    // Function to navigate to previous image
    function prevImage() {
        if (!currentImages.length) return;

        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;

        // Show loading indicator
        loading.style.display = 'block';
        viewerImage.style.opacity = '0';

        // Set new image
        viewerImage.src = currentImages[currentIndex];

        // Update counter
        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }

    // Function to navigate to next image
    function nextImage() {
        if (!currentImages.length) return;

        currentIndex = (currentIndex + 1) % currentImages.length;

        // Show loading indicator
        loading.style.display = 'block';
        viewerImage.style.opacity = '0';

        // Set new image
        viewerImage.src = currentImages[currentIndex];

        // Update counter
        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
    }

    // Event listeners
    closeBtn.addEventListener('click', closeViewer);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && viewer.classList.contains('active')) {
            closeViewer();
        } else if (e.key === 'ArrowLeft' && viewer.classList.contains('active')) {
            prevImage();
        } else if (e.key === 'ArrowRight' && viewer.classList.contains('active')) {
            nextImage();
        }
    });

    // Close on clicking outside the image
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) {
            closeViewer();
        }
    });

    // Handle image load and error events
    viewerImage.addEventListener('load', () => {
        loading.style.display = 'none';
        viewerImage.style.opacity = '1';
    });

    viewerImage.addEventListener('error', () => {
        loading.style.display = 'none';
        viewerImage.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
        viewerImage.style.opacity = '1';
    });

    // Swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    viewer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleViewerSwipe();
    }, { passive: true });

    function handleViewerSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, go to next
            nextImage();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, go to previous
            prevImage();
        }
    }

    // Return the open function to be used by other components
    return {
        open: openViewer
    };
}

// Modern Project Gallery Implementation
function initProjectGalleries() {
    // Initialize the fullscreen viewer first
    const fullscreenViewer = initFullscreenViewer();

    document.querySelectorAll('.project-gallery').forEach(gallery => {
        if (!gallery.dataset.images) return;

        // Parse images array from data attribute
        let images = [];
        try {
            images = JSON.parse(gallery.dataset.images);
        } catch (e) {
            console.error('Invalid image data format', e);
            return;
        }

        if (!images.length) return;

        // Create gallery structure
        const container = document.createElement('div');
        container.className = 'gallery-container';

        const track = document.createElement('div');
        track.className = 'gallery-track';

        // Create slides
        images.forEach((src, idx) => {
            const slide = document.createElement('div');
            slide.className = 'gallery-slide';
            slide.setAttribute('aria-hidden', idx === 0 ? 'false' : 'true');

            // Create loader
            const loader = document.createElement('div');
            loader.className = 'gallery-loader';
            const spinner = document.createElement('div');
            spinner.className = 'gallery-spinner';
            loader.appendChild(spinner);

            // Create image element with lazy loading
            const img = document.createElement('img');
            img.className = 'gallery-image';
            img.alt = gallery.dataset.title ? `${gallery.dataset.title} screenshot ${idx + 1}` : `Project screenshot ${idx + 1}`;
            img.loading = 'lazy';

            // Set a loading timeout to prevent infinite loading
            let loadingTimeout;

            // Only set src for first image immediately, lazy load others when needed
            if (idx === 0) {
                img.src = src;
                // Set timeout for first image
                loadingTimeout = setTimeout(() => {
                    if (slide.contains(loader)) {
                        slide.removeChild(loader);
                        img.style.opacity = 1;
                    }
                }, 3000);
            } else {
                img.dataset.src = src;
            }

            // Handle image loading events
            img.addEventListener('load', () => {
                clearTimeout(loadingTimeout);
                if (slide.contains(loader)) {
                    slide.removeChild(loader);
                    img.style.opacity = 1;
                }
            });

            // Handle image error
            img.addEventListener('error', () => {
                clearTimeout(loadingTimeout);
                if (slide.contains(loader)) {
                    slide.removeChild(loader);
                }
                // Replace with placeholder image
                img.src = 'https://via.placeholder.com/400x225?text=Image+Not+Available';
                img.style.opacity = 1;
            });

            // Add click event to open fullscreen viewer
            img.addEventListener('click', (e) => {
                e.preventDefault();
                fullscreenViewer.open(gallery, images, idx);
            });

            img.style.opacity = 0;
            slide.appendChild(loader);
            slide.appendChild(img);
            track.appendChild(slide);
        });

        container.appendChild(track);

        // Create controls
        const controls = document.createElement('div');
        controls.className = 'gallery-controls';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-btn gallery-prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.setAttribute('aria-label', 'Previous image');

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-btn gallery-next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.setAttribute('aria-label', 'Next image');

        // Indicators container
        const indicators = document.createElement('div');
        indicators.className = 'gallery-indicators';

        // Create indicator dots
        images.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = 'gallery-indicator' + (idx === 0 ? ' active' : '');
            dot.setAttribute('data-index', idx);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('aria-label', `View image ${idx + 1}`);
            indicators.appendChild(dot);
        });

        // Add controls to container
        controls.appendChild(prevBtn);
        controls.appendChild(indicators);
        controls.appendChild(nextBtn);

        // Add everything to gallery
        gallery.appendChild(container);
        gallery.appendChild(controls);

        // Gallery state
        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;
        let autoplayTimer = null;

        // Function to update active slide
        function goToSlide(index, direction = null) {
            // Ensure index is within bounds
            if (index < 0) index = images.length - 1;
            if (index >= images.length) index = 0;

            const previousIndex = currentIndex;
            currentIndex = index;

            // Load image if it hasn't been loaded yet
            const nextSlide = track.children[index];
            const img = nextSlide.querySelector('img');

            // Set loading timeout for lazy loaded images
            let loadingTimeout;

            if (img.dataset.src && !img.src) {
                const loader = nextSlide.querySelector('.gallery-loader');
                if (loader) {
                    loader.style.display = 'flex';
                }

                img.src = img.dataset.src;
                delete img.dataset.src;

                // Set timeout to prevent infinite loading
                loadingTimeout = setTimeout(() => {
                    const loader = nextSlide.querySelector('.gallery-loader');
                    if (loader) {
                        loader.style.display = 'none';
                    }
                    img.style.opacity = 1;
                }, 3000);

                // Update load and error handlers for this specific image
                img.onload = function () {
                    clearTimeout(loadingTimeout);
                    const loader = nextSlide.querySelector('.gallery-loader');
                    if (loader) {
                        loader.style.display = 'none';
                    }
                    img.style.opacity = 1;
                };

                img.onerror = function () {
                    clearTimeout(loadingTimeout);
                    const loader = nextSlide.querySelector('.gallery-loader');
                    if (loader) {
                        loader.style.display = 'none';
                    }
                    img.src = 'https://via.placeholder.com/400x225?text=Image+Not+Available';
                    img.style.opacity = 1;
                };
            }

            // Update track position
            track.style.transform = `translateX(-${index * 100}%)`;

            // Update indicators
            indicators.querySelectorAll('.gallery-indicator').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });

            // Update ARIA attributes for accessibility
            track.children[previousIndex].setAttribute('aria-hidden', 'true');
            nextSlide.setAttribute('aria-hidden', 'false');

            // If there's autoplay, reset the timer
            if (autoplayTimer) {
                clearTimeout(autoplayTimer);
                startAutoplay();
            }
        }

        // Initialize touch events for swipe
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next
                goToSlide(currentIndex + 1, 'next');
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous
                goToSlide(currentIndex - 1, 'prev');
            }
        }

        // Click event for indicators
        indicators.addEventListener('click', (e) => {
            const dot = e.target.closest('.gallery-indicator');
            if (!dot) return;

            const index = parseInt(dot.dataset.index);
            if (!isNaN(index)) {
                goToSlide(index);
            }
        });

        // Keyboard navigation for indicators
        indicators.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const dot = e.target.closest('.gallery-indicator');
                if (!dot) return;

                const index = parseInt(dot.dataset.index);
                if (!isNaN(index)) {
                    goToSlide(index);
                }
            }
        });

        // Click events for prev/next buttons
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1, 'prev');
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1, 'next');
        });

        // Keyboard navigation
        gallery.setAttribute('tabindex', '0');
        gallery.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToSlide(currentIndex - 1, 'prev');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToSlide(currentIndex + 1, 'next');
            }
        });

        // Function to start autoplay if enabled
        function startAutoplay() {
            if (gallery.dataset.autoplay === 'true') {
                const delay = parseInt(gallery.dataset.delay) || 5000;
                autoplayTimer = setTimeout(() => {
                    goToSlide(currentIndex + 1, 'next');
                }, delay);
            }
        }

        // Start autoplay if enabled
        startAutoplay();

        // Pause autoplay on hover/focus if enabled
        if (gallery.dataset.pauseOnHover === 'true') {
            gallery.addEventListener('mouseenter', () => {
                if (autoplayTimer) {
                    clearTimeout(autoplayTimer);
                    autoplayTimer = null;
                }
            });

            gallery.addEventListener('mouseleave', () => {
                startAutoplay();
            });

            gallery.addEventListener('focus', () => {
                if (autoplayTimer) {
                    clearTimeout(autoplayTimer);
                    autoplayTimer = null;
                }
            }, true);

            gallery.addEventListener('blur', () => {
                startAutoplay();
            }, true);
        }
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Animate skill bars if they're in view
    const skillSection = document.querySelector('#skills');
    if (skillSection && isElementInViewport(skillSection)) {
        skillBars.forEach(bar => animateSkillBar(bar));
    }

    // Set initial active nav item
    updateActiveNavItem();

    // Add typing effect to hero text if available
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle && typeof Typed !== 'undefined') {
        const typed = new Typed(heroTitle, {
            strings: [heroTitle.textContent, 'Web Developer', 'UI/UX Designer', 'Problem Solver'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });
    }

    // Initialize project filters if available
    initProjectFilters();

    // Initialize project image sliders (legacy)
    initProjectImageSliders();

    // Initialize modern project galleries
    initProjectGalleries();

    // Initialize project modals
    initProjectModals();

    // Initialize hero typing effect
    initHeroTyping();
});

// Project filtering functionality
function initProjectFilters() {
    const filterContainer = document.querySelector('.project-filters');
    if (!filterContainer) return;

    const filterButtons = filterContainer.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card, .secondary-project');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filter projects with animation
            projects.forEach(project => {
                if (filter === 'all' || project.classList.contains(filter)) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.classList.add('show');
                    }, 10);
                } else {
                    project.classList.remove('show');
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Add scroll event listener for skill bar animation
window.addEventListener('scroll', () => {
    const skillSection = document.querySelector('#skills');
    if (skillSection && isElementInViewport(skillSection)) {
        skillBars.forEach(bar => {
            if (!bar.classList.contains('animated')) {
                bar.classList.add('animated');
                animateSkillBar(bar);
            }
        });
    }
});

// Update active link on scroll
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });

            // Close sidebar on mobile after clicking
            if (window.innerWidth <= 991) {
                sidebar.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
});