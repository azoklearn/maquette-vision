// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('Hamburger:', hamburger);
    console.log('NavMenu:', navMenu);
    
    if (hamburger && navMenu) {
        // Toggle menu function
        const toggleMenu = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            console.log('Toggle menu clicked');
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                console.log('Menu closed');
            } else {
                navMenu.classList.add('active');
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
                console.log('Menu opened');
            }
        };
        
        // Add multiple event listeners for better compatibility
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('touchend', (e) => {
            e.preventDefault();
            toggleMenu(e);
        });
        
        // Make sure hamburger is clickable
        hamburger.style.pointerEvents = 'auto';
        hamburger.style.cursor = 'pointer';

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside (with delay to avoid immediate close)
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }, 10);
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    } else {
        console.error('Hamburger or navMenu not found!');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Adjust offset for mobile
            const isMobile = window.innerWidth <= 768;
            const offsetTop = target.offsetTop - (isMobile ? 70 : 90);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll - removed to keep navbar transparent

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.service-card, .portfolio-item, .about-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Navbar hide/show and hero text show on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
const heroText = document.querySelector('.hero-text');
const heroSection = document.querySelector('.hero');

// Throttle scroll events for better performance on mobile
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            const isMobile = window.innerWidth <= 768;
            
            // Navbar behavior - less aggressive on mobile
            if (scrolled > (isMobile ? 50 : 100)) {
                if (scrolled > lastScroll) {
                    // Scrolling down
                    navbar.classList.add('hidden');
                } else {
                    // Scrolling up
                    navbar.classList.remove('hidden');
                }
            } else {
                // At top, show navbar
                navbar.classList.remove('hidden');
            }
            
            // Keep hero text visible at all times
            if (heroText) {
                heroText.classList.add('visible');
            }
            
            
            lastScroll = scrolled;
            
            // Parallax effect for hero section - reduced on mobile
            const heroVideoContainer = document.querySelector('.hero-video');
            if (heroVideoContainer && !isMobile) {
                heroVideoContainer.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Click to open lightbox for portfolio images
const portfolioImages = document.querySelectorAll('.portfolio-image');
portfolioImages.forEach((portfolioImage) => {
    if (portfolioImage) {
        portfolioImage.addEventListener('click', () => {
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightbox-image');
            if (lightbox && lightboxImage) {
                lightboxImage.src = portfolioImage.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
});

// Video in portfolio - play in lightbox
const portfolioVideoItem = document.querySelector('.portfolio-video-item');
const portfolioVideoThumbnail = document.querySelector('.portfolio-video-thumbnail');

if (portfolioVideoItem && portfolioVideoThumbnail) {
    // Auto-play thumbnail video
    portfolioVideoThumbnail.play();
    
    // Click to open video in lightbox
    portfolioVideoItem.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightbox && lightboxImage) {
            // Replace image with video
            const video = document.createElement('video');
            video.src = 'video.mp4';
            video.autoplay = true;
            video.muted = false;
            video.loop = true;
            video.className = 'lightbox-image';
            video.style.maxWidth = '90%';
            video.style.maxHeight = '90%';
            
            // Clear existing content and add video
            lightbox.innerHTML = '<span class="lightbox-close">&times;</span>';
            lightbox.appendChild(video);
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
}

// Lightbox controls
const lightbox = document.getElementById('lightbox');

function closeLightbox() {
    if (lightbox) {
        // Stop video if playing
        const video = lightbox.querySelector('video');
        if (video) {
            video.pause();
            video.remove();
        }
        
        // Restore original structure
        lightbox.innerHTML = '<span class="lightbox-close">&times;</span><img class="lightbox-image" id="lightbox-image" src="" alt="Portfolio">';
        
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (lightbox) {
    // Use event delegation for close button
    lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-close')) {
            e.stopPropagation();
            closeLightbox();
        } else if (e.target === lightbox) {
            // Click on background
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Force hero video to play continuously - execute immediately
(function() {
    const heroVideo = document.getElementById('hero-video');
    if (!heroVideo) return;
    
    // Remove controls completely
    heroVideo.removeAttribute('controls');
    heroVideo.controls = false;
    heroVideo.setAttribute('controls', 'false');
    
    // Ensure video is muted for autoplay
    heroVideo.muted = true;
    heroVideo.volume = 0;
    heroVideo.setAttribute('muted', 'muted');
    
    // Set video properties
    heroVideo.setAttribute('autoplay', 'autoplay');
    heroVideo.setAttribute('loop', 'loop');
    heroVideo.setAttribute('playsinline', 'playsinline');
    heroVideo.setAttribute('preload', 'auto');
    
    // Function to force play
    const forcePlay = () => {
        if (heroVideo.paused || heroVideo.ended) {
            heroVideo.play()
                .then(() => {
                    console.log('Video playing');
                })
                .catch((err) => {
                    console.log('Play failed, retrying...', err);
                    setTimeout(forcePlay, 500);
                });
        }
    };
    
    // Try to play immediately
    forcePlay();
    
    // Try when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forcePlay);
    }
    
    // Try when window loads
    window.addEventListener('load', forcePlay);
    
    // Try on various video events
    heroVideo.addEventListener('loadedmetadata', forcePlay);
    heroVideo.addEventListener('loadeddata', forcePlay);
    heroVideo.addEventListener('canplay', forcePlay);
    heroVideo.addEventListener('canplaythrough', forcePlay);
    
    // Keep video playing
    heroVideo.addEventListener('pause', () => {
        if (!heroVideo.ended) {
            setTimeout(forcePlay, 100);
        }
    });
    
    heroVideo.addEventListener('ended', () => {
        heroVideo.currentTime = 0;
        forcePlay();
    });
    
    // Force play on any user interaction
    const userInteractionPlay = () => {
        forcePlay();
    };
    
    document.addEventListener('click', userInteractionPlay, { once: true });
    document.addEventListener('touchstart', userInteractionPlay, { once: true });
    document.addEventListener('mousedown', userInteractionPlay, { once: true });
    document.addEventListener('keydown', userInteractionPlay, { once: true });
    
    // Aggressive retry - try every 500ms
    let attempts = 0;
    const aggressiveInterval = setInterval(() => {
        if (heroVideo.paused && !heroVideo.ended) {
            forcePlay();
            attempts++;
            if (attempts > 20) {
                clearInterval(aggressiveInterval);
            }
        } else if (!heroVideo.paused) {
            clearInterval(aggressiveInterval);
        }
    }, 500);
    
    // Fallback: try after 2 seconds
    setTimeout(forcePlay, 2000);
})();


// Video play/pause on scroll
const video = document.querySelector('.portfolio-video');
if (video) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Video is visible, but don't autoplay (respects user preferences)
            } else {
                // Pause video when not visible
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.5 });

    videoObserver.observe(video);
}

