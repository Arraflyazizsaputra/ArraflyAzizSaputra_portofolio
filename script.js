//============================================================
//JAVASCRIPT LOGIC
//============================================================
// 0. Smooth Refresh & Page Preloader Lifecycle (Ultra-Smooth Entry)
(function initSmoothRefreshAndLoader() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const preloader = document.getElementById('page-preloader');
    const progressBar = document.getElementById('preloader-progress-bar');
    if (progressBar) progressBar.style.width = '75%';

    function dismissPreloader() {
        if (!preloader || preloader.classList.contains('loaded')) return;
        if (progressBar) progressBar.style.width = '100%';
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 400);
        }, 120);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        dismissPreloader();
    } else {
        window.addEventListener('load', dismissPreloader);
        document.addEventListener('DOMContentLoaded', dismissPreloader);
        setTimeout(dismissPreloader, 600); // Fail-safe
    }
})();

// 1. Initialize Lucide Icons
lucide.createIcons();

// 2. Dynamic Year
document.getElementById('year-copy').textContent = new Date().getFullYear();

// 3. Web Audio API Synthesizer (Realistic "THWIP!" Spider-Man Web Shooter Sound)
let sfxEnabled = true;
const sfxBtn = document.getElementById('sfx-toggle');

function playThwipSound() {
    if (!sfxEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const _now = performance.now();
        if (_now - (window.__lastSfx || 0) < 120) return;
        window.__lastSfx = _now;
        if (!window.__sfxCtx) window.__sfxCtx = new AudioContext();
        const ctx = window.__sfxCtx;
        if (ctx.state === 'suspended') ctx.resume();

        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.12);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        noise.stop(ctx.currentTime + 0.15);
    } catch (e) { }
}

sfxBtn.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    if (sfxEnabled) {
        sfxBtn.classList.remove('opacity-40');
        playThwipSound();
    } else {
        sfxBtn.classList.add('opacity-40');
    }
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
        if (sfxEnabled) playThwipSound();
    });
});

// 4. Solid & Bug-Free Dark / Light Mode System
const htmlElement = document.documentElement;
const themeBtnDesktop = document.getElementById('theme-toggle-btn');
const themeBtnMobile = document.getElementById('theme-toggle-mobile');

function applyTheme(theme) {
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
        localStorage.setItem('spidey_theme', 'dark');
    } else {
        htmlElement.classList.remove('dark');
        localStorage.setItem('spidey_theme', 'light');
    }
    updateThemeIcons(theme);
}

function updateThemeIcons(theme) {
    const isDark = theme === 'dark';
    document.querySelectorAll('.theme-sun-icon').forEach(el => {
        el.style.display = isDark ? 'inline-flex' : 'none';
    });
    document.querySelectorAll('.theme-moon-icon').forEach(el => {
        el.style.display = isDark ? 'none' : 'inline-flex';
    });
}

function toggleTheme() {
    const isCurrentlyDark = htmlElement.classList.contains('dark');
    const targetTheme = isCurrentlyDark ? 'light' : 'dark';
    applyTheme(targetTheme);
}

// Initialize Theme from localStorage or system preference
const savedTheme = localStorage.getItem('spidey_theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeBtnDesktop.addEventListener('click', toggleTheme);
themeBtnMobile.addEventListener('click', toggleTheme);

// 5. BULLETPROOF MOBILE DRAWER MENU LOGIC (DIPERBAIKI SECARA PRESISI)
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const mobileDrawer = document.getElementById('mobile-drawer');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openDrawer() {
    mobileOverlay.classList.remove('hidden');
    // Force browser layout repaint
    void mobileOverlay.offsetWidth;
    void mobileDrawer.offsetWidth;
    mobileOverlay.classList.remove('opacity-0');
    mobileOverlay.classList.add('opacity-100');
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('opacity-100');
    mobileOverlay.classList.add('opacity-0');
    document.body.style.overflow = '';
    setTimeout(() => {
        mobileOverlay.classList.add('hidden');
    }, 300);
}

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openDrawer();
    });
}

if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeDrawer();
    });
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function (e) {
        e.preventDefault();
        closeDrawer();
    });
}

// Smooth scroll and auto-close when clicking mobile drawer links
mobileLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            closeDrawer();

            setTimeout(() => {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navbarOffset = 72;
                    const elementTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
                    if (window.__smoothScrollTo) {
                        window.__smoothScrollTo(elementTop - navbarOffset);
                    } else {
                        window.scrollTo({ top: elementTop - navbarOffset, behavior: 'smooth' });
                    }
                }
            }, 120);
        }
    });
});

// 6. Typing Effect for Hero Subheadline
const typedElement = document.getElementById('typed-text');
const wordsToType = [
    'Web Development Modern',
    'Desain UI/UX Ramah Pengguna',
    'Full-Stack CodeIgniter',
    'Jaringan CISCO',
    'Penggemar Lagu Taylor Swift'
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 75;

function typeLoop() {
    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
        typedElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 35;
    } else {
        typedElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 75;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingDelay = 1800;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % wordsToType.length;
        typingDelay = 400;
    }

    setTimeout(typeLoop, typingDelay);
}
setTimeout(typeLoop, 800);

// 7A. Buttery-Smooth Inertia Scroll Engine (Desktop Wheel + Custom Eased Anchor Scroll)
(function initSilkySmoothScroll() {
    const prefersReduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let isPaused = false;
    let currentY = window.scrollY || 0;
    let targetY = currentY;
    let rafId = null;
    let lastTime = 0;
    let anchorAnimId = null;

    function getMaxScroll() {
        return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function stopAnchorAnim() {
        if (anchorAnimId) {
            cancelAnimationFrame(anchorAnimId);
            anchorAnimId = null;
        }
    }

    function stopWheelLoop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function tickWheel(now) {
        if (isPaused) {
            stopWheelLoop();
            return;
        }
        const dt = Math.min((now - lastTime) / 1000, 0.05) || 0.016;
        lastTime = now;
        const maxY = getMaxScroll();
        targetY = Math.max(0, Math.min(maxY, targetY));

        // Frame-rate independent exponential damping (mulus di 60Hz, 120Hz, 144Hz)
        const factor = 1 - Math.exp(-9.5 * dt);
        currentY += (targetY - currentY) * factor;

        if (Math.abs(targetY - currentY) < 0.45) {
            currentY = targetY;
            window.scrollTo(0, Math.round(currentY));
            rafId = null;
            return;
        }

        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(tickWheel);
    }

    function smoothScrollTo(destY, duration) {
        const maxY = getMaxScroll();
        const clampedDest = Math.max(0, Math.min(maxY, destY));
        stopWheelLoop();
        stopAnchorAnim();

        if (prefersReduced) {
            window.scrollTo(0, clampedDest);
            currentY = clampedDest;
            targetY = clampedDest;
            return;
        }

        const startY = window.scrollY || 0;
        const diff = clampedDest - startY;
        if (Math.abs(diff) < 2) return;

        const dur = duration || Math.min(950, Math.max(520, Math.abs(diff) * 0.42));
        const startTime = performance.now();

        function stepAnchor(now) {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / dur);
            // EaseOutQuart: awal responsif, mendarat sangat lembut
            const ease = 1 - Math.pow(1 - t, 4);
            const nextY = startY + diff * ease;
            window.scrollTo(0, nextY);
            currentY = nextY;
            targetY = nextY;
            if (t < 1 && !isPaused) {
                anchorAnimId = requestAnimationFrame(stepAnchor);
            } else {
                anchorAnimId = null;
            }
        }
        anchorAnimId = requestAnimationFrame(stepAnchor);
    }

    // Hanya aktifkan wheel inertia pada perangkat desktop agar native touch mobile tetap 100% optimal
    window.addEventListener('wheel', function (e) {
        if (prefersReduced || isPaused || e.ctrlKey || document.body.style.overflow === 'hidden') return;
        // Jangan ganggu kontainer internal yang memang punya scroll sendiri
        const scrollable = e.target && e.target.closest && e.target.closest('.custom-scrollbar');
        if (scrollable && scrollable.scrollWidth > scrollable.clientWidth && Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

        e.preventDefault();
        stopAnchorAnim();
        if (!rafId) {
            currentY = window.scrollY || 0;
            targetY = currentY;
        }
        const delta = e.deltaMode === 1 ? e.deltaY * 32 : (e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY);
        targetY = Math.max(0, Math.min(getMaxScroll(), targetY + delta * 0.92));

        if (!rafId) {
            lastTime = performance.now();
            rafId = requestAnimationFrame(tickWheel);
        }
    }, { passive: false });

    // Sinkronkan saat user scroll via sentuhan mobile, keyboard, atau drag scrollbar
    window.addEventListener('touchstart', function () {
        stopWheelLoop();
        stopAnchorAnim();
    }, { passive: true });

    window.addEventListener('keydown', function (e) {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
            stopWheelLoop();
            stopAnchorAnim();
        }
    }, { passive: true });

    window.addEventListener('scroll', function () {
        if (!rafId && !anchorAnimId) {
            currentY = window.scrollY || 0;
            targetY = currentY;
        }
    }, { passive: true });

    window.__smoothScrollTo = smoothScrollTo;
    window.__lenis = {
        stop: function () { isPaused = true; stopWheelLoop(); stopAnchorAnim(); },
        start: function () { isPaused = false; currentY = window.scrollY || 0; targetY = currentY; }
    };
})();

