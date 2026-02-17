/* ═══════════════════════════════════════════════════════
   Auflösung24.de – JavaScript
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Navbar Scroll Effect ───
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ─── Mobile Navigation ───
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ─── FAQ Accordion ───
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ─── Scroll Reveal Animation ───
    const revealElements = document.querySelectorAll(
        '.why-card, .review-card, .service-card, .service-featured, .value-credit, ' +
        '.process-step, .faq-item, .repeat-inner, .coverage-detail, .city-tag, ' +
        '.contact-form, .contact-card, .partner-logo'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 6) * 0.08}s`;
        revealObserver.observe(el);
    });

    // ─── Smooth Scroll for anchor links ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── Contact Form (basic) ───
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.textContent = 'Wird gesendet...';
        btn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            btn.textContent = 'Anfrage gesendet ✓';
            btn.style.background = '#22c55e';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1500);
    });

    // ─── Active nav link highlight ───
    const sections = document.querySelectorAll('section[id]');
    const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinkItems.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--accent)';
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ─── Leaflet Map – Einsatzgebiet ───
    const mapEl = document.getElementById('coverageMap');
    if (mapEl && typeof L !== 'undefined') {
        // Dark tile layer (CartoDB Dark Matter)
        const darkTiles = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }
        );

        const map = L.map('coverageMap', {
            center: [51.35, 7.2],
            zoom: 8,
            layers: [darkTiles],
            scrollWheelZoom: false,
            zoomControl: true
        });

        // Custom accent-colored marker
        const accentIcon = L.divIcon({
            className: 'map-marker',
            html: '<div class="map-marker-dot"></div><div class="map-marker-ring"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -14]
        });

        const hqIcon = L.divIcon({
            className: 'map-marker map-marker-hq',
            html: '<div class="map-marker-dot"></div><div class="map-marker-ring"></div><div class="map-marker-pulse"></div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -16]
        });

        // Cities with coordinates
        const cities = [
            { name: 'Krefeld', lat: 51.3388, lng: 6.5853, hq: true, desc: 'Unser Standort' },
            { name: 'Düsseldorf', lat: 51.2277, lng: 6.7735, desc: 'Landeshauptstadt NRW' },
            { name: 'Köln', lat: 50.9375, lng: 6.9603, desc: 'Domstadt am Rhein' },
            { name: 'Essen', lat: 51.4556, lng: 7.0116, desc: 'Herz des Ruhrgebiets' },
            { name: 'Dortmund', lat: 51.5136, lng: 7.4653, desc: 'Östliches Ruhrgebiet' },
            { name: 'Duisburg', lat: 51.4344, lng: 6.7624, desc: 'Größter Binnenhafen' },
            { name: 'Bonn', lat: 50.7374, lng: 7.0982, desc: 'Bundesstadt am Rhein' },
            { name: 'Mönchengladbach', lat: 51.1805, lng: 6.4428, desc: 'Niederrhein' },
            { name: 'Wuppertal', lat: 51.2562, lng: 7.1508, desc: 'Bergisches Land' },
            { name: 'Bochum', lat: 51.4818, lng: 7.2162, desc: 'Mittleres Ruhrgebiet' },
            { name: 'Gelsenkirchen', lat: 51.5178, lng: 7.0857, desc: 'Nördl. Ruhrgebiet' },
            { name: 'Münster', lat: 51.9607, lng: 7.6261, desc: 'Münsterland' },
            { name: 'Aachen', lat: 50.7753, lng: 6.0839, desc: 'Dreiländereck' },
            { name: 'Bielefeld', lat: 52.0302, lng: 8.5325, desc: 'Ostwestfalen' },
            { name: 'Oberhausen', lat: 51.4700, lng: 6.8517, desc: 'Westl. Ruhrgebiet' },
        ];

        cities.forEach(city => {
            const icon = city.hq ? hqIcon : accentIcon;
            const label = city.hq
                ? `<strong>📍 ${city.name}</strong><br/>${city.desc}`
                : `<strong>${city.name}</strong><br/>${city.desc}`;
            L.marker([city.lat, city.lng], { icon })
                .addTo(map)
                .bindPopup(label);
        });

        // Open HQ popup by default
        const hq = cities.find(c => c.hq);
        if (hq) {
            const hqMarker = L.marker([hq.lat, hq.lng], { icon: hqIcon })
                .addTo(map)
                .bindPopup(`<strong>📍 ${hq.name}</strong><br/>${hq.desc}`)
                .openPopup();
        }

        // Enable scroll zoom on click
        map.on('click', () => map.scrollWheelZoom.enable());
        map.on('mouseout', () => map.scrollWheelZoom.disable());
    }

});
