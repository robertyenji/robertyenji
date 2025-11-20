// ===================================
// MOBILE MENU TOGGLE
// ===================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
const elementsToAnimate = document.querySelectorAll(`
    .about-content,
    .number-card,
    .service-card,
    .education-card,
    .contact-content
`);

elementsToAnimate.forEach(el => {
    observer.observe(el);
});

// ===================================
// COUNTER ANIMATION FOR STATS
// ===================================

const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const isDecimal = target.toString().includes('.');
    const isMoney = element.textContent.includes('$');
    const isPercentage = element.textContent.includes('%');
    const hasPlus = element.textContent.includes('+');

    const updateCounter = () => {
        current += increment;

        if (current < target) {
            if (isMoney) {
                element.textContent = `$${current.toFixed(1)}M`;
            } else if (isDecimal) {
                element.textContent = current.toFixed(1) + (isPercentage ? '%' : '');
            } else {
                element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (isMoney) {
                element.textContent = `$${target}M`;
            } else {
                element.textContent = target + (isPercentage ? '%' : '') + (hasPlus ? '+' : '');
            }
        }
    };

    updateCounter();
};

// Observe stat numbers
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const text = statNumber.textContent;

            // Extract numeric value
            let targetValue;
            if (text.includes('$')) {
                targetValue = parseFloat(text.replace(/[$M+%]/g, ''));
            } else if (text.includes('%')) {
                targetValue = parseFloat(text.replace(/[%+]/g, ''));
            } else {
                targetValue = parseInt(text.replace(/[+]/g, ''));
            }

            // Animate
            animateCounter(statNumber, targetValue, 2000);

            statObserver.unobserve(statNumber);
        }
    });
}, { threshold: 0.5 });

// Observe all stat numbers
document.querySelectorAll('.stat-number, .number-value').forEach(stat => {
    statObserver.observe(stat);
});

// ===================================
// PARALLAX EFFECT FOR HERO
// ===================================

const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// ===================================
// CURSOR TRAIL EFFECT (DESKTOP ONLY)
// ===================================

if (window.innerWidth > 768) {
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll('.circle');

    // Create cursor circles if they don't exist
    if (circles.length === 0) {
        const colors = [
            'rgba(59, 130, 246, 0.1)',
            'rgba(139, 92, 246, 0.1)'
        ];

        colors.forEach((color, index) => {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: ${color};
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.3s ease;
                mix-blend-mode: screen;
            `;
            document.body.appendChild(circle);
        });
    }

    const circlesArray = Array.from(document.querySelectorAll('.circle'));

    window.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    const animateCircles = () => {
        let x = coords.x;
        let y = coords.y;

        circlesArray.forEach((circle, index) => {
            circle.style.left = x - 12 + 'px';
            circle.style.top = y - 12 + 'px';
            circle.style.transform = `scale(${(circlesArray.length - index) / circlesArray.length})`;

            const nextCircle = circlesArray[index + 1] || circlesArray[0];
            x += (nextCircle.offsetLeft - x) * 0.3;
            y += (nextCircle.offsetTop - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    };

    animateCircles();
}

// ===================================
// TYPING EFFECT FOR HERO SUBTITLE
// ===================================

const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };

    type();
};

// Uncomment to enable typing effect
// const heroSubtitle = document.querySelector('.hero-subtitle');
// if (heroSubtitle) {
//     const originalText = heroSubtitle.textContent;
//     setTimeout(() => {
//         typeWriter(heroSubtitle, originalText, 50);
//     }, 1000);
// }

// ===================================
// ACTIVE SECTION HIGHLIGHTING IN NAV
// ===================================

const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.style.color = 'var(--accent-primary)';
        } else if (navLink) {
            navLink.style.color = '';
        }
    });
};

window.addEventListener('scroll', highlightNav);

// ===================================
// CARD TILT EFFECT ON HOVER
// ===================================

const cards = document.querySelectorAll('.service-card, .number-card, .education-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

const createScrollToTopButton = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-gradient);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 20px rgba(59, 130, 246, 0.3);
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
};

createScrollToTopButton();

// ===================================
// LOADING ANIMATION
// ===================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c👋 Built from less. Delivering more.', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cInterested in the code? Visit: https://github.com/robertyenji', 'font-size: 14px; color: #8b5cf6;');

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for scroll events
const debounce = (func, wait = 10) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll handlers
window.removeEventListener('scroll', highlightNav);
window.addEventListener('scroll', debounce(highlightNav, 10));
