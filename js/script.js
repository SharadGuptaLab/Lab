document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation link based on current page
  highlightCurrentPage();
  
  // Mobile menu toggle
  setupMobileNavigation();
  
  // Publications filter functionality
  setupPublicationsFilter();
  
  // Smooth scrolling for anchors
  setupSmoothScrolling();
  
  // Image Gallery setup
  setupImageGallery();
  
  // Animation trigger on initial load
  triggerInitialAnimations();
  
  // Team member filtering
  const filterBtns = document.querySelectorAll('.category-filter .filter-btn');
  const memberCards = document.querySelectorAll('.member-card');
  
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        // Filter team members
        memberCards.forEach(card => {
          if (filter === 'all') {
            card.style.display = 'block';
          } else {
            if (card.getAttribute('data-category') === filter) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // Alumni filtering
  const alumniFilterBtns = document.querySelectorAll('.alumni-filter .filter-btn');
  const alumniSections = document.querySelectorAll('.alumni-section');
  
  if (alumniFilterBtns.length > 0) {
    alumniFilterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        alumniFilterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        // Filter alumni sections
        alumniSections.forEach(section => {
          if (filter === 'all') {
            section.style.display = 'block';
          } else {
            if (section.getAttribute('data-category') === filter) {
              section.style.display = 'block';
            } else {
              section.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // Back to top button
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Smooth scrolling for anchor links
  const anchors = document.querySelectorAll('a[href^="#"]');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Accounting for header height
            behavior: 'smooth'
          });
          
          // Update URL without page reload
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // Animate team members on scroll
  const memberSections = document.querySelectorAll('.member-category, .alumni-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.member-card, .alumni-item').forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, 100 * index);
        });
      }
    });
  }, { threshold: 0.1 });
  
  memberSections.forEach(section => {
    observer.observe(section);
  });

  // Functionality for collapsible publication years
  const yearToggles = document.querySelectorAll('.year-toggle');
  yearToggles.forEach(toggle => {
    const list = toggle.nextElementSibling; // The div.publications-list
    const icon = toggle.querySelector('.toggle-icon');

    // Start with lists collapsed (except maybe the first/most recent year)
    if (list && !toggle.parentElement.classList.contains('active')) { // Check if parent has 'active' class
      list.style.display = 'none';
      if (icon) icon.textContent = '+';
    }
    
    // Keep first year expanded by default (optional)
    const firstYearSection = document.querySelector('.year-section');
    if (toggle.parentElement === firstYearSection) {
      list.style.display = 'block';
      if (icon) icon.textContent = '-';
      toggle.parentElement.classList.add('active');
    }

    toggle.addEventListener('click', () => {
      if (list) {
        const isActive = toggle.parentElement.classList.toggle('active');
        list.style.display = isActive ? 'block' : 'none';
        if (icon) icon.textContent = isActive ? '-' : '+';
      }
    });
  });

  // Functionality for live search/filter
  const searchInput = document.getElementById('searchInput');
  const publicationItems = document.querySelectorAll('.publication-box'); // Individual publication entries
  const yearSections = document.querySelectorAll('.year-section'); // Year sections

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      let anyVisibleInYear = false;

      yearSections.forEach(yearSection => {
        const pubsInYear = yearSection.querySelectorAll('.publication-box');
        let yearHasVisiblePub = false;

        pubsInYear.forEach(item => {
          const textContent = item.textContent.toLowerCase();
          const isVisible = textContent.includes(searchTerm);
          item.style.display = isVisible ? '' : 'none'; // Show/hide publication item
          if (isVisible) {
            yearHasVisiblePub = true;
          }
        });

        // Show/hide the entire year section based on whether it contains visible publications
        // Also ensures the year section is visible if the search term matches the year itself
        const yearText = yearSection.querySelector('.year-toggle').textContent.toLowerCase();
        if (yearHasVisiblePub || yearText.includes(searchTerm)) {
          yearSection.style.display = ''; 
          anyVisibleInYear = true; // Track if at least one year section is visible
          // Optional: Expand the year section if it contains matches and is collapsed
          const list = yearSection.querySelector('.publications-list');
          const icon = yearSection.querySelector('.toggle-icon');
          if (yearHasVisiblePub && list && list.style.display === 'none') {
            // list.style.display = 'block'; 
            // toggle.parentElement.classList.add('active'); // Uncomment to auto-expand
            // if (icon) icon.textContent = '-'; // Uncomment to auto-expand
          }
        } else {
          yearSection.style.display = 'none';
        }
      });

      // Optional: Display a message if no results found
      // You would need to add an element with id="noResultsMessage" in your HTML
      const noResultsMessage = document.getElementById('noResultsMessage'); 
      if (noResultsMessage) {
        noResultsMessage.style.display = anyVisibleInYear ? 'none' : 'block';
      }
    });
  }

  // News Page: Year filter functionality
  const newsFilterBtns = document.querySelectorAll('.news-filter .filter-btn');
  const newsItems = document.querySelectorAll('.news-item'); // Should match the updated HTML class
  const newsYearSections = document.querySelectorAll('.news-simple .year-section');
  
  // Only run this block if elements for news filtering exist
  if (newsFilterBtns.length > 0 && newsItems.length > 0 && newsYearSections.length > 0) {
    newsFilterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        newsFilterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const year = this.getAttribute('data-year');
        
        // Show all sections first
        newsYearSections.forEach(section => {
          section.style.display = 'block';
          // Optional: Show all news items within the sections initially if needed, 
          // but hiding/showing the section is usually sufficient.
          // section.querySelectorAll('.news-item').forEach(item => item.style.display = 'block');
        });
        
        // If specific year selected, hide other year sections
        if (year !== 'all') {
          newsYearSections.forEach(section => {
            if (section.id !== `year-${year}`) {
              section.style.display = 'none';
            } else {
              // Ensure the selected year's section is visible
              section.style.display = 'block';
            }
          });
        } 
        // No need for an 'else' block to explicitly show all items/sections 
        // if 'all' is clicked, as the initial loop already makes them 'block'.
      });
    });
  }
});

