// DOM Elements
const header = document.querySelector('header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const glassNav = document.querySelector('.glass-nav');
const themeToggle = document.querySelector('.theme-toggle');
const sections = document.querySelectorAll('section');
const skillBars = document.querySelectorAll('.skill-progress-bar');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('.contact-form');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    glassNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!glassNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && glassNav.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        glassNav.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('dark-theme', isDark);
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('dark-theme');
if (savedTheme === 'true') {
    document.body.classList.add('dark-theme');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Smooth Scrolling for Navigation Links
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

            // Smooth scroll to target
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

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
});

// Intersection Observer for Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
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
    card.classList.add('slide-up');
    observer.observe(card);
});

// Skill Progress Animation
function animateSkillBars() {
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
}

// Project Card Hover Effect
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
    });
});

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const formProps = Object.fromEntries(formData);

        // Basic form validation
        let isValid = true;
        let errorMessage = '';

        if (!formProps.name.trim()) {
            isValid = false;
            errorMessage += 'Please enter your name.\n';
        }

        if (!formProps.email.trim()) {
            isValid = false;
            errorMessage += 'Please enter your email.\n';
        } else if (!isValidEmail(formProps.email)) {
            isValid = false;
            errorMessage += 'Please enter a valid email address.\n';
        }

        if (!formProps.message.trim()) {
            isValid = false;
            errorMessage += 'Please enter your message.\n';
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Here you would typically send the form data to your backend
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            // Show error message
            alert('Sorry, there was an error sending your message. Please try again later.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Animate skill bars if they're in view
    const skillSection = document.querySelector('#skills');
    if (skillSection && isElementInViewport(skillSection)) {
        animateSkillBars();
    }
});

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
        animateSkillBars();
    }
}); 