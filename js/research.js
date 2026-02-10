document.addEventListener('DOMContentLoaded', function() {
  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const researchAreas = document.querySelectorAll('.research-area');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Show/hide research areas based on filter
      if (filter === 'all') {
        researchAreas.forEach(area => {
          area.classList.add('visible');
          setTimeout(() => {
            area.style.display = 'block';
          }, 10);
        });
      } else {
        researchAreas.forEach(area => {
          if (area.getAttribute('data-category') === filter) {
            area.classList.add('visible');
            setTimeout(() => {
              area.style.display = 'block';
            }, 10);
          } else {
            area.classList.remove('visible');
            setTimeout(() => {
              area.style.display = 'none';
            }, 500);
          }
        });
      }
    });
  });
  
  // Collapsible sections
  const researchHeaders = document.querySelectorAll('.research-area-header');
  
  researchHeaders.forEach(header => {
    header.addEventListener('click', function() {
      this.classList.toggle('collapsed');
      const content = this.nextElementSibling;
      content.classList.toggle('collapsed');
    });
  });
  
  // Back to top button
  const backToTopButton = document.querySelector('.back-to-top');
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Add animation delay to research areas for staggered appearance
  researchAreas.forEach((area, index) => {
    area.style.transitionDelay = `${index * 0.1}s`;
  });
}); 