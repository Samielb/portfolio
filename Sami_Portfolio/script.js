// Language switcher
const langSwitch = document.getElementById('lang-switch');
let currentLang = 'nl';

function updateLanguage() {
    document.querySelectorAll('[data-nl][data-en]').forEach(element => {
        const newText = element.getAttribute(`data-${currentLang}`);

        // Special handling for the hero title to preserve the name highlight
        if (element.classList.contains('hero') && element.tagName === 'H1') {
            element.innerHTML = `${newText} <br><span class="highlight">Sami el Baghdadi</span>`;
        } else {
            element.textContent = newText;
        }
    });

    document.querySelectorAll('[data-nl-aria][data-en-aria]').forEach(element => {
        const newAria = element.getAttribute(`data-${currentLang}-aria`);
        element.setAttribute('aria-label', newAria);
    });

    // Update button text
    langSwitch.textContent = currentLang === 'nl' ? 'EN' : 'NL';
    langSwitch.setAttribute('data-lang', currentLang === 'nl' ? 'en' : 'nl');
}

langSwitch.addEventListener('click', () => {
    currentLang = currentLang === 'nl' ? 'en' : 'nl';
    updateLanguage();

    // Sluit het menu als het open is
    document.querySelector('nav ul').classList.remove('show');
    document.querySelector('.hamburger').classList.remove('show');
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Hamburger toggle
document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('nav ul').classList.toggle('show');	
    document.querySelector('.hamburger').classList.toggle('show');	
});

// Menu sluiten bij klik op link
document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('nav ul').classList.remove('show');
        document.querySelector('.hamburger').classList.remove('show');
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Animate skill bars when visible
            if (entry.target.classList.contains('skill-category')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 100);
                });
            }
            
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    fadeInObserver.observe(section);
});

// Apply fade-in to skill categories
document.querySelectorAll('.skill-category').forEach(category => {
    fadeInObserver.observe(category);
});

// Apply fade-in to timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(' + (index % 2 === 0 ? '-30px' : '30px') + ')';
    item.style.transition = 'opacity 0.4s ease-out ' + (index * 0.08) + 's, transform 0.4s ease-out ' + (index * 0.08) + 's';
    fadeInObserver.observe(item);
});

// Apply fade-in to projects
document.querySelectorAll('.project').forEach((project, index) => {
    project.style.opacity = '0';
    project.style.transform = 'translateY(30px)';
    project.style.transition = 'opacity 0.4s ease-out ' + (index * 0.15) + 's, transform 0.4s ease-out ' + (index * 0.15) + 's';
    fadeInObserver.observe(project);
});

// Smooth navbar background on scroll with throttling
let lastScroll = 0;
let ticking = false;

function updateNavbar() {
    const currentScroll = window.pageYOffset;
    const nav = document.querySelector('nav');
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.9)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});



// Lightbox functionality
function openLightbox(imageContainer) {
    const img = imageContainer.querySelector('img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    
    lightbox.style.display = 'block';
    lightboxImg.src = img.src;
    caption.textContent = img.alt;
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

// ── Projects Slider: drag to scroll ──────────────────────────
const slider = document.querySelector('.projects-slider');
const prevArrow = document.querySelector('.slider-arrow--prev');
const nextArrow = document.querySelector('.slider-arrow--next');
if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    const updateArrows = () => {
        if (!prevArrow || !nextArrow) return;

        const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
        prevArrow.disabled = slider.scrollLeft <= 4;
        nextArrow.disabled = slider.scrollLeft >= maxScrollLeft - 4;
    };

    if (prevArrow && nextArrow) {
        const scrollStep = () => Math.max(slider.clientWidth * 0.78, 280);

        prevArrow.addEventListener('click', () => {
            slider.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
        });

        nextArrow.addEventListener('click', () => {
            slider.scrollBy({ left: scrollStep(), behavior: 'smooth' });
        });

        slider.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();
    }

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('grabbing');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('grabbing');
        updateArrows();
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('grabbing');
        updateArrows();
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.4;
        slider.scrollLeft = scrollLeft - walk;
    });
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.style.display = 'none';
    
    // Re-enable body scroll
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking on close button
const lightboxCloseBtn = document.querySelector('.lightbox-close');
if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
}

// Close lightbox when clicking outside the image
const lightboxOverlay = document.getElementById('lightbox');
if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
