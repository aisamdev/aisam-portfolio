// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================
document.documentElement.style.scrollBehavior = 'smooth';

// ============================================
// LOADING & INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Show skeleton loading initially
  showSkeletonLoading();

  // Initialize theme immediately (no loading needed)
  initializeTheme();
});

window.addEventListener('load', () => {
  // Hide skeleton and show content
  hideSkeletonLoading();
  document.body.style.opacity = '1';
  initializeAnimations();
  initializeVideoPopup();
  initializeYear();
});

// ============================================
// SKELETON LOADING
// ============================================
function showSkeletonLoading() {
  document.body.classList.add('loading');

  // Create skeleton elements if they don't exist
  const wrapper = document.querySelector('.wrapper');
  if (!wrapper) return;

  // Check if skeleton already exists
  if (document.querySelector('.skeleton-container')) return;

  const skeletonContainer = document.createElement('div');
  skeletonContainer.className = 'skeleton-container';
  skeletonContainer.innerHTML = `
    <aside class="left">
      <div class="skeleton skeleton-avatar"></div>
      <div class="skeleton skeleton-text short"></div>
      <div class="skeleton skeleton-text medium"></div>
      <div class="skeleton skeleton-text short"></div>
      <div class="skeleton skeleton-text short"></div>
      <div class="skeleton skeleton-stats">
        <div class="skeleton skeleton-stat"></div>
        <div class="skeleton skeleton-stat"></div>
        <div class="skeleton skeleton-stat"></div>
        <div class="skeleton skeleton-stat"></div>
      </div>
      <div class="skeleton skeleton-button"></div>
      <div class="skeleton skeleton-text medium"></div>
    </aside>
    <section class="right">
      <div class="skeleton skeleton-card">
        <div class="skeleton skeleton-text long"></div>
        <div class="skeleton skeleton-text long"></div>
        <div class="skeleton skeleton-text medium"></div>
      </div>
      <div class="skeleton skeleton-card">
        <div class="skeleton skeleton-text long"></div>
        <div class="skeleton skeleton-text medium"></div>
      </div>
      <div class="skeleton skeleton-card">
        <div class="skeleton skeleton-project"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    </section>
  `;

  // Insert skeleton before wrapper
  wrapper.parentNode.insertBefore(skeletonContainer, wrapper);

  // Hide actual content initially
  wrapper.style.opacity = '0';
  wrapper.style.pointerEvents = 'none';
}

function hideSkeletonLoading() {
  document.body.classList.remove('loading');

  const skeletonContainer = document.querySelector('.skeleton-container');
  const wrapper = document.querySelector('.wrapper');

  if (skeletonContainer) {
    // Fade out skeleton
    skeletonContainer.style.transition = 'opacity 0.3s ease-out';
    skeletonContainer.style.opacity = '0';

    // Show actual content
    if (wrapper) {
      wrapper.style.transition = 'opacity 0.3s ease-in 0.1s';
      wrapper.style.opacity = '1';
      wrapper.style.pointerEvents = 'auto';
    }

    // Remove skeleton after fade
    setTimeout(() => {
      if (skeletonContainer.parentNode) {
        skeletonContainer.parentNode.removeChild(skeletonContainer);
      }
    }, 300);
  } else if (wrapper) {
    // If no skeleton, just show content
    wrapper.style.opacity = '1';
    wrapper.style.pointerEvents = 'auto';
  }
}

// ============================================
// ANIMATION INITIALIZATION
// ============================================
function initializeAnimations() {
  // CSS animations are handled automatically on page load
  // All animations are now controlled via CSS with staggered delays
}

// ============================================
// CURRENT YEAR
// ============================================
function initializeYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ============================================
// DARK MODE TOGGLE
// ============================================
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  if (!themeToggle) return;

  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');

    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update icons
    if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block';
    if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none';
  });
}

// ============================================
// VIDEO POPUP FUNCTIONALITY
// ============================================
function initializeVideoPopup() {
  const popup = document.getElementById('videoPopup');
  const popupVideo = document.getElementById('popupVideo');

  if (!popup || !popupVideo) return;

  // Get all project elements
  const projects = document.querySelectorAll('.project[data-video]');

  const isComingSoon = (project) => {
    const hasComingSoonFlag = project.getAttribute('data-coming-soon') === 'true';
    const videoSrc = project.getAttribute('data-video');
    return hasComingSoonFlag || !videoSrc;
  };

  projects.forEach(project => {
    project.addEventListener('click', (e) => {
      e.preventDefault();
      if (isComingSoon(project)) {
        alert('Coming soon.');
        return;
      }
      const videoSrc = project.getAttribute('data-video');
      openVideoPopup(videoSrc);
    });

    // Keyboard support for projects
    project.setAttribute('tabindex', '0');
    project.setAttribute('role', 'button');
    project.setAttribute('aria-label', `Play ${project.querySelector('h4')?.textContent || 'video'}`);
    if (isComingSoon(project)) {
      project.setAttribute('aria-disabled', 'true');
    }

    project.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isComingSoon(project)) {
          alert('Coming soon.');
          return;
        }
        const videoSrc = project.getAttribute('data-video');
        openVideoPopup(videoSrc);
      }
    });
  });

  // Close button handlers
  const closeBtn = document.getElementById('closePopup');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoPopup);
  }

  // Close on backdrop click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closeVideoPopup();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closeVideoPopup();
    }
  });
}

function openVideoPopup(videoSrc) {
  const popup = document.getElementById('videoPopup');
  const popupVideo = document.getElementById('popupVideo');

  if (!popup || !popupVideo) return;

  // Prevent body scroll
  document.body.classList.add('no-scroll');

  // Set video source and show popup
  popupVideo.src = videoSrc;
  popup.classList.add('active');

  // Play video with slight delay for smooth animation
  setTimeout(() => {
    popupVideo.play().catch(err => {
      console.log('Autoplay prevented:', err);
    });
  }, 100);
}

function closeVideoPopup() {
  const popup = document.getElementById('videoPopup');
  const popupVideo = document.getElementById('popupVideo');

  if (!popup || !popupVideo) return;

  // Remove active class
  popup.classList.remove('active');

  // Pause and clear video
  popupVideo.pause();
  popupVideo.src = '';

  // Re-enable body scroll
  document.body.classList.remove('no-scroll');
}

// ============================================
// SMOOTH HOVER EFFECTS FOR INTERACTIVE ELEMENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Add smooth transitions to all interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project, .card');
  interactiveElements.forEach(el => {
    el.style.transition = 'all 0.2s ease';
  });

  // Email link hover effect
  const emailLink = document.querySelector('a[href^="mailto:"]');
  if (emailLink) {
    emailLink.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    emailLink.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy load images that are not yet in viewport
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
// Add focus-visible styles for keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
  // Ensure all interactive elements are keyboard accessible
  const focusableElements = document.querySelectorAll('a, button, [tabindex]');
  focusableElements.forEach(el => {
    el.addEventListener('focus', function() {
      this.style.outline = '2px solid var(--accent)';
      this.style.outlineOffset = '2px';
    });
    el.addEventListener('blur', function() {
      this.style.outline = '';
      this.style.outlineOffset = '';
    });
  });
});

// ============================================
// CONSOLE CLEANUP (Remove in production)
// ============================================
// Remove any console.log statements for production
// (Keeping this comment as a reminder)