// 7B. Ultra-Smooth Staggered Grid Scroll Reveal (IntersectionObserver 60FPS)
(function initGridScrollReveal() {
    const revealElements = Array.from(document.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
    if (!revealElements.length) return;

    function markRevealed(el) {
        if (el.classList.contains('active')) return;
        el.classList.add('active');
        const delayStr = getComputedStyle(el).getPropertyValue('--d').trim();
        const delayMs = delayStr.endsWith('ms')
            ? parseFloat(delayStr)
            : (delayStr.endsWith('s') ? parseFloat(delayStr) * 1000 : 0);
        setTimeout(() => {
            el.classList.add('reveal-done');
        }, Math.round(880 + (isNaN(delayMs) ? 0 : delayMs)));
    }

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    markRevealed(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // Munculkan langsung elemen yang sudah berada di dalam layar saat halaman dibuka
        requestAnimationFrame(() => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
                    markRevealed(el);
                    revealObserver.unobserve(el);
                }
            });
        });
    } else {
        function checkScrollReveal() {
            const windowHeight = window.innerHeight;
            revealElements.forEach(el => {
                if (el.getBoundingClientRect().top < windowHeight - 50) {
                    markRevealed(el);
                }
            });
        }
        window.addEventListener('scroll', checkScrollReveal, { passive: true });
        checkScrollReveal();
    }
})();

// Smooth in-page anchor navigation with fixed navbar offset compensation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.classList.contains('mobile-link')) return;
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const navbarOffset = 72;
            const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarOffset;
            if (window.__smoothScrollTo) {
                window.__smoothScrollTo(targetTop);
            } else {
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
            }
            if (typeof playThwipSound === 'function') playThwipSound();
        }
    });
});

// 8. Back to Top Button Visibility
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}, { passive: true });

// 9. Gallery Data & Multi-Photo Lightbox Logic
const galleryData = [
    {
        src: 'assets/images/photo-1-almamater.jpg',
        badge: 'MOMEN #1 • ALMAMATER',
        title: 'Mahasiswa SI & Tech Leader 🎓',
        desc: 'Arrafly Aziz Saputra — Bangga membawa almamater dan antusiasme tinggi dalam riset teknologi, pengembangan web modern, dan kepemimpinan tim.'
    },
    {
        src: 'assets/images/photo-2-spideylaptop.jpg',
        badge: 'MOMEN #2 • SPIDEY-DEV',
        title: 'Spider-Dev Late Night Station 💻🕷️',
        desc: 'Fokus penuh merajut baris kode bersama laptop berstiker Spider-Man & Captain America. Menghabisi bug dengan presisi superhero!'
    },
    {
        src: 'assets/images/photo-3-focus.jpg',
        badge: 'MOMEN #3 • BRAINSTORMING',
        title: 'Perancangan Konsep & UI/UX 🎨📝',
        desc: 'Merancang diagram alur, wireframe interaktif, dan pemecahan masalah dengan ketelitian tinggi sebelum proses koding dimulai.'
    },
    {
        src: 'assets/images/photo-4-cafe.jpg',
        badge: 'MOMEN #4 • NETWORKING',
        title: 'Friendly Neighborhood Spirit ☕⚡',
        desc: 'Karakter ramah dan komunikatif dalam berdiskusi santai, bertukar ide inovatif, dan menjalin kolaborasi dengan sesama developer.'
    },
    {
        src: 'assets/images/photo-5-batik.jpg',
        badge: 'MOMEN #5 • FORMAL & KULTUR',
        title: 'Dedikasi Profesional & Budaya Nusantara 🇮🇩',
        desc: 'Menjunjung tinggi etika profesional dan identitas budaya nusantara dalam setiap presentasi proyek dan forum resmi.'
    },
    {
        src: 'assets/images/photo-6-outdoor.jpg',
        badge: 'MOMEN #6 • EKSPLORASI',
        title: 'Eksplorasi & Siap Tangguh Lapangan 🌐🚀',
        desc: 'Tangguh beradaptasi dengan kondisi lapangan, berani melangkah mencari tantangan dan solusi teknologi tepat guna.'
    }
];

let currentLightboxIndex = 0;
let isLightboxZoomed = false;
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxDotsContainer = document.getElementById('lightbox-dots');

function openLightboxByIndex(index) {
    currentLightboxIndex = (index + galleryData.length) % galleryData.length;
    const item = galleryData[currentLightboxIndex];
    if (!item || !lightboxImg) return;

    resetLightboxZoom();

    // Efek transisi halus saat berganti foto
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.96)';

    setTimeout(() => {
        lightboxImg.src = item.src;
        lightboxImg.alt = "Galeri Foto Arrafly";
        lightboxImg.onload = () => {
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        };
    }, 70);

    updateLightboxDots();

    if (lightboxModal) {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof playThwipSound === 'function') playThwipSound();
}

function nextLightbox(e) {
    if (e) e.stopPropagation();
    openLightboxByIndex(currentLightboxIndex + 1);
}

function prevLightbox(e) {
    if (e) e.stopPropagation();
    openLightboxByIndex(currentLightboxIndex - 1);
}

function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    resetLightboxZoom();
    if (typeof playThwipSound === 'function') playThwipSound();
}

