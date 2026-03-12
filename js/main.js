document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 3. Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Trigger initial load animations
    setTimeout(() => {
        const heroContent = document.querySelector('.animate-on-load');
        if(heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 100);

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active state in nav
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }
            }
        });
    });

    // 5. Active Link Switching on Scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navbar.offsetHeight - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    // 6. Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    // Lower inc to slow and higher to speed up
                    const inc = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        animateCounters.observe(counter);
    });

    // 7. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';
            submitBtn.disabled = true;

            const scriptURL = 'https://script.google.com/macros/s/AKfycbyLrlMC9XgYXqY4z21rXQ-1HtR7dXKeCGYcQESjE1STv6_BHRZu1WwnJlF8RlUNjEK7oA/exec';
            const formData = new FormData(contactForm);
            
            // Build expansive payload mapping all common Google Sheet header styles
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value; // Default e.g., firstName
                
                // Add variants to ensure the script maps it to the user's Sheet columns
                if(key === 'firstName') { data['First Name'] = value; data['first_name'] = value; data['Name'] = value; }
                if(key === 'lastName') { data['Last Name'] = value; data['last_name'] = value; }
                if(key === 'email') { data['Email Address'] = value; data['Email'] = value; }
                if(key === 'phone') { data['Phone Number'] = value; data['Phone'] = value; }
                if(key === 'company') { data['Company'] = value; }
                if(key === 'requirements') { data['Project Requirements'] = value; data['Requirements'] = value; data['Message'] = value; }
            }
            data['Timestamp'] = new Date().toISOString();
            
            fetch(scriptURL, { 
                method: 'POST', 
                body: JSON.stringify(data), 
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
                .then(response => {
                    // With no-cors, we can't read the exact response, assume success if it resolves
                    alert('Thank you for contacting nexflowops technologies pvt ltd, our team will contact you soon');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Oops! Something went wrong. Please try again later.');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
