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

// Initialize AOS (Animate On Scroll) if available
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}

// Mobile Menu Toggle with improved animation
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    glassNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');

    // Animate menu items sequentially
    const menuItems = glassNav.querySelectorAll('li');
    menuItems.forEach((item, index) => {
        if (glassNav.classList.contains('active')) {
            setTimeout(() => {
                item.classList.add('animate-in');
            }, 100 * index);
        } else {
            item.classList.remove('animate-in');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!glassNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && glassNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        glassNav.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') === 'dark';

    // Apply saved theme or system preference
    if (savedTheme || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
});

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    // Toggle dark theme
    document.body.classList.toggle('dark-theme');

    // Update icon
    const isDark = document.body.classList.contains('dark-theme');
    themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';

    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Enhanced Smooth Scrolling with offset for fixed header
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
            document.querySelectorAll('.glass-nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Enhanced Header Scroll Effect with parallax
let lastScroll = 0;
window.addEventListener('scroll', () => {
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
    updateActiveNavItem();
});

// Update active navigation item based on scroll position
function updateActiveNavItem() {
    const scrollPosition = window.scrollY + header.offsetHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.glass-nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Enhanced Intersection Observer for Animations
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
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for fade-in animation
sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Observe skill bars for progress animation
skillBars.forEach(bar => {
    observer.observe(bar);
});

// Observe project cards for slide-up animation
projectCards.forEach(card => {
    observer.observe(card);
});

// Observe expertise items
expertiseItems.forEach(item => {
    observer.observe(item);
});

// Observe certification cards
certificationCards.forEach(card => {
    observer.observe(card);
});

// Enhanced Skill Progress Animation with easing
function animateSkillBar(bar) {
    const progress = bar.getAttribute('data-progress');
    const duration = 1500; // ms
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

// Enhanced Project Card Hover Effect with 3D tilt
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
    });

    // 3D tilt effect
    card.addEventListener('mousemove', (e) => {
        if (!card.classList.contains('hover')) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

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