// Fitur Zoom Interaktif (1.75x Scale Toggle)
function toggleLightboxZoom(e) {
    if (e) e.stopPropagation();
    if (!lightboxImg) return;
    isLightboxZoomed = !isLightboxZoomed;
    const zoomIcon = document.getElementById('lightbox-zoom-icon');
    if (isLightboxZoomed) {
        lightboxImg.style.transform = 'scale(1.75)';
        lightboxImg.classList.remove('cursor-zoom-in');
        lightboxImg.classList.add('cursor-zoom-out');
        if (zoomIcon) zoomIcon.setAttribute('data-lucide', 'zoom-out');
    } else {
        lightboxImg.style.transform = 'scale(1)';
        lightboxImg.classList.remove('cursor-zoom-out');
        lightboxImg.classList.add('cursor-zoom-in');
        if (zoomIcon) zoomIcon.setAttribute('data-lucide', 'zoom-in');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (typeof playThwipSound === 'function') playThwipSound();
}

function resetLightboxZoom() {
    isLightboxZoomed = false;
    if (lightboxImg) {
        lightboxImg.style.transform = 'scale(1)';
        lightboxImg.classList.remove('cursor-zoom-out');
        lightboxImg.classList.add('cursor-zoom-in');
    }
    const zoomIcon = document.getElementById('lightbox-zoom-icon');
    if (zoomIcon) zoomIcon.setAttribute('data-lucide', 'zoom-in');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Update Indikator Titik Visual Bercahaya (Tanpa Teks)
function updateLightboxDots() {
    if (!lightboxDotsContainer) return;
    const dots = lightboxDotsContainer.querySelectorAll('.lb-dot');
    dots.forEach((dot, idx) => {
        if (idx === currentLightboxIndex) {
            dot.className = "lb-dot w-7 h-2 rounded-full bg-spidey-crimson shadow-[0_0_14px_#e3000e] transition-all duration-300";
        } else {
            dot.className = "lb-dot w-2 h-2 rounded-full bg-white/35 hover:bg-white/80 transition-all duration-300 cursor-pointer";
        }
    });
}

// Gestur Sentuh Geser (Swipe) untuk Pengalaman Mobile yang Responsif
let lbTouchStartX = 0;
if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
        lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
        const diff = lbTouchStartX - e.changedTouches[0].screenX;
        if (!isLightboxZoomed) {
            if (diff > 45) nextLightbox();
            else if (diff < -45) prevLightbox();
        }
    }, { passive: true });
}

// Navigasi Keyboard (Panah Kiri, Panah Kanan, Escape, dan Tombol Z untuk Zoom)
window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'z' || e.key === 'Z') toggleLightboxZoom();
});

// 10. True Seamless Infinite Auto-Sliding Carousel Engine (Tanpa Lompat / Rewind)
const carouselTrack = document.getElementById('carousel-track');
const carouselViewport = document.getElementById('carousel-viewport');
const carouselProgressBar = document.getElementById('carousel-progress-bar');
const carouselCounterText = document.getElementById('carousel-counter-text');
const carouselDots = document.querySelectorAll('.carousel-dot');
const totalRealSlides = galleryData.length; // 6 foto asli
let currentIndex = totalRealSlides; // Posisi awal di set kartu asli (indeks 6)
let isCarouselPaused = false;
let isTransitioning = false;
let autoSlideTimer = null;
let progressPercent = 0;
const slideDuration = 3500; // 3.5 detik per slide
const progressTick = 70; // interval timer ms

// Mengukur jarak pergeseran kartu secara absolut dan presisi di semua resolusi layar (Mobile & Desktop)
function getCardStep() {
    if (!carouselTrack || !carouselTrack.firstElementChild) return 0;
    const firstCard = carouselTrack.firstElementChild;
    const secondCard = firstCard.nextElementSibling;
    if (secondCard) {
        return secondCard.offsetLeft - firstCard.offsetLeft;
    }
    return firstCard.offsetWidth;
}

// Inisialisasi Kloning Kartu untuk Sirkulasi Infinite Loop Tanpa Batas
function initInfiniteCarousel() {
    if (!carouselTrack) return;
    const originalCards = Array.from(carouselTrack.children);
    if (originalCards.length !== totalRealSlides) return;

    // Beri tanda indeks asli pada tiap kartu
    originalCards.forEach((card, idx) => {
        card.setAttribute('data-real-index', idx);
    });

    // Kloning 1 set lengkap (0..5) untuk ditaruh di awal (prepend)
    const prependFragment = document.createDocumentFragment();
    originalCards.forEach((card, idx) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('data-clone', 'prepend');
        clone.setAttribute('data-real-index', idx);
        prependFragment.appendChild(clone);
    });
    carouselTrack.insertBefore(prependFragment, originalCards[0]);

    // Kloning 1 set lengkap (0..5) untuk ditaruh di akhir (append)
    const appendFragment = document.createDocumentFragment();
    originalCards.forEach((card, idx) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('data-clone', 'append');
        clone.setAttribute('data-real-index', idx);
        appendFragment.appendChild(clone);
    });
    carouselTrack.appendChild(appendFragment);

    // Set posisi awal tepat di kartu asli pertama (indeks 6) tanpa animasi
    currentIndex = totalRealSlides;
    carouselTrack.style.transition = 'none';
    carouselTrack.style.transform = `translate3d(-${currentIndex * getCardStep()}px, 0, 0)`;
    carouselTrack.offsetHeight; // Force DOM reflow
    carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';

    updateCarouselUI();
}

// Memperbarui indikator dots dan teks counter berdasarkan indeks slide asli
function updateCarouselUI() {
    const realIndex = ((currentIndex % totalRealSlides) + totalRealSlides) % totalRealSlides;

    if (carouselCounterText) {
        carouselCounterText.textContent = `SLIDE ${realIndex + 1} DARI ${totalRealSlides}`;
    }

    carouselDots.forEach((dot, idx) => {
        if (idx === realIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Bergulir maju ke slide berikutnya secara terus-menerus
function nextCarouselSlide() {
    if (!carouselTrack || isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    progressPercent = 0;
    if (carouselProgressBar) carouselProgressBar.style.width = '0%';

    carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
    carouselTrack.style.transform = `translate3d(-${currentIndex * getCardStep()}px, 0, 0)`;
    updateCarouselUI();
}

// Bergulir mundur ke slide sebelumnya
function prevCarouselSlide() {
    if (!carouselTrack || isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    progressPercent = 0;
    if (carouselProgressBar) carouselProgressBar.style.width = '0%';

    carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
    carouselTrack.style.transform = `translate3d(-${currentIndex * getCardStep()}px, 0, 0)`;
    updateCarouselUI();
}

// Lompat langsung ke dot pilihan dengan jalur geser terpendek
function goToCarouselSlide(targetRealIndex) {
    if (!carouselTrack || isTransitioning) return;
    const currentRealIndex = ((currentIndex % totalRealSlides) + totalRealSlides) % totalRealSlides;
    let diff = targetRealIndex - currentRealIndex;
    if (diff > totalRealSlides / 2) diff -= totalRealSlides;
    if (diff < -totalRealSlides / 2) diff += totalRealSlides;
    if (diff === 0) return;

    isTransitioning = true;
    currentIndex += diff;
    progressPercent = 0;
    if (carouselProgressBar) carouselProgressBar.style.width = '0%';

    carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
    carouselTrack.style.transform = `translate3d(-${currentIndex * getCardStep()}px, 0, 0)`;
    updateCarouselUI();
    if (typeof playThwipSound === 'function') playThwipSound();
}

// Loop Teleport Tanpa Jeda: Saat animasi selesai, reset posisi secara tak kasat mata
if (carouselTrack) {
    carouselTrack.addEventListener('transitionend', (e) => {
        if (e.target !== carouselTrack) return;
        isTransitioning = false;

        // Jika sudah melewati set kartu asli ke set klon akhir
        if (currentIndex >= totalRealSlides * 2) {
            carouselTrack.style.transition = 'none';
            currentIndex -= totalRealSlides;
            carouselTrack.style.transform = `translate3d(-${currentIndex * getCardStep()}px, 0, 0)`;
            carouselTrack.offsetHeight; // Force reflow
        }
        // Jika mundur sebelum set kartu asli ke set klon awal
        else if (currentIndex < totalRealSlides) {
            carouselTrack.style.transition = 'none';
            currentIndex += totalRealSlides;
            carouselTrack.style.transform = `translate3d(-${currentIndex * getCardStep()}px, 0, 0)`;
            carouselTrack.offsetHeight; // Force reflow
        }
    });
}

// Timer Auto-Slide dengan Progress Bar Dinamis
function startAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
        if (!isCarouselPaused) {
            progressPercent += (progressTick / slideDuration) * 100;
            if (progressPercent >= 100) {
                progressPercent = 0;
                nextCarouselSlide();
            }
            if (carouselProgressBar) {
                carouselProgressBar.style.width = `${Math.min(100, progressPercent)}%`;
            }
        }
    }, progressTick);
}

// Pause otomatis saat kursor mouse diarahkan atau layar HP disentuh (Mobile Safe)
if (carouselViewport) {
    carouselViewport.addEventListener('mouseenter', () => {
        if (window.matchMedia('(pointer: fine)').matches) isCarouselPaused = true;
    });
    carouselViewport.addEventListener('mouseleave', () => { isCarouselPaused = false; });
    carouselViewport.addEventListener('touchstart', () => { isCarouselPaused = true; }, { passive: true });
    carouselViewport.addEventListener('touchend', () => {
        setTimeout(() => { isCarouselPaused = false; }, 2000);
    }, { passive: true });
    carouselViewport.addEventListener('touchcancel', () => {
        setTimeout(() => { isCarouselPaused = false; }, 1000);
    }, { passive: true });
}

// Gestur Sentuh Geser (Swipe Gesture) Responsif pada Layar Mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
if (carouselViewport) {
    carouselViewport.addEventListener('touchstart', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }
    }, { passive: true });
    carouselViewport.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    nextCarouselSlide();
                } else {
                    prevCarouselSlide();
                }
                if (typeof playThwipSound === 'function') playThwipSound();
            }
        }
    }, { passive: true });
}