// Highlight the current page in navigation
function highlightCurrentPage() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('nav ul li a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPage.endsWith(linkPath)) {
      link.classList.add('active');
    } else if (currentPage.endsWith('/') && linkPath === 'index.html') {
      link.classList.add('active');
    }
  });
}

// Setup mobile navigation
function setupMobileNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  const body = document.body;
  
  if (!menuToggle || !navMenu) return;
  
  // Set initial ARIA attributes
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-controls', 'nav-menu');
  navMenu.setAttribute('id', 'nav-menu');
  
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    menuToggle.classList.toggle('menu-active');
    navMenu.classList.toggle('menu-open');
    body.classList.toggle('menu-is-open');
    
    // Update ARIA attributes
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !expanded);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (navMenu.classList.contains('menu-open') && !event.target.closest('nav')) {
      menuToggle.classList.remove('menu-active');
      navMenu.classList.remove('menu-open');
      body.classList.remove('menu-is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuToggle.classList.remove('menu-active');
      navMenu.classList.remove('menu-open');
      body.classList.remove('menu-is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navMenu.classList.contains('menu-open')) {
      menuToggle.classList.remove('menu-active');
      navMenu.classList.remove('menu-open');
      body.classList.remove('menu-is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 992 && navMenu.classList.contains('menu-open')) {
      menuToggle.classList.remove('menu-active');
      navMenu.classList.remove('menu-open');
      body.classList.remove('menu-is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Setup publications filter
function setupPublicationsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!filterButtons.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      const items = document.querySelectorAll('.publication-item');
      
      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-year') === filter) {
          item.style.display = 'block';
          // Add animation
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Setup smooth scrolling for anchors
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Trigger initial animations
function triggerInitialAnimations() {
  setTimeout(() => {
    document.querySelectorAll('.research-area, .publication-item, .team-member').forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, 100 * index);
    });
  }, 300);
}

// Setup Image Gallery
function setupImageGallery() {
  const gallery = document.querySelector('.image-gallery');
  if (!gallery) return; // Exit if no gallery on the page

  const slides = gallery.querySelectorAll('.gallery-slide');
  const prevBtn = gallery.querySelector('.gallery-control.prev');
  const nextBtn = gallery.querySelector('.gallery-control.next');
  const pausePlayBtn = gallery.querySelector('.gallery-control.pause-play');
  const pauseIcon = '<i class="fas fa-pause"></i>';
  const playIcon = '<i class="fas fa-play"></i>';

  let currentSlide = 0;
  let slideInterval;
  let isPlaying = true;
  const intervalTime = 4000; // 4 seconds

  if (slides.length <= 1) {
      // Hide controls if only one or zero slides
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (pausePlayBtn) pausePlayBtn.parentElement.style.display = 'none'; // Hide the controls container
      return; // No need for slideshow logic
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      // Ensure correct styling for non-active slides (needed for fade)
      slide.style.position = 'absolute'; 
      slide.style.opacity = '0';
      slide.style.visibility = 'hidden';
    });

    currentSlide = (index + slides.length) % slides.length; // Loop around
    
    // Apply active styles
    slides[currentSlide].classList.add('active');
    slides[currentSlide].style.position = 'relative';
    slides[currentSlide].style.opacity = '1';
    slides[currentSlide].style.visibility = 'visible';
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    stopAutoSlide(); // Clear existing interval first
    slideInterval = setInterval(nextSlide, intervalTime);
    isPlaying = true;
    if (pausePlayBtn) {
        pausePlayBtn.innerHTML = pauseIcon;
        pausePlayBtn.setAttribute('aria-label', 'Pause slideshow');
    }
  }

  function stopAutoSlide() {
    clearInterval(slideInterval);
    isPlaying = false;
    if (pausePlayBtn) {
        pausePlayBtn.innerHTML = playIcon;
        pausePlayBtn.setAttribute('aria-label', 'Play slideshow');
    }
  }

  // Event Listeners
  if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        if (isPlaying) startAutoSlide(); // Restart timer on manual click
      });
  }

  if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        if (isPlaying) startAutoSlide(); // Restart timer on manual click
      });
  }
  
  if (pausePlayBtn) {
      pausePlayBtn.addEventListener('click', () => {
          if (isPlaying) {
              stopAutoSlide();
          } else {
              // Optionally show next slide immediately when resuming play
              // nextSlide(); 
              startAutoSlide();
          }
      });
  }

  // Initialize
  showSlide(0); // Show the first slide initially
  startAutoSlide(); // Start the slideshow
  
  // Optional: Pause on hover
  const galleryContainer = gallery.querySelector('.gallery-container');
  if (galleryContainer) {
      galleryContainer.addEventListener('mouseenter', () => {
          if (isPlaying) stopAutoSlide();
      });
      galleryContainer.addEventListener('mouseleave', () => {
          // Only resume if it was playing before hover
          if (!isPlaying && pausePlayBtn && pausePlayBtn.innerHTML === pauseIcon) {
             startAutoSlide();
          }
      });
  }
}

// Script moved from index.html (force video display)
window.addEventListener('load', function() {
  const footer = document.querySelector('footer.with-video-bg'); // Be more specific if possible
  const video = document.querySelector('.footer-video');
  const container = document.querySelector('.footer-video-container');

  if (footer && video && container) {
    // Style modifications might be better handled in CSS
    // Consider if these styles are always needed or only on load
    footer.style.backgroundColor = '#1e3a8a'; // Consider using CSS class instead
    container.style.display = 'block';
    container.style.opacity = '1';
    video.style.display = 'block';
    video.style.opacity = '0.6'; 

    // Try playing directly
    video.play().catch(() => console.log('Footer video auto-play prevented by browser'));
  }

  // Make sure hero video plays as well
  const heroVideo = document.querySelector('.hero-video-background');
  if (heroVideo) {
    heroVideo.play().catch(() => console.log('Hero video auto-play prevented by browser'));
  }
}); 