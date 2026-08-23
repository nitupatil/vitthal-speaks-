document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Change icon based on state
        const icon = navMenu.classList.contains('active') ? 'x' : 'menu';
        hamburger.innerHTML = `<i data-lucide="${icon}"></i>`;
        lucide.createIcons();
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = `<i data-lucide="menu"></i>`;
            lucide.createIcons();
        });
    });

    // 3. Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
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
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 5. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 6. OneSignal Safe Notification Integration
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function(OneSignal) {
        try {
            const notifBtn = document.getElementById('onesignal-btn');
            if (!notifBtn) return;

            // Function to update the button UI based on current permission state
            const updateButtonState = async () => {
                const permission = await OneSignal.Notifications.permission;
                
                if (permission === 'granted') {
                    notifBtn.innerHTML = '✓ सूचना सुरू आहेत';
                    notifBtn.classList.add('subscribed');
                    notifBtn.disabled = true;
                } else if (permission === 'denied') {
                    notifBtn.innerHTML = 'सूचना बंद आहेत';
                    notifBtn.disabled = true;
                } else {
                    notifBtn.innerHTML = '🔔 सूचना सुरू करा';
                    notifBtn.classList.remove('subscribed');
                    notifBtn.disabled = false;
                }
            };

            // Initial check
            await updateButtonState();

            // Listen for changes from outside
            OneSignal.Notifications.addEventListener('permissionChange', updateButtonState);

            // Handle button click safely
            notifBtn.addEventListener('click', async () => {
                try {
                    if (typeof OneSignal.Notifications.requestPermission === 'function') {
                        await OneSignal.Notifications.requestPermission();
                        await updateButtonState();
                    }
                } catch (err) {
                    console.error("OneSignal permission request error handled securely.", err);
                }
            });

        } catch (e) {
            console.error("OneSignal setup error safely caught to prevent page breakage.", e);
        }
    });

});