// Responsif Saat Layar Diputar atau Di-resize
window.addEventListener('resize', () => {
    if (!carouselTrack) return;
    carouselTrack.style.transition = 'none';
    carouselTrack.style.transform = `translate3d(-${currentIndex * getCardStep()}px, 0, 0)`;
    carouselTrack.offsetHeight;
    carouselTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
});

// Jalankan Inisialisasi Carousel Infinite Galeri
initInfiniteCarousel();
startAutoSlide();

// ============================================================
// 10B. TRUE SEAMLESS INFINITE AUTO-SLIDING ENGINE UNTUK SERTIFIKAT
// ============================================================
const certTrack = document.getElementById('cert-track');
const certViewport = document.getElementById('cert-viewport');
const certProgressBar = document.getElementById('cert-progress-bar');
const certCounterText = document.getElementById('cert-counter-text');
const certDotsContainer = document.getElementById('cert-dots-container');
let totalRealCertSlides = 5;
let currentCertIndex = 5;
let isCertTransitioning = false;
let isCertPaused = false;
let certAutoSlideTimer = null;
let certProgressPercent = 0;
const certSlideDuration = 3500; // 3.5 detik per slide
const certProgressTick = 50;
let certResumeTimer = null;

function pauseCertAutoSlide() {
    isCertPaused = true;
    if (certResumeTimer) clearTimeout(certResumeTimer);
}

function resumeCertAutoSlide(delay = 0) {
    if (certResumeTimer) clearTimeout(certResumeTimer);
    if (delay > 0) {
        certResumeTimer = setTimeout(() => {
            isCertPaused = false;
        }, delay);
    } else {
        isCertPaused = false;
    }
}

function getCertCardStep() {
    if (!certTrack || !certTrack.firstElementChild) return 0;
    const firstCard = certTrack.firstElementChild;
    const secondCard = firstCard.nextElementSibling;
    if (secondCard && secondCard.offsetLeft > firstCard.offsetLeft) {
        return secondCard.offsetLeft - firstCard.offsetLeft;
    }
    // Fallback akurat dan presisi untuk mobile
    const firstWidth = firstCard.getBoundingClientRect().width || firstCard.offsetWidth || (certViewport ? certViewport.clientWidth : 300);
    const gap = window.innerWidth >= 640 ? 24 : 16;
    return firstWidth + gap;
}

function initInfiniteCertCarousel() {
    if (!certTrack) return;
    if (certTrack.querySelector('[data-cert-clone]')) return;

    const originalCards = Array.from(certTrack.children);
    totalRealCertSlides = originalCards.length;
    if (totalRealCertSlides === 0) return;

    // Beri tanda data-real-index
    originalCards.forEach((card, idx) => {
        card.setAttribute('data-cert-real-index', idx);
    });

    // Kloning 1 set lengkap ke awal (prepend)
    const prependFragment = document.createDocumentFragment();
    originalCards.forEach((card, idx) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('data-cert-clone', 'prepend');
        clone.setAttribute('data-cert-real-index', idx);
        prependFragment.appendChild(clone);
    });
    certTrack.insertBefore(prependFragment, originalCards[0]);

    // Kloning 1 set lengkap ke akhir (append)
    const appendFragment = document.createDocumentFragment();
    originalCards.forEach((card, idx) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('data-cert-clone', 'append');
        clone.setAttribute('data-cert-real-index', idx);
        appendFragment.appendChild(clone);
    });
    certTrack.appendChild(appendFragment);

    // Re-render Lucide icons pada cloned nodes
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Set posisi awal di set kartu asli pertama tanpa animasi
    currentCertIndex = totalRealCertSlides;
    certTrack.style.transition = 'none';
    certTrack.style.transform = `translate3d(-${currentCertIndex * getCertCardStep()}px, 0, 0)`;
    certTrack.offsetHeight; // Force reflow
    certTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';

    updateCertCarouselUI();
}

function updateCertCarouselUI() {
    if (totalRealCertSlides === 0) return;
    const realIndex = ((currentCertIndex % totalRealCertSlides) + totalRealCertSlides) % totalRealCertSlides;

    if (certCounterText) {
        certCounterText.textContent = `SERTIFIKAT ${realIndex + 1} DARI ${totalRealCertSlides}`;
    }

    if (certDotsContainer) {
        const dots = certDotsContainer.querySelectorAll('.cert-dot');
        dots.forEach((dot, idx) => {
            if (idx === realIndex) {
                dot.className = 'cert-dot active w-9 h-2.5 rounded-full bg-spidey-crimson shadow-[0_0_12px_#e3000e] transition-all duration-300';
            } else {
                dot.className = 'cert-dot w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-slate-700 hover:bg-spidey-crimson/70 transition-all duration-300 cursor-pointer';
            }
        });
    }
}

function nextCertSlide() {
    if (!certTrack || isCertTransitioning) return;
    isCertTransitioning = true;
    currentCertIndex++;
    certProgressPercent = 0;
    if (certProgressBar) certProgressBar.style.width = '0%';

    certTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
    certTrack.style.transform = `translate3d(-${currentCertIndex * getCertCardStep()}px, 0, 0)`;
    updateCertCarouselUI();

    // Safety timeout agar tidak terkunci di HP
    setTimeout(() => {
        isCertTransitioning = false;
    }, 700);
}

function prevCertSlide() {
    if (!certTrack || isCertTransitioning) return;
    isCertTransitioning = true;
    currentCertIndex--;
    certProgressPercent = 0;
    if (certProgressBar) certProgressBar.style.width = '0%';

    certTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
    certTrack.style.transform = `translate3d(-${currentCertIndex * getCertCardStep()}px, 0, 0)`;
    updateCertCarouselUI();

    setTimeout(() => {
        isCertTransitioning = false;
    }, 700);
}

