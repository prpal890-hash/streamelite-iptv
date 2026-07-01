/**
 * StreamElite Premium UI/UX & Telemetry Engine
 * Vanilla JavaScript (No jQuery, No Frameworks)
 * Handles Scroll Reveals, Carousels, Counters, and Modal States
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveals();
    initSmoothCounters();
    initMovieCarousel();
    initFaqAccordion();
    initHeaderScrollEffect();
});

/* --- 1. Advanced Scroll Reveal Engine --- */
function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once for performance
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/* --- 2. Smooth Number Counter Engine --- */
function initSmoothCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                animateCounter(entry.target, target, 2000); // 2 seconds duration
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // EaseOutQuart function for premium feel
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(easeProgress * target);
        
        element.innerText = currentCount.toLocaleString() + (target > 100 ? '+' : '%');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.innerText = target.toLocaleString() + (target > 100 ? '+' : '%');
        }
    };
    window.requestAnimationFrame(step);
}

/* --- 3. Vanilla JS Movie Poster Carousel --- */
function initMovieCarousel() {
    const track = document.getElementById('movie-track');
    const container = document.getElementById('movie-carousel-container');
    const btnNext = document.getElementById('movie-next');
    const btnPrev = document.getElementById('movie-prev');

    if (!track || !btnNext || !btnPrev) return;

    // Automatic scroll interval
    let autoScrollInterval = setInterval(scrollNext, 3000);

    function scrollNext() {
        const itemWidth = track.firstElementChild.clientWidth + 24; // width + gap
        if (container.scrollLeft + container.clientWidth >= track.scrollWidth - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' }); // Loop back
        } else {
            container.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    }

    function scrollPrev() {
        const itemWidth = track.firstElementChild.clientWidth + 24;
        container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }

    btnNext.addEventListener('click', () => {
        clearInterval(autoScrollInterval);
        scrollNext();
        autoScrollInterval = setInterval(scrollNext, 3000);
    });

    btnPrev.addEventListener('click', () => {
        clearInterval(autoScrollInterval);
        scrollPrev();
        autoScrollInterval = setInterval(scrollNext, 3000);
    });

    // Pause on hover
    container.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    container.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(scrollNext, 3000);
    });
}

/* --- 4. Interactive FAQ Accordion --- */
function initFaqAccordion() {
    const faqButtons = document.querySelectorAll('.faq-btn');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.icon');
            
            // Close others (Optional, makes it act like a true accordion)
            document.querySelectorAll('.faq-content').forEach(el => {
                if(el !== content) el.classList.add('hidden');
            });
            document.querySelectorAll('.faq-btn .icon').forEach(el => {
                if(el !== icon) el.style.transform = 'rotate(0deg)';
            });

            // Toggle current
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

/* --- 5. Dynamic Header Glassmorphism on Scroll --- */
function initHeaderScrollEffect() {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('py-2');
            header.classList.remove('py-4');
        } else {
            header.classList.add('py-4');
            header.classList.remove('py-2');
        }
    });
}

/* --- 6. CRO Modals & Form Handling --- */
function openTrialModal() {
    const modal = document.getElementById('trial-modal');
    if (!modal) return;
    document.getElementById('trial-modal-title').textContent = "Request Free Trial";
    document.getElementById('selected-package').value = "Free Trial Pass";
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Trigger animation frame for smooth fade-in
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        document.getElementById('trial-modal-card').classList.remove('scale-95');
    });
}

function openPurchaseModal(tierString, pricingValue) {
    const modal = document.getElementById('trial-modal');
    if (!modal) return;
    document.getElementById('trial-modal-title').textContent = `Checkout: ${tierString}`;
    document.getElementById('selected-package').value = `${tierString} (${pricingValue})`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        document.getElementById('trial-modal-card').classList.remove('scale-95');
    });
}

function closeTrialModal() {
    const modal = document.getElementById('trial-modal');
    const card = document.getElementById('trial-modal-card');
    if (modal) {
        modal.classList.add('opacity-0');
        card.classList.add('scale-95');
        // Wait for CSS transition to finish before hiding
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    const entityName = document.getElementById('form-name').value;
    const phoneContact = document.getElementById('form-phone').value;
    const clientDevice = document.getElementById('form-device').value;
    const planIdentifier = document.getElementById('selected-package').value;

    const payloadText = `New IPTV Request:\n- Plan: ${planIdentifier}\n- Name: ${entityName}\n- Phone: ${phoneContact}\n- Device: ${clientDevice}`;
    const targetGatewayRoutingURL = `https://wa.me/447900577564?text=${encodeURIComponent(payloadText)}`;
    
    window.open(targetGatewayRoutingURL, '_blank');
    closeTrialModal();
    document.getElementById('trial-form').reset();
}