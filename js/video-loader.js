/**
 * Video background loader for footer
 * Handles loading, error cases, and fallbacks
 * Version 1.3 - Enhanced visibility and forced display
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log("Video loader script initialized");
  
  // Apply video container visibility immediately - IMPORTANT
  const videoContainer = document.querySelector('.footer-video-container');
  const video = document.querySelector('.footer-video');
  
  if (videoContainer) {
    // Force display of video container
    videoContainer.style.display = 'block';
    videoContainer.style.opacity = '1';
    videoContainer.classList.add('video-active');
  }
  
  if (!video) {
    document.body.classList.add('no-video');
    console.error('Video element not found in the DOM');
    return;
  }
  
  // Force display of video element
  video.style.display = 'block';
  video.style.opacity = '0.6'; // Match CSS opacity
  
  // Enable controls for debugging
  if (window.location.href.includes('debug')) {
    video.controls = true;
  }
  
  // Check video source exists
  const source = video.querySelector('source');
  if (!source || !source.src) {
    console.error('Video source not found or empty');
    document.body.classList.add('no-video');
    return;
  }
  
  console.log('Attempting to load video from:', source.src);
  
  // Force reload
  video.load();
  
  // Force play - important for mobile
  setTimeout(function() {
    console.log('Forcing video play attempt...');
    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Video played successfully');
          document.body.classList.add('video-playing');
        }).catch(error => {
          console.warn('Autoplay prevented:', error);
          // Still make video visible even if autoplay fails
          video.style.opacity = '0.6';
          document.body.classList.add('video-loaded');
        });
      }
    } catch (e) {
      console.warn('Video play attempt error:', e);
    }
  }, 100);
  
  // Event listeners for video states
  video.addEventListener('loadstart', () => {
    console.log('Video loading started');
  });
  
  video.addEventListener('canplay', () => {
    console.log('Video can be played');
    document.body.classList.add('video-loaded');
    video.style.opacity = '0.6';
  });
  
  video.addEventListener('loadeddata', () => {
    console.log('Video loaded successfully');
    document.body.classList.add('video-loaded');
    video.style.opacity = '0.6';
  });
  
  video.addEventListener('playing', () => {
    console.log('Video is playing');
    document.body.classList.add('video-playing');
    video.style.opacity = '0.6';
  });
  
  video.addEventListener('error', () => {
    console.error('Video loading error. Code:', video.error ? video.error.code : 'unknown');
    document.body.classList.add('no-video');
  });
  
  // Reload video if it stalls
  video.addEventListener('stalled', () => {
    console.warn('Video playback stalled - attempting reload');
    setTimeout(() => video.load(), 1000);
  });
  
  // If video ends for some reason (should be looping but just in case)
  video.addEventListener('ended', () => {
    console.log('Video ended - restarting');
    video.play().catch(e => console.warn('Could not restart video:', e));
  });
  
  // Source error handling
  if (source) {
    source.addEventListener('error', (e) => {
      console.error('Video source error:', e);
      document.body.classList.add('no-video');
    });
  }
  
  // Check video dimensions when metadata is loaded
  video.addEventListener('loadedmetadata', () => {
    console.log('Video metadata loaded. Dimensions:', video.videoWidth, 'x', video.videoHeight);
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Invalid video dimensions');
      document.body.classList.add('no-video');
    }
  });
}); 