function goToCertSlide(targetRealIndex) {
    if (!certTrack || isCertTransitioning) return;
    const currentRealIndex = ((currentCertIndex % totalRealCertSlides) + totalRealCertSlides) % totalRealCertSlides;
    let diff = targetRealIndex - currentRealIndex;
    if (diff > totalRealCertSlides / 2) diff -= totalRealCertSlides;
    if (diff < -totalRealCertSlides / 2) diff += totalRealCertSlides;
    if (diff === 0) return;

    isCertTransitioning = true;
    currentCertIndex += diff;
    certProgressPercent = 0;
    if (certProgressBar) certProgressBar.style.width = '0%';

    certTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
    certTrack.style.transform = `translate3d(-${currentCertIndex * getCertCardStep()}px, 0, 0)`;
    updateCertCarouselUI();
    if (typeof playThwipSound === 'function') playThwipSound();

    setTimeout(() => {
        isCertTransitioning = false;
    }, 700);
}

// Loop Teleport Tanpa Jeda untuk Sertifikat
if (certTrack) {
    certTrack.addEventListener('transitionend', (e) => {
        if (e.target !== certTrack) return;
        isCertTransitioning = false;

        if (currentCertIndex >= totalRealCertSlides * 2) {
            certTrack.style.transition = 'none';
            currentCertIndex -= totalRealCertSlides;
            certTrack.style.transform = `translate3d(-${currentCertIndex * getCertCardStep()}px, 0, 0)`;
            certTrack.offsetHeight;
        } else if (currentCertIndex < totalRealCertSlides) {
            certTrack.style.transition = 'none';
            currentCertIndex += totalRealCertSlides;
            certTrack.style.transform = `translate3d(-${currentCertIndex * getCertCardStep()}px, 0, 0)`;
            certTrack.offsetHeight;
        }
    });
}

// Timer Auto-Slide Sertifikat
function startCertAutoSlide() {
    if (certAutoSlideTimer) clearInterval(certAutoSlideTimer);
    certProgressPercent = 0;
    certAutoSlideTimer = setInterval(() => {
        if (!isCertPaused) {
            certProgressPercent += (certProgressTick / certSlideDuration) * 100;
            if (certProgressPercent >= 100) {
                certProgressPercent = 0;
                nextCertSlide();
            }
            if (certProgressBar) {
                certProgressBar.style.width = `${Math.min(100, certProgressPercent)}%`;
            }
        }
    }, certProgressTick);
}

// Mouse hover pause (Desktop Only) & Touch Safe (Mobile Only)
if (certViewport) {
    certViewport.addEventListener('mouseenter', () => {
        if (window.matchMedia('(pointer: fine)').matches) {
            pauseCertAutoSlide();
        }
    });
    certViewport.addEventListener('mouseleave', () => {
        resumeCertAutoSlide();
    });

    // Touch support di mobile: pause saat jari menyentuh, dan otomatis resume setelah sentuhan selesai!
    certViewport.addEventListener('touchstart', () => {
        pauseCertAutoSlide();
    }, { passive: true });

    certViewport.addEventListener('touchend', () => {
        resumeCertAutoSlide(2000); // Lanjutkan slide otomatis setelah 2 detik
    }, { passive: true });

    certViewport.addEventListener('touchcancel', () => {
        resumeCertAutoSlide(1000);
    }, { passive: true });
}

// Swipe Touch Gesture cerdas untuk Layar Mobile
let certTouchStartX = 0;
let certTouchStartY = 0;
let certTouchEndX = 0;
let certTouchEndY = 0;
if (certViewport) {
    certViewport.addEventListener('touchstart', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
            certTouchStartX = e.changedTouches[0].clientX;
            certTouchStartY = e.changedTouches[0].clientY;
        }
    }, { passive: true });

    certViewport.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
            certTouchEndX = e.changedTouches[0].clientX;
            certTouchEndY = e.changedTouches[0].clientY;
            const diffX = certTouchStartX - certTouchEndX;
            const diffY = certTouchStartY - certTouchEndY;

            // Hanya geser kartu jika gerakan horizontal dominan
            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    nextCertSlide();
                } else {
                    prevCertSlide();
                }
                if (typeof playThwipSound === 'function') playThwipSound();
            }
        }
    }, { passive: true });
}

// Resize Listener untuk Sertifikat
window.addEventListener('resize', () => {
    if (!certTrack) return;
    certTrack.style.transition = 'none';
    certTrack.style.transform = `translate3d(-${currentCertIndex * getCertCardStep()}px, 0, 0)`;
    certTrack.offsetHeight;
    certTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
});

// Pastikan posisi pas saat seluruh gambar selesai dimuat di mobile
window.addEventListener('load', () => {
    if (certTrack) {
        certTrack.style.transition = 'none';
        certTrack.style.transform = `translate3d(-${currentCertIndex * getCertCardStep()}px, 0, 0)`;
        certTrack.offsetHeight;
        certTrack.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
    }
});

// Resume saat tab browser kembali aktif
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        isCertTransitioning = false;
        resumeCertAutoSlide(500);
    } else {
        pauseCertAutoSlide();
    }
});

// Sertifikat Lightbox Modal Functions
const certLightbox = document.getElementById('cert-lightbox');
const certLightboxImg = document.getElementById('cert-lightbox-img');
const certLightboxTitle = document.getElementById('cert-lightbox-title');
const certLightboxSubtitle = document.getElementById('cert-lightbox-subtitle');
const certLightboxId = document.getElementById('cert-lightbox-id');

function openCertLightbox(target, title, subtitle, certId) {
    if (!certLightbox || !certLightboxImg) return;

    let src = '';

    // Otomatis sinkronisasi data langsung dari elemen kartu sertifikat (Tanpa kerja 2 kali!)
    if (target && typeof target === 'object' && target.nodeType) {
        const item = target.closest('.cert-carousel-item') || target;
        const img = item.querySelector('img');
        if (img) {
            src = img.getAttribute('src') || img.src;
        }
        const h4 = item.querySelector('h4');
        if (h4) {
            title = h4.innerText.trim();
        }
        const issuerEl = item.querySelector('p.font-semibold') || item.querySelector('h4 + p');
        const yearEl = item.querySelector('[data-lucide="calendar"]')?.closest('div')?.querySelector('span') ||
            item.querySelector('.aspect-\\[16\\/10\\] div:last-child span');
        const issuerText = issuerEl ? issuerEl.innerText.trim() : '';
        const yearText = yearEl ? yearEl.innerText.trim() : '';
        subtitle = (issuerText && yearText) ? `${issuerText} • ${yearText}` : (issuerText || yearText || 'Kredensial Terverifikasi');

        const idEl = item.querySelector('.font-mono') || item.querySelector('[data-cert-id]');
        if (idEl) {
            certId = idEl.innerText.trim().replace(/^ID:\s*/i, '');
        }
    } else if (typeof target === 'string') {
        src = target;
    }

    if (!src) return;

    certLightboxImg.src = src;
    if (certLightboxTitle) certLightboxTitle.textContent = title || 'Sertifikat';
    if (certLightboxSubtitle) certLightboxSubtitle.textContent = subtitle || 'Kredensial Terverifikasi';
    if (certLightboxId) certLightboxId.textContent = certId ? (certId.startsWith('ID:') ? certId : `ID: ${certId}`) : 'TERVERIFIKASI';

    certLightbox.classList.remove('opacity-0', 'pointer-events-none');
    certLightbox.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
    if (typeof playThwipSound === 'function') playThwipSound();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeCertLightbox() {
    if (!certLightbox) return;
    certLightbox.classList.remove('opacity-100', 'pointer-events-auto');
    certLightbox.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    if (window.__lenis) window.__lenis.start();
    if (typeof playThwipSound === 'function') playThwipSound();
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (certLightbox && certLightbox.classList.contains('opacity-100')) {
            closeCertLightbox();
        }
    }
});

// Inisialisasi Carousel Sertifikat
initInfiniteCertCarousel();
startCertAutoSlide();

