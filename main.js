/**
 * URBANWAYS - OPTIMIZED JAVASCRIPT
 * Version: 2.1
 * Author: Urbanways Team
 * Last Updated: 2025
 */

'use strict';

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function to limit function calls
 */
const debounce = (func, wait) => {
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

/**
 * Throttle function to limit function execution rate
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===================================
// LOADING SCREEN
// ===================================

class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById('loadingScreen');
    this.init();
  }

  init() {
    // Hide loading screen after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hide();
      }, 500);
    });

    // Fallback: Hide after max 3 seconds
    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
      // Remove from DOM after animation
      setTimeout(() => {
        this.loadingScreen.remove();
      }, 500);
    }
  }
}

// ===================================
// HEADER SCROLL EFFECT
// ===================================

class HeaderScroll {
  constructor() {
    this.header = document.getElementById('header');
    this.scrollThreshold = 50;
    this.init();
  }

  init() {
    if (!this.header) return;

    // Use throttled scroll handler for better performance
    window.addEventListener('scroll', throttle(() => {
      this.handleScroll();
    }, 100));

    // Check on load
    this.handleScroll();
  }

  handleScroll() {
    // Use requestAnimationFrame to avoid forced reflow
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollY > this.scrollThreshold) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    });
  }
}

// ===================================
// HAMBURGER MENU
// ===================================

class HamburgerMenu {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.mobileNav = document.querySelector('.mobile-nav');
    this.overlay = document.querySelector('.mobile-nav-overlay');
    this.body = document.body;
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link:not(.nav-link-dropdown)');
    
    if (this.hamburger && this.mobileNav && this.overlay) {
      this.init();
    }
  }

  init() {
    // Hamburger button click
    this.hamburger.addEventListener('click', () => this.toggleMenu());
    
    // Overlay click to close
    this.overlay.addEventListener('click', () => this.closeMenu());
    
    // Close menu when clicking nav links (but not dropdown toggle)
    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
    
    // Close menu when clicking submenu links
    const submenuLinks = document.querySelectorAll('.mobile-nav .submenu-link');
    submenuLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen()) {
        this.closeMenu();
      }
    });
    
    // Close menu on window resize if window becomes larger
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 768 && this.isMenuOpen()) {
        this.closeMenu();
      }
    }, 250));
  }

  toggleMenu() {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.hamburger.classList.add('active');
    this.mobileNav.classList.add('active');
    this.overlay.classList.add('active');
    this.body.classList.add('menu-open');
    
    // Prevent scrolling on body
    this.body.style.overflow = 'hidden';
    
    // Update ARIA attributes
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.mobileNav.setAttribute('aria-hidden', 'false');
  }

  closeMenu() {
    this.hamburger.classList.remove('active');
    this.mobileNav.classList.remove('active');
    this.overlay.classList.remove('active');
    this.body.classList.remove('menu-open');
    
    // Restore scrolling
    this.body.style.overflow = '';
    
    // Update ARIA attributes
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.mobileNav.setAttribute('aria-hidden', 'true');
    
    // Reset dropdown state
    if (window.mobileDropdown) {
      window.mobileDropdown.reset();
    }
  }

  isMenuOpen() {
    return this.mobileNav.classList.contains('active');
  }
}

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Select all anchor links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if href is just #
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          // Calculate offset for fixed header
          const headerHeight = document.getElementById('header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }
}

// ===================================
// ACTIVE NAV LINK ON SCROLL
// ===================================

class ActiveNavLink {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    if (this.sections.length === 0 || this.navLinks.length === 0) return;

    // Use throttled scroll handler
    window.addEventListener('scroll', throttle(() => {
      this.updateActiveLink();
    }, 100));

    // Check on load
    this.updateActiveLink();
  }

  updateActiveLink() {
    // Use requestAnimationFrame to batch layout reads
    requestAnimationFrame(() => {
      let currentSection = '';
      const scrollPosition = window.pageYOffset + 200;

      this.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      this.navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (href === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    });
  }
}

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.elements.forEach(element => {
      observer.observe(element);
    });
  }
}

// ===================================
// ANIMATED COUNTER FOR STATS
// ===================================

class AnimatedCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.animated = false;
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animateCounters();
          this.animated = true;
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.5
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateCounters() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  }
}

// ===================================
// BACK TO TOP BUTTON
// ===================================

class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.scrollThreshold = 300;
    this.init();
  }

  init() {
    if (!this.button) return;

    // Show/hide button on scroll
    window.addEventListener('scroll', throttle(() => {
      this.toggleVisibility();
    }, 100));

    // Scroll to top on click
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  toggleVisibility() {
    if (window.scrollY > this.scrollThreshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }
}

// ===================================
// IMAGE LAZY LOADING (FALLBACK)
// ===================================

class LazyLoadImages {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    this.init();
  }

  init() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for browsers that don't support native lazy loading
    if (this.images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    this.images.forEach(img => imageObserver.observe(img));
  }
}

// ===================================
// ERROR HANDLING FOR IMAGES
// ===================================

class ImageErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    // Add error handling to all images
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('error', function() {
        // Hide image if it fails to load
        this.style.display = 'none';
        
        // Optionally show a placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = 'Image unavailable';
        placeholder.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          color: #999;
          height: 100%;
          min-height: 200px;
        `;
        
        if (this.parentElement) {
          this.parentElement.appendChild(placeholder);
        }
      });
    });
  }
}

// ===================================
// ENHANCED MOBILE DROPDOWN TOGGLE
// With auto-expand for portfolio pages
// ===================================

class MobileDropdownToggle {
  constructor() {
    this.activeDropdowns = new Map();
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupMobileDropdown();
      });
    } else {
      this.setupMobileDropdown();
    }
  }

  setupMobileDropdown() {
    const mobileNav = document.querySelector('.mobile-nav');
    if (!mobileNav) {
      setTimeout(() => this.setupMobileDropdown(), 100);
      return;
    }

    const navDropdowns = mobileNav.querySelectorAll('.nav-dropdown');
    if (navDropdowns.length === 0) return;
    
    navDropdowns.forEach((navDropdown, index) => {
      const portfolioLink = navDropdown.querySelector('.nav-link-dropdown');
      const mobileSubmenu = navDropdown.querySelector('.mobile-submenu');
      if (!portfolioLink || !mobileSubmenu) return;

      // Check if Portfolio is already active (we're on a portfolio page)
      const isOnPortfolioPage = portfolioLink.classList.contains('active');
      
      // Initialize state
      this.activeDropdowns.set(index, false);

      // Set initial styles
      mobileSubmenu.style.maxHeight = '0';
      mobileSubmenu.style.overflow = 'hidden';
      mobileSubmenu.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
      mobileSubmenu.style.opacity = '0';
      
      // If on a portfolio page, auto-expand when menu opens
      if (isOnPortfolioPage) {
        // Watch for when the mobile menu is opened
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
              // Menu was opened, auto-expand portfolio
              setTimeout(() => {
                if (!this.activeDropdowns.get(index)) {
                  this.openSubmenu(portfolioLink, mobileSubmenu, index);
                }
              }, 100);
            } else {
              // Menu was closed, reset
              if (this.activeDropdowns.get(index)) {
                this.closeSubmenu(portfolioLink, mobileSubmenu, index);
              }
            }
          });
        });
        
        observer.observe(mobileNav, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
      
      // Add click event to portfolio link
      portfolioLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSubmenu(portfolioLink, mobileSubmenu, index);
      });

      // Prevent submenu links from closing the dropdown
      const submenuLinks = mobileSubmenu.querySelectorAll('.submenu-link');
      submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => e.stopPropagation());
      });
    });
  }

  openSubmenu(portfolioLink, mobileSubmenu, index) {
    const scrollHeight = mobileSubmenu.scrollHeight;
    mobileSubmenu.style.maxHeight = (scrollHeight + 40) + 'px';
    mobileSubmenu.style.opacity = '1';
    portfolioLink.setAttribute('aria-expanded', 'true');
    this.activeDropdowns.set(index, true);
  }

  closeSubmenu(portfolioLink, mobileSubmenu, index) {
    mobileSubmenu.style.maxHeight = '0';
    mobileSubmenu.style.opacity = '0';
    portfolioLink.setAttribute('aria-expanded', 'false');
    this.activeDropdowns.set(index, false);
  }

  toggleSubmenu(portfolioLink, mobileSubmenu, index) {
    const isOpen = this.activeDropdowns.get(index);
    
    if (isOpen) {
      this.closeSubmenu(portfolioLink, mobileSubmenu, index);
    } else {
      this.openSubmenu(portfolioLink, mobileSubmenu, index);
    }
  }

  reset() {
    const mobileNav = document.querySelector('.mobile-nav');
    if (!mobileNav) return;

    const mobileSubmenus = mobileNav.querySelectorAll('.mobile-submenu');
    const portfolioLinks = mobileNav.querySelectorAll('.nav-link-dropdown');

    mobileSubmenus.forEach(submenu => {
      submenu.style.maxHeight = '0';
      submenu.style.opacity = '0';
    });

    portfolioLinks.forEach(link => {
      link.setAttribute('aria-expanded', 'false');
    });

    this.activeDropdowns.forEach((value, key) => {
      this.activeDropdowns.set(key, false);
    });
  }
}


// ===================================
// BLOG CATEGORY FILTER
// ===================================

class BlogFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll('.category-btn');
    this.blogCards = document.querySelectorAll('.blog-card');
    this.init();
  }

  init() {
    if (this.filterButtons.length === 0 || this.blogCards.length === 0) return;

    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleFilterClick(e.target);
      });
    });
  }

  handleFilterClick(button) {
    const category = button.getAttribute('data-category');

    // Update active button
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filter blog cards
    this.filterCards(category);
  }

  filterCards(category) {
    this.blogCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardLink = card.closest('.blog-card-link') || card;

      if (category === 'all' || cardCategory === category) {
        // Show card
        cardLink.style.display = '';
        card.style.animation = 'fadeIn 0.5s ease-in';
      } else {
        // Hide card
        cardLink.style.display = 'none';
      }
    });
  }
}


// ===================================
// INITIALIZE ALL MODULES
// ===================================

class App {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeModules();
      });
    } else {
      this.initializeModules();
    }
  }

  initializeModules() {
    try {
      // Initialize all modules
      new LoadingScreen();
      new HeaderScroll();
      new HamburgerMenu();
      new SmoothScroll();
      new ActiveNavLink();
      new ScrollReveal();
      new AnimatedCounter();
      new BackToTop();
      new LazyLoadImages();
      new ImageErrorHandler();
      new BlogFilter();

      // Initialize mobile dropdown and make it globally accessible
      window.mobileDropdown = new MobileDropdownToggle();
    } catch (error) {
      console.error('Error initializing website:', error);
    }
  }
}

// Start the application
new App();

// ===================================
// EXPORT FOR TESTING (OPTIONAL)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    debounce,
    throttle,
    LoadingScreen,
    HeaderScroll,
    HamburgerMenu,
    SmoothScroll,
    ActiveNavLink,
    ScrollReveal,
    AnimatedCounter,
    BackToTop,
    BlogFilter,
    MobileDropdownToggle
  };
}