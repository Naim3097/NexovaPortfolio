/**
 * NEXOVA PORTFOLIO - MOTION SYSTEM IMPLEMENTATION
 * Adheres to timings and physics defined in MOTION_SYSTEM.md
 */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------
// Core Variables & Timings (from Motion System)
// ----------------------------------------------------
const MOTION = {
    majorReveal: 1.46,
    snapBack: 0.88,
    staggerDelay: 0.18,
    easeMajor: "power4.out",
    easeSnap: "expo.out"
};

// ----------------------------------------------------
// 1. Initial Page Load (Hero Reveal)
// ----------------------------------------------------
const initHero = () => {
    const tl = gsap.timeline({
        defaults: {
            duration: MOTION.majorReveal,
            ease: MOTION.easeMajor
        }
    });

    // Animate Navbar
    tl.to(".navbar .reveal-text", {
        y: "0%",
        stagger: 0.1,
        // Start sooner
    }, 0.2);

    // Animate Hero Content
    tl.to(".hero-section .reveal-text", {
        y: "0%",
        stagger: MOTION.staggerDelay
    }, 0);
};

// ----------------------------------------------------
// 2. Scroll-Triggered Section Reveals
// ----------------------------------------------------
const initScrollReveals = () => {
    // We select all elements that need to reveal on scroll
    const sections = gsap.utils.toArray(['.about-section', '.services-section', '.clients-section', '.website-showcase-section', '.social-widget-section', '.closing-section']);

    sections.forEach(section => {
        const reveals = section.querySelectorAll('.reveal-text');
        
        if (reveals.length > 0) {
            ScrollTrigger.create({
                trigger: section,
                start: "top 85%", // Trigger right before it reaches the viewport center
                onEnter: () => {
                    gsap.to(reveals, {
                        y: "0%",
                        duration: MOTION.majorReveal,
                        ease: MOTION.easeMajor,
                        stagger: MOTION.staggerDelay
                    });
                },
                once: true // Animate only once like a premium site
            });
        }
    });

    // Image Reveal Logic for 'reveal-image' class
    const imageWrappers = gsap.utils.toArray('.about-image-wrapper');
    imageWrappers.forEach(wrapper => {
        const img = wrapper.querySelector('.reveal-image');
        gsap.set(img, { yPercent: 100 }); // Setup mask

        ScrollTrigger.create({
            trigger: wrapper,
            start: "top 80%",
            onEnter: () => {
                gsap.to(img, {
                    yPercent: 0,
                    duration: MOTION.majorReveal,
                    ease: MOTION.easeMajor
                });
                
                // Scale inner image down from 1.1 to 1 for parallax feel
                gsap.to(img.querySelector('img'), {
                    scale: 1,
                    duration: MOTION.majorReveal,
                    ease: MOTION.easeMajor
                });
            },
            once: true
        });
    });
};

// ----------------------------------------------------
// 2.5 Services Image Interaction
// ----------------------------------------------------
const initServicesInteraction = () => {
    const serviceItems = document.querySelectorAll('.service-item');
    const activeImage = document.getElementById('active-service-img');
    const visualWrapper = document.querySelector('.services-visual');

    if (!activeImage || !serviceItems.length) return;

    // Fade reveal the image wrapper initial state
    gsap.set(visualWrapper, { autoAlpha: 0, y: 50 });
    ScrollTrigger.create({
        trigger: ".services-section",
        start: "top 70%",
        onEnter: () => {
            gsap.to(visualWrapper, { autoAlpha: 1, y: 0, duration: MOTION.majorReveal, ease: MOTION.easeMajor });
        },
        once: true
    });

    // Handle Hover changes
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const newImgSrc = item.getAttribute('data-img');
            
            // If it's already the same image, skip
            if (activeImage.getAttribute('src') === newImgSrc) return;

            // Premium Transition: Fade out and scale slightly, then swap image and fade in
            const tl = gsap.timeline();
            tl.to(activeImage, {
                autoAlpha: 0,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    activeImage.src = newImgSrc;
                }
            }).to(activeImage, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.6,
                ease: MOTION.easeMajor
            });
        });
    });
};

// ----------------------------------------------------
// 3. Marquee Scroll (Industries Section)
// ----------------------------------------------------
const initMarquee = () => {
    const marquee = document.querySelector('.industries-marquee h2');
    
    // First, reveal it
    ScrollTrigger.create({
        trigger: ".industries-section",
        start: "top 80%",
        onEnter: () => {
            gsap.to(marquee, {
                y: "0%",
                duration: MOTION.majorReveal,
                ease: MOTION.easeMajor
            });
        },
        once: true
    });

    // Then, link horizontal position to vertical scroll
    gsap.to(marquee, {
        xPercent: -30, // move left
        ease: "none",
        scrollTrigger: {
            trigger: ".industries-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
};

// ----------------------------------------------------
// 4. Magnetic Buttons Plugin
// ----------------------------------------------------
const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach((btn) => {
        // Move slightly when mouse moves over it
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate distance from center
            const x = (e.clientX - rect.left) - (rect.width / 2);
            const y = (e.clientY - rect.top) - (rect.height / 2);

            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        // Snap back when mouse leaves
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: MOTION.snapBack,
                ease: MOTION.easeSnap
            });
        });
    });
};

// ----------------------------------------------------
// Initialize All Behaviors
// ----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    // By default, CSS has `reveal-text` transformed at Y: 110%.
    // Timeouts or delays can be added here if a loading screen is present.
    
    // Start interactions
    initHero();
    initScrollReveals();
    initMarquee();
    initMagneticButtons();
});