// Interactive Mascot
const mascotEl = document.getElementById('spidey-mascot');
if (mascotEl) {
    mascotEl.addEventListener('click', () => {
        mascotEl.style.transform = 'translateY(20px) rotate(360deg)';
        mascotEl.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        if (typeof playThwipSound === 'function') playThwipSound();
        setTimeout(() => {
            mascotEl.style.transform = '';
            mascotEl.style.transition = '';
        }, 800);
    });
}

// ============================================================
// 11. DYNAMIC & RESPONSIVE SPOTIFY MUSIC ENGINE (HTML CODE CONFIGURATION)
// ============================================================
function parseSpotifyUrl(input) {
    if (!input || typeof input !== 'string') return null;
    let url = input.trim();

    const iframeSrcMatch = url.match(/src=["']([^"']+)["']/i);
    if (iframeSrcMatch) url = iframeSrcMatch[1];

    const uriMatch = url.match(/^spotify:(track|album|playlist|episode|show):([a-zA-Z0-9]+)/i);
    if (uriMatch) {
        const type = uriMatch[1].toLowerCase();
        const id = uriMatch[2];
        return {
            type: type,
            id: id,
            canonicalUrl: `https://open.spotify.com/${type}/${id}`,
            embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`
        };
    }

    const urlMatch = url.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(?:embed\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/i);
    if (urlMatch) {
        const type = urlMatch[1].toLowerCase();
        const id = urlMatch[2];
        return {
            type: type,
            id: id,
            canonicalUrl: `https://open.spotify.com/${type}/${id}`,
            embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`
        };
    }

    return null;
}

async function updateSpotifyTrack(inputUrl) {
    const parsed = parseSpotifyUrl(inputUrl);
    if (!parsed) return false;

    const iframe = document.getElementById('spotify-player-frame');
    const titleEl = document.getElementById('music-track-title');
    const subtitleEl = document.getElementById('music-track-subtitle');
    const badgeEl = document.getElementById('music-track-badge');
    const coverImg = document.getElementById('music-track-cover');

    // 1. Pastikan URL embed selalu valid di iframe agar lagu bisa diputar tanpa error X-Frame-Options
    if (iframe && iframe.src !== parsed.embedUrl) {
        iframe.src = parsed.embedUrl;
    }

    // Update badge sesuai tipe lagu/album/playlist
    const typeLabels = {
        track: 'LAGU PILIHAN',
        album: 'ALBUM FAVORIT',
        playlist: 'PLAYLIST PILIHAN',
        episode: 'PODCAST EPISODE',
        show: 'SPOTIFY SHOW'
    };
    if (badgeEl) {
        badgeEl.textContent = `NOW PLAYING • ${typeLabels[parsed.type] || 'SPOTIFY MUSIC'}`;
    }

    // 2. Ambil metadata resmi (judul, artis, gambar album) dari API resmi Spotify oEmbed
    try {
        const oEmbedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(parsed.canonicalUrl)}`;
        const response = await fetch(oEmbedUrl);
        if (response.ok) {
            const data = await response.json();
            if (data.title && titleEl) {
                titleEl.textContent = data.title;
            }
            if (data.thumbnail_url && coverImg) {
                coverImg.src = data.thumbnail_url;
            }
            if (subtitleEl) {
                const author = data.author_name ? `${data.author_name} • ` : '';
                subtitleEl.textContent = `${author}${parsed.type.toUpperCase()}`;
            }
            return true;
        }
    } catch (err) {
        console.warn('Spotify oEmbed fetch notice:', err);
    }

    // Fallback metadata jika sedang offline atau belum sempat oEmbed
    if (parsed.id === '5OwHXMsvDjpbI12ArCg6bX') {
        if (titleEl) titleEl.textContent = "Keroncong Si Endang Endong";
        if (subtitleEl) subtitleEl.textContent = "Dato' Sri Siti Nurhaliza • TRACK";
        if (coverImg) coverImg.src = "https://i.scdn.co/image/ab67616d0000b273b50c0001099e0df2dc362d2d";
    } else if (parsed.id === '3KkXRQHbMCARz0aVfEt68P') {
        if (titleEl) titleEl.textContent = "Sunflower - Spider-Man: Into the Spider-Verse";
        if (subtitleEl) subtitleEl.textContent = "Post Malone, Swae Lee • TRACK";
        if (coverImg) coverImg.src = "https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f";
    } else if (parsed.id === '0V3wPSX9ygBnKi89pHMHz9') {
        if (titleEl) titleEl.textContent = "Anti-Hero";
        if (subtitleEl) subtitleEl.textContent = "Taylor Swift • TRACK";
        if (coverImg) coverImg.src = "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5";
    } else if (parsed.id === '5AEDGbliTTfjOB8TSm1sxt') {
        if (titleEl) titleEl.textContent = "Taylor Swift — Speak Now (Taylor's Version)";
        if (subtitleEl) subtitleEl.textContent = "Taylor Swift • ALBUM";
        if (coverImg) coverImg.src = "https://i.scdn.co/image/ab67616d0000b2730b04da4f224b0c95da8ebab0";
    }

    // Sinkronisasi status visual kartu playlist
    syncActivePlaylistCard(inputUrl);

    return true;
}

// Fungsi Memutar Lagu dari Grid Playlist Pilihan
window.playTrackFromPlaylist = function (url, el) {
    if (typeof playSoundEffect === 'function') playSoundEffect('click');
    const iframe = document.getElementById('spotify-player-frame');
    if (iframe) {
        iframe.setAttribute('data-spotify-url', url);
    }
    updateSpotifyTrack(url);
};

// Sinkronisasi Kartu Aktif pada Grid Playlist
function syncActivePlaylistCard(url) {
    const parsed = parseSpotifyUrl(url);
    if (!parsed) return;
    const cards = document.querySelectorAll('.playlist-track-card');
    cards.forEach(card => {
        const cardUrl = card.getAttribute('data-track-url');
        const cardParsed = parseSpotifyUrl(cardUrl);
        const icon = card.querySelector('.track-indicator-icon');
        const iconWrapper = icon ? icon.closest('.rounded-full') : null;

        if (cardParsed && cardParsed.id === parsed.id) {
            card.classList.add('border-spidey-crimson', 'bg-red-500/10', 'active-track');
            card.classList.remove('border-red-200', 'dark:border-red-900/30', 'bg-slate-50', 'dark:bg-[#070d1a]');
            if (icon) icon.setAttribute('data-lucide', 'volume-2');
            if (iconWrapper) {
                iconWrapper.classList.remove('bg-slate-200', 'dark:bg-gray-800', 'text-slate-500', 'dark:text-gray-400');
                iconWrapper.classList.add('bg-red-100', 'dark:bg-red-950/80', 'text-spidey-crimson');
            }
        } else {
            card.classList.remove('border-spidey-crimson', 'bg-red-500/10', 'active-track');
            card.classList.add('border-red-200', 'dark:border-red-900/30', 'bg-slate-50', 'dark:bg-[#070d1a]');
            if (icon) icon.setAttribute('data-lucide', 'play');
            if (iconWrapper) {
                iconWrapper.classList.add('bg-slate-200', 'dark:bg-gray-800', 'text-slate-500', 'dark:text-gray-400');
                iconWrapper.classList.remove('bg-red-100', 'dark:bg-red-950/80', 'text-spidey-crimson');
            }
        }
    });
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

// Inisialisasi Player Musik dari Pengaturan di Code HTML
function initSpotifyMusicPlayer() {
    // Bersihkan sisa cache agar kode HTML selalu menjadi sumber utama yang berlaku
    if (typeof localStorage !== 'undefined') {
        try { localStorage.removeItem('saved_spotify_url'); } catch (e) { }
    }

    const iframe = document.getElementById('spotify-player-frame');
    let configuredUrl = 'https://open.spotify.com/track/5OwHXMsvDjpbI12ArCg6bX';

    if (iframe) {
        const dataUrl = iframe.getAttribute('data-spotify-url');
        const srcUrl = iframe.getAttribute('src');
        if (dataUrl && dataUrl.trim()) {
            configuredUrl = dataUrl.trim();
        } else if (srcUrl && srcUrl.trim()) {
            configuredUrl = srcUrl.trim();
        }
    }

    updateSpotifyTrack(configuredUrl);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotifyMusicPlayer);
} else {
    initSpotifyMusicPlayer();
}

// ============================================================
// 12. SPIDER-WEB BACKGROUND
//     Jaring berbasis fisika (verlet) yang merespon mouse, sentuhan,
//     tap/klik (riak gelombang), dan scroll. Responsif & ringan.
// ============================================================
(function spiderWebEngine() {
    const canvas = document.getElementById('spidey-3d-web-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const STEP = 1000 / 60;
    const SPOKES = 9;
    const RINGS = 11;
    const QUARTER = Math.PI / 2;

    const PAL = {
        dark: {
            red: { spoke: 'rgba(255,72,84,0.30)', ring: 'rgba(255,110,120,0.20)', dot: 'rgba(255,150,158,0.45)', hi: '255,90,100' },
            blue: { spoke: 'rgba(70,170,255,0.28)', ring: 'rgba(110,190,255,0.18)', dot: 'rgba(150,210,255,0.42)', hi: '90,180,255' }
        },
        light: {
            red: { spoke: 'rgba(190,18,36,0.26)', ring: 'rgba(190,18,36,0.17)', dot: 'rgba(190,18,36,0.34)', hi: '200,20,40' },
            blue: { spoke: 'rgba(3,105,190,0.24)', ring: 'rgba(3,105,190,0.16)', dot: 'rgba(3,105,190,0.32)', hi: '3,105,190' }
        }
    };

    let W = 0, H = 0, DPR = 1;
    let webs = [];
    const waves = [];
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false, touch: false };
    let lastTouchAt = 0;
    let scrollImpulse = 0;
    let lastScrollY = window.scrollY || 0;
    let acc = 0;
    let lastFrame = performance.now();
    let clock = 0;

    function webConfigs() {
        const small = W < 640;
        const big = Math.max(W, H);
        const R = Math.min(big * (small ? 0.85 : 0.62), small ? 520 : 900);
        const list = [
            { cx: 0, cy: 0, a0: 0, R: R, tone: 'red' },
            { cx: W, cy: H, a0: Math.PI, R: R, tone: 'red' }
        ];
        if (!small) list.push({ cx: W, cy: 0, a0: QUARTER, R: R * 0.62, tone: 'blue' });
        return list;
    }

    function nodeHome(cfg, s, r) {
        const ang = cfg.a0 + (s / SPOKES) * QUARTER;
        const rad = cfg.R * Math.pow(r / RINGS, 1.3);
        return { x: cfg.cx + Math.cos(ang) * rad, y: cfg.cy + Math.sin(ang) * rad };
    }

    function measureLinks(web) {
        for (const l of web.links) l.len = Math.hypot(l.a.hx - l.b.hx, l.a.hy - l.b.hy);
    }

    function buildWeb(cfg) {
        const nodes = [];
        for (let s = 0; s <= SPOKES; s++) {
            const col = [];
            for (let r = 0; r <= RINGS; r++) {
                const p = nodeHome(cfg, s, r);
                col.push({
                    x: p.x, y: p.y, ox: p.x, oy: p.y, hx: p.x, hy: p.y,
                    pin: r === 0 || r === RINGS,
                    ph: Math.random() * 6.283,
                    w: r / RINGS
                });
            }
            nodes.push(col);
        }
        const links = [];
        for (let s = 0; s <= SPOKES; s++) {
            for (let r = 1; r <= RINGS; r++) links.push({ a: nodes[s][r - 1], b: nodes[s][r], len: 0 });
        }
        for (let s = 0; s < SPOKES; s++) {
            for (let r = 1; r < RINGS; r++) links.push({ a: nodes[s][r], b: nodes[s + 1][r], len: 0 });
        }
        const web = { cfg: cfg, nodes: nodes, links: links };
        measureLinks(web);
        return web;
    }

    // Saat ukuran berubah, jaring digeser (bukan dibuat ulang) agar tidak "reset" di mobile
    function relayout() {
        const cfgs = webConfigs();
        if (cfgs.length !== webs.length) { webs = cfgs.map(buildWeb); return; }
        webs.forEach(function (web, i) {
            web.cfg = cfgs[i];
            for (let s = 0; s <= SPOKES; s++) {
                for (let r = 0; r <= RINGS; r++) {
                    const n = web.nodes[s][r];
                    const p = nodeHome(cfgs[i], s, r);
                    const dx = p.x - n.hx, dy = p.y - n.hy;
                    n.x += dx; n.y += dy; n.ox += dx; n.oy += dy;
                    n.hx = p.x; n.hy = p.y;
                }
            }
            measureLinks(web);
        });
    }

    function resize() {
        const nw = window.innerWidth;
        let nh = window.innerHeight;
        const ndpr = Math.min(window.devicePixelRatio || 1, 2);
        // Abaikan perubahan tinggi kecil akibat address-bar mobile saat scroll
        if (nw === W && H && Math.abs(nh - H) < 160) nh = Math.max(nh, H);
        if (nw === W && nh === H && ndpr === DPR) return;
        W = nw; H = nh; DPR = ndpr;
        canvas.width = Math.round(W * DPR);
        canvas.height = Math.round(H * DPR);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        if (!webs.length) webs = webConfigs().map(buildWeb);
        else relayout();
    }

    function step() {
        clock += STEP / 1000;
        const interactive = !reduceMotion;
        const infl = pointer.touch ? 150 : 130;
        const infl2 = infl * infl;
        const breeze = reduceMotion ? 0 : 0.045;
        const sImp = interactive ? scrollImpulse : 0;

        for (let i = waves.length - 1; i >= 0; i--) {
            waves[i].r += 7;
            waves[i].life -= 0.02;
            if (waves[i].life <= 0) waves.splice(i, 1);
        }

        for (const web of webs) {
            for (const col of web.nodes) {
                for (const n of col) {
                    if (n.pin) continue;
                    const vx = (n.x - n.ox) * 0.93;
                    const vy = (n.y - n.oy) * 0.93;
                    n.ox = n.x; n.oy = n.y;
                    const k = 0.4 + n.w;
                    n.x += vx + Math.sin(clock * 0.8 + n.ph) * breeze * k + (n.hx - n.x) * 0.028;
                    n.y += vy + Math.cos(clock * 0.65 + n.ph * 1.3) * breeze * k + (n.hy - n.y) * 0.028;

                    if (sImp) {
                        n.oy -= sImp * 0.5 * k;
                        n.ox += Math.sin(n.ph) * sImp * 0.12;
                    }

                    if (interactive && pointer.active) {
                        const dx = n.x - pointer.x, dy = n.y - pointer.y;
                        const d2 = dx * dx + dy * dy;
                        if (d2 < infl2 && d2 > 0.01) {
                            const d = Math.sqrt(d2);
                            const f = 1 - d / infl;
                            const kk = f * f;
                            n.x += (dx / d) * kk * 2.4 + pointer.vx * kk * 0.10;
                            n.y += (dy / d) * kk * 2.4 + pointer.vy * kk * 0.10;
                        }
                    }

                    if (interactive) {
                        for (const wv of waves) {
                            const dx = n.x - wv.x, dy = n.y - wv.y;
                            const d = Math.sqrt(dx * dx + dy * dy) || 1;
                            const band = Math.abs(d - wv.r);
                            if (band < 36) {
                                const f = (1 - band / 36) * wv.life * 4.2;
                                n.x += (dx / d) * f;
                                n.y += (dy / d) * f;
                            }
                        }
                    }
                }
            }
        }

        scrollImpulse *= 0.84;
        if (Math.abs(scrollImpulse) < 0.01) scrollImpulse = 0;
        pointer.vx *= 0.8;
        pointer.vy *= 0.8;

        // Jaga panjang tiap helai benang
        for (let it = 0; it < 2; it++) {
            for (const web of webs) {
                for (const l of web.links) {
                    const a = l.a, b = l.b;
                    const dx = b.x - a.x, dy = b.y - a.y;
                    const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                    const diff = (d - l.len) / d * 0.45;
                    const wa = a.pin ? 0 : 1, wb = b.pin ? 0 : 1;
                    const tw = wa + wb;
                    if (!tw) continue;
                    a.x += dx * diff * wa / tw; a.y += dy * diff * wa / tw;
                    b.x -= dx * diff * wb / tw; b.y -= dy * diff * wb / tw;
                }
            }
        }
    }

    function draw() {
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.clearRect(0, 0, W, H);
        const dark = document.documentElement.classList.contains('dark');
        const pal = dark ? PAL.dark : PAL.light;
        ctx.globalAlpha = W < 640 ? 0.85 : 1;
        ctx.lineJoin = 'round';

        for (const web of webs) {
            const c = pal[web.cfg.tone];

            // Benang jari-jari
            ctx.lineWidth = 1;
            ctx.strokeStyle = c.spoke;
            ctx.beginPath();
            for (const col of web.nodes) {
                ctx.moveTo(col[0].x, col[0].y);
                for (let r = 1; r <= RINGS; r++) ctx.lineTo(col[r].x, col[r].y);
            }
            ctx.stroke();

            // Benang melingkar (sedikit melengkung ke dalam seperti jaring asli)
            ctx.strokeStyle = c.ring;
            ctx.beginPath();
            for (let r = 1; r <= RINGS; r++) {
                for (let s = 0; s < SPOKES; s++) {
                    const a = web.nodes[s][r], b = web.nodes[s + 1][r];
                    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
                    const chord = Math.hypot(b.x - a.x, b.y - a.y);
                    const tx = web.cfg.cx - mx, ty = web.cfg.cy - my;
                    const td = Math.hypot(tx, ty) || 1;
                    ctx.moveTo(a.x, a.y);
                    ctx.quadraticCurveTo(mx + (tx / td) * chord * 0.28, my + (ty / td) * chord * 0.28, b.x, b.y);
                }
            }
            ctx.stroke();

            // Titik embun di persimpangan
            ctx.fillStyle = c.dot;
            ctx.beginPath();
            for (let s = 0; s <= SPOKES; s++) {
                for (let r = 1; r < RINGS; r++) {
                    const n = web.nodes[s][r];
                    ctx.moveTo(n.x + 1.4, n.y);
                    ctx.arc(n.x, n.y, 1.4, 0, 6.2832);
                }
            }
            ctx.fill();
        }

        // Riak gelombang saat tap / klik
        for (const wv of waves) {
            ctx.beginPath();
            ctx.arc(wv.x, wv.y, wv.r, 0, 6.2832);
            ctx.strokeStyle = 'rgba(' + pal.red.hi + ',' + (wv.life * 0.35).toFixed(3) + ')';
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }

        // Benang yang "menempel" ke kursor / jari
        if (pointer.active && !reduceMotion) {
            const hi = pal.red.hi;
            const lim = pointer.touch ? 120 : 105;
            ctx.lineWidth = 1;
            for (const web of webs) {
                for (const col of web.nodes) {
                    for (const n of col) {
                        if (n.pin) continue;
                        const dx = n.x - pointer.x, dy = n.y - pointer.y;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < lim) {
                            const f = 1 - d / lim;
                            ctx.strokeStyle = 'rgba(' + hi + ',' + (f * 0.55).toFixed(3) + ')';
                            ctx.beginPath();
                            ctx.moveTo(pointer.x, pointer.y);
                            ctx.lineTo(n.x, n.y);
                            ctx.stroke();
                            ctx.fillStyle = 'rgba(' + hi + ',' + (f * 0.8).toFixed(3) + ')';
                            ctx.beginPath();
                            ctx.arc(n.x, n.y, 1.6 + f * 1.8, 0, 6.2832);
                            ctx.fill();
                        }
                    }
                }
            }
            const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 60);
            g.addColorStop(0, 'rgba(' + hi + ',0.12)');
            g.addColorStop(1, 'rgba(' + hi + ',0)');
            ctx.fillStyle = g;
            ctx.fillRect(pointer.x - 60, pointer.y - 60, 120, 120);
        }
        ctx.globalAlpha = 1;
    }

    function frame(now) {
        requestAnimationFrame(frame);
        let dt = now - lastFrame;
        lastFrame = now;
        if (!(dt > 0) || dt > 100) dt = STEP;
        acc += dt;
        let steps = 0;
        while (acc >= STEP && steps < 3) { step(); acc -= STEP; steps++; }
        if (steps === 3) acc = 0;
        draw();
    }

    // ---------- Input: mouse, sentuhan, tap, scroll ----------
    function movePointer(x, y, touch) {
        if (pointer.active) { pointer.vx = x - pointer.x; pointer.vy = y - pointer.y; }
        else { pointer.vx = 0; pointer.vy = 0; }
        pointer.x = x; pointer.y = y; pointer.active = true; pointer.touch = touch;
    }
    function releasePointer() { pointer.active = false; }

    window.addEventListener('mousemove', function (e) {
        if (Date.now() - lastTouchAt < 700) return; // abaikan mouse emulasi setelah sentuhan
        movePointer(e.clientX, e.clientY, false);
    }, { passive: true });
    function onTouch(e) {
        lastTouchAt = Date.now();
        const t = e.touches && e.touches[0];
        if (t) movePointer(t.clientX, t.clientY, true);
    }
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', function () { lastTouchAt = Date.now(); releasePointer(); }, { passive: true });
    window.addEventListener('touchcancel', function () { lastTouchAt = Date.now(); releasePointer(); }, { passive: true });
    document.documentElement.addEventListener('mouseleave', releasePointer);
    window.addEventListener('blur', releasePointer);

    window.addEventListener('pointerdown', function (e) {
        if (reduceMotion) return;
        waves.push({ x: e.clientX, y: e.clientY, r: 6, life: 1 });
        if (waves.length > 6) waves.shift();
    }, { passive: true });

    window.addEventListener('scroll', function () {
        const y = window.scrollY || 0;
        const d = y - lastScrollY;
        lastScrollY = y;
        scrollImpulse += Math.max(-30, Math.min(30, d)) * 0.12;
        scrollImpulse = Math.max(-6, Math.min(6, scrollImpulse));
    }, { passive: true });

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', function () { setTimeout(resize, 250); });

    resize();
    lastFrame = performance.now();
    requestAnimationFrame(frame);
})();

// ============================================================
// 13. NAVBAR: tandai menu aktif sesuai posisi scroll
// ============================================================
(function navScrollSpy() {
    const links = Array.prototype.slice.call(document.querySelectorAll('header nav a.nav-link'));
    if (!links.length) return;
    const sections = links
        .map(function (a) { return document.getElementById((a.getAttribute('href') || '').slice(1)); })
        .filter(Boolean);
    function update() {
        const y = window.scrollY + 140;
        let current = null;
        sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
        links.forEach(function (a) { a.classList.toggle('active-link', a.getAttribute('href') === '#' + current); });